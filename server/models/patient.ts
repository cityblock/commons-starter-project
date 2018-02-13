import { Model, RelationMappings, Transaction } from 'objection';
import { IPatientFilterOptions } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import { adminTasksConcernTitle } from '../lib/consts';
import BaseModel from './base-model';
import CarePlanSuggestion from './care-plan-suggestion';
import CareTeam from './care-team';
import Clinic from './clinic';
import ComputedPatientStatus from './computed-patient-status';
import Concern from './concern';
import PatientAnswer from './patient-answer';
import PatientConcern from './patient-concern';
import PatientDataFlag from './patient-data-flag';
import PatientInfo from './patient-info';
import Task from './task';
import User from './user';

// how fuzzy is patient name search (0 (match everything) to 1 (exact match))
const SIMILARITY_THRESHOLD = 0.2;

const EAGER_QUERY = '[patientInfo.[primaryAddress]]';

export interface IPatientEditableFields {
  firstName: string;
  middleName?: string | undefined | null;
  lastName: string;
  homeClinicId: string;
  dateOfBirth: string; // mm/dd/yy
  consentToCall: boolean;
  consentToText: boolean;
}

export interface IPatientInfoOptions {
  gender?: string;
  language?: string;
  primaryAddressId?: string;
}

interface IEditPatient extends Partial<IPatientEditableFields> {
  athenaPatientId?: number;
  scratchPad?: string;
}

interface IPatientSearchResult {
  userCareTeam: boolean;
}

interface IGetByOptions {
  fieldName: GetByFields;
  field?: string;
}

type GetByFields = 'athenaPatientId';

/* tslint:disable:member-ordering */
export default class Patient extends BaseModel {
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string;
  athenaPatientId: number;
  homeClinicId: string;
  homeClinic: Clinic;
  scratchPad: string;
  consentToCall: boolean;
  consentToText: boolean;
  tasks: Task[];
  patientInfo: PatientInfo;
  careTeam: User[];
  patientDataFlags: PatientDataFlag[];

  static tableName = 'patient';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      athenaPatientId: { type: 'number' },
      homeClinicId: { type: 'string' },
      firstName: { type: 'string', minLength: 1 }, // cannot be blank
      middleName: { type: 'string' },
      lastName: { type: 'string', minLength: 1 }, // cannot be blank
      dateOfBirth: { type: 'string' },
      scratchPad: { type: 'text' },
      consentToCall: { type: 'boolean' },
      consentToText: { type: 'boolean' },
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['firstName', 'lastName', 'dateOfBirth'],
  };

  static relationMappings: RelationMappings = {
    homeClinic: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'clinic',
      join: {
        from: 'patient.homeClinicId',
        to: 'clinic.id',
      },
    },

    careTeam: {
      relation: Model.ManyToManyRelation,
      modelClass: 'user',
      join: {
        from: 'patient.id',
        through: {
          from: 'care_team.patientId',
          to: 'care_team.userId',
        },
        to: 'user.id',
      },
    },

    tasks: {
      relation: Model.HasManyRelation,
      modelClass: 'task',
      join: {
        from: 'task.patientId',
        to: 'patient.id',
      },
    },

    patientInfo: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-info',
      join: {
        from: 'patient_info.patientId',
        to: 'patient.id',
      },
    },

    patientDataFlags: {
      relation: Model.HasManyRelation,
      modelClass: 'patient-data-flag',
      join: {
        from: 'patient_data_flag.patientId',
        to: 'patient.id',
      },
    },
  };

  static async get(patientId: string, txn: Transaction): Promise<Patient> {
    const patient = await this.query(txn)
      .eager('[patientInfo.[primaryAddress, addresses]]')
      .findById(patientId);

    if (!patient) {
      return Promise.reject(`No such patient: ${patientId}`);
    }
    return patient;
  }

  static async getAll(
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const patientsResult = (await this.query(txn)
      .eager(EAGER_QUERY)
      .page(pageNumber, pageSize)) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static async getAllIds(txn: Transaction): Promise<string[]> {
    const patientIds = await this.query(txn).select('id');

    return patientIds.map(patientId => patientId.id);
  }

  static async getBy(input: IGetByOptions, txn: Transaction): Promise<Patient | null> {
    if (!input.field) {
      return null;
    }

    const patient = await this.query(txn)
      .eager(EAGER_QUERY)
      .where(input.fieldName, input.field)
      .first();

    if (!patient) {
      return null;
    }

    return patient;
  }

  static async setup(
    input: IPatientEditableFields,
    infoInput: IPatientInfoOptions,
    userId: string,
    txn: Transaction,
  ) {
    const adminConcern = await Concern.findOrCreateByTitle(adminTasksConcernTitle, txn);
    const patient = await this.query(txn).insertAndFetch(input);
    const patientInfoInput = {
      ...infoInput,
      patientId: patient.id,
      updatedBy: userId,
    };
    await PatientInfo.create(patientInfoInput, txn);

    // Create the initial ComputedPatientStatus
    await ComputedPatientStatus.updateForPatient(patient.id, userId, txn);

    // TODO: once we actually figure out our patient onboarding flow, let's move to the resolver
    await PatientConcern.create(
      {
        concernId: adminConcern.id,
        patientId: patient.id,
        userId,
        startedAt: new Date().toISOString(),
      },
      txn,
    );

    return this.get(patient.id, txn);
  }

  static async createAllPatientInfo(userId: string, txn: Transaction) {
    const patientIds = await this.query(txn).pluck('id');
    const patientRows = patientIds.map(id => {
      return {
        patientId: id,
        updatedBy: userId,
      };
    });
    return PatientInfo.query(txn).insert(patientRows as any);
  }

  static async edit(patient: IEditPatient, patientId: string, txn: Transaction): Promise<Patient> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientId, patient);
  }

  // limit accidentally editing the athenaPatientId by only allowing it explicitly here
  static async addAthenaPatientId(
    athenaPatientId: number,
    patientId: string,
    txn: Transaction,
  ): Promise<Patient> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientId, { athenaPatientId });
  }

  static async search(
    query: string,
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient & IPatientSearchResult>> {
    if (!query) {
      return Promise.reject('Must provide a search term');
    }

    const patientsResult = (await this.query(txn)
      .eager(EAGER_QUERY)
      .select(
        'patient.*',
        this.raw(
          '(CASE WHEN care_team."userId" IS NULL THEN FALSE ELSE TRUE END) AS "userCareTeam"',
        ),
      )
      .joinRaw(
        'LEFT JOIN care_team ON patient.id = care_team."patientId" AND care_team."userId" = ?',
        userId,
      )
      .whereRaw(
        `similarity("firstName" || \' \' || "lastName", ?) > ${SIMILARITY_THRESHOLD}`,
        query,
      )
      .groupBy('patient.id', 'care_team.userId')
      .orderBy('userCareTeam', 'DESC')
      .orderByRaw('"firstName" || \' \' || "lastName" <-> ?', query)
      .page(pageNumber, pageSize)) as IPaginatedResults<Patient & IPatientSearchResult>;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static async filter(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    { ageMax, ageMin, gender, zip, careWorkerId }: Partial<IPatientFilterOptions>,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    if (!ageMax && !ageMin && !gender && !zip && !careWorkerId) {
      return CareTeam.getForUser(userId, { pageNumber, pageSize }, txn);
    }

    const builder = this.query(txn)
      .eager(EAGER_QUERY)
      .leftOuterJoinRelation('patientInfo.[primaryAddress]')
      .where('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn));

    if (gender) {
      builder.where('patientInfo.gender', gender);
    }
    if (zip) {
      builder.where('patientInfo:primaryAddress.zip', zip);
    }
    if (ageMax) {
      builder.whereRaw(`date_part('year', age(patient."dateOfBirth")) <= ${ageMax}`);
    }
    if (ageMin) {
      builder.whereRaw(`date_part('year', age(patient."dateOfBirth")) >= ${ageMin}`);
    }
    builder.orderBy('patient.createdAt');
    const patientResult = (await builder.page(pageNumber, pageSize)) as any;

    return {
      results: patientResult.results,
      total: patientResult.total,
    };
  }

  // Returns a list of patients on care team that have tasks due soon or task notifications
  static async getPatientsWithUrgentTasks(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereRaw(
        `patient.id IN
        (
          SELECT task."patientId"
          FROM task
          LEFT JOIN task_event ON task_event."taskId" = task.id AND task_event."deletedAt" IS NULL
          LEFT JOIN event_notification ON event_notification."taskEventId" = task_event.id
            AND event_notification."userId" = ? AND event_notification."deletedAt" IS NULL
          WHERE task."deletedAt" IS NULL
          AND ((task."assignedToId" = ? AND task."dueAt" < now() + interval \'1 day\')
            OR (event_notification.id IS NOT NULL AND event_notification."seenAt" IS NULL))
        )`,
        [userId, userId],
      ) // grab all patient ids for patients on care team that have relevant tasks
      .whereIn('patient.id', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);
  }

  static async getPatientsNewToCareTeam(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereRaw(
        `patient.id IN (
          SELECT care_team."patientId"
          FROM care_team
          WHERE care_team."userId" = ?
            AND care_team."createdAt" > now() - interval \'30 days\'
            AND care_team."deletedAt" IS NULL
        )`,
        userId,
      )
      .joinRaw(
        'INNER JOIN care_team ON care_team."patientId" = patient.id AND care_team."userId" = ?',
        userId,
      )
      .orderBy('care_team.createdAt', 'DESC')
      .page(pageNumber, pageSize);
  }

  static async getPatientsWithPendingSuggestions(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const userPatientsWithPendingSuggestions = CarePlanSuggestion.query(txn)
      .where({
        dismissedById: null,
        acceptedById: null,
      })
      .select('patientId');

    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereIn('patient.id', userPatientsWithPendingSuggestions)
      .where('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);
  }

  static async getPatientsWithMissingInfo(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .leftOuterJoinRelation('patientInfo')
      .where('patientInfo', null)
      .andWhere('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orWhere('patientInfo.gender', null)
      .andWhere('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orWhere('patientInfo.primaryAddressId', null)
      .andWhere('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize) as any;
  }

  static async getPatientsWithNoRecentEngagement(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereRaw(
        `
        patient.id NOT IN (
          SELECT progress_note."patientId"
          FROM progress_note
          WHERE progress_note."createdAt" > now() - interval \'60 days\'
            AND progress_note."deletedAt" IS NULL
        )
      `,
      )
      .whereIn('patient.id', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);
  }

  static async getPatientsWithOutOfDateMAP(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereRaw(
        `
      patient.id NOT IN (
        SELECT care_plan_update_event."patientId"
        FROM care_plan_update_event
        WHERE care_plan_update_event."createdAt" > now() - interval \'30 days\'
          AND care_plan_update_event."deletedAt" IS NULL
      )
    `,
      )
      .whereIn('patient.id', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);
  }

  static async getPatientsWithOpenCBOReferrals(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const userPatientsWithOpenCBOReferrals = Task.query(txn)
      .joinRaw(
        `INNER JOIN cbo_referral ON task."CBOReferralId" = cbo_referral.id
          AND task."assignedToId" = ?
          AND task."deletedAt" IS NULL`,
        userId,
      )
      .whereRaw('cbo_referral."CBOId" IS NULL AND cbo_referral."name" IS NULL')
      .orWhere({ sentAt: null })
      .orWhere({ acknowledgedAt: null })
      .select('patientId');

    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereIn('patient.id', userPatientsWithOpenCBOReferrals)
      .where('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);
  }

  static async getPatientsForComputedList(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    answerId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const patientIdsFromAnswer = PatientAnswer.query(txn)
      .where({
        answerId,
        applicable: true,
        deletedAt: null,
      })
      .select('patientId');

    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereIn('patient.id', patientIdsFromAnswer)
      .andWhere('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);
  }

  static userCareTeamPatientIdsQuery(userId: string, txn: Transaction) {
    return CareTeam.query(txn)
      .where({
        userId,
        deletedAt: null,
      })
      .select('patientId');
  }

  static getPatientIdForResource(patientId: string, txn?: Transaction) {
    return patientId;
  }
}
/* tslint:enable:member-ordering */
