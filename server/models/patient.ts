import { transaction, Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import { adminTasksConcernTitle } from '../lib/consts';
import BaseModel from './base-model';
import Clinic from './clinic';
import Concern from './concern';
import PatientConcern from './patient-concern';
import Task from './task';

// how fuzzy is patient name search (0 (match everything) to 1 (exact match))
const SIMILARITY_THRESHOLD = 0.2;

export interface IPatientEditableFields {
  firstName: string;
  middleName?: string | undefined | null;
  lastName: string;
  gender: string;
  zip: string;
  homeClinicId: string;
  dateOfBirth: string; // mm/dd/yy
  consentToCall: boolean;
  consentToText: boolean;
  language: string;
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
  gender: string;
  zip: string;
  athenaPatientId: number;
  homeClinicId: string;
  homeClinic: Clinic;
  scratchPad: string;
  consentToCall: boolean;
  consentToText: boolean;
  language: string;
  tasks: Task[];

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
      language: { type: 'string' },
      gender: { type: 'string' },
      dateOfBirth: { type: 'string' },
      zip: { type: 'string' },
      scratchPad: { type: 'text' },
      consentToCall: { type: 'boolean' },
      consentToText: { type: 'boolean' },
    },
    required: ['firstName', 'lastName'],
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
  };

  static async get(patientId: string, txn?: Transaction): Promise<Patient> {
    const patient = await this.query(txn).findById(patientId);

    if (!patient) {
      return Promise.reject(`No such patient: ${patientId}`);
    }
    return patient;
  }

  static async getAll(
    { pageNumber, pageSize }: IPaginationOptions,
    txn?: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const patientsResult = (await this.query(txn).page(pageNumber, pageSize)) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static async getBy(input: IGetByOptions, txn?: Transaction): Promise<Patient | null> {
    if (!input.field) {
      return null;
    }

    const patient = await this.query(txn)
      .where(input.fieldName, input.field)
      .first();

    if (!patient) {
      return null;
    }

    return patient;
  }

  static async setup(input: IPatientEditableFields, userId: string, existingTxn?: Transaction) {
    return await transaction(Patient.knex(), async txn => {
      const adminConcern = await Concern.findOrCreateByTitle(
        adminTasksConcernTitle,
        existingTxn || txn,
      );
      const patient = await this.query(existingTxn || txn).insertAndFetch(input);

      // TODO: once we actually figure out our patient onboarding flow, let's move to the resolver
      await PatientConcern.create(
        {
          concernId: adminConcern.id,
          patientId: patient.id,
          userId,
          startedAt: new Date().toISOString(),
        },
        existingTxn || txn,
      );

      return patient;
    });
  }

  static async edit(patient: IEditPatient, patientId: string, txn?: Transaction): Promise<Patient> {
    return await this.query(txn).patchAndFetchById(patientId, patient);
  }

  // limit accidentally editing the athenaPatientId by only allowing it explicitly here
  static async addAthenaPatientId(
    athenaPatientId: number,
    patientId: string,
    txn?: Transaction,
  ): Promise<Patient> {
    return this.query(txn).patchAndFetchById(patientId, { athenaPatientId });
  }

  static async execWithTransaction(
    callback: (boundModelClass: typeof Patient) => Promise<Patient>,
  ) {
    return await transaction(this as any, callback);
  }

  static async search(
    query: string,
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn?: Transaction,
  ): Promise<IPaginatedResults<Patient & IPatientSearchResult>> {
    if (!query) {
      return Promise.reject('Must provide a search term');
    }

    const patientsResult = (await this.query(txn)
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

  // Returns a list of patients on care team that have tasks due soon or task notifications
  static async getPatientsWithUrgentTasks(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn?: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const patientsResult = await this.query(txn)
      .whereRaw(
        `patient.id IN
        (
          SELECT care_team."patientId"
          FROM care_team
          INNER JOIN task ON task."patientId" = care_team."patientId" AND task."deletedAt" IS NULL
          LEFT JOIN task_event ON task_event."taskId" = task.id AND task_event."deletedAt" IS NULL
          LEFT JOIN event_notification ON event_notification."taskEventId" = task_event.id
            AND event_notification."userId" = ? AND event_notification."deletedAt" IS NULL
          WHERE care_team."userId" = ?
          AND care_team."deletedAt" IS NULL
          AND ((task."assignedToId" = ? AND task."dueAt" < now() + interval \'1 day\')
            OR (event_notification.id IS NOT NULL AND event_notification."seenAt" IS NULL))
        )`,
        [userId, userId, userId],
      ) // grab all patient ids for patients on care team that have relevant tasks
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);

    return patientsResult;
  }

  static async getPatientsNewToCareTeam(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn?: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const patientsResult = await this.query(txn)
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

    return patientsResult;
  }

  static async getPatientsWithPendingSuggestions(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn?: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const patientsResult = await this.query(txn)
      .whereRaw(
        `patient.id IN (
          SELECT care_team."patientId"
          FROM care_team
          INNER JOIN care_plan_suggestion ON care_plan_suggestion."patientId" = care_team."patientId"
            AND care_plan_suggestion."dismissedById" IS NULL
            AND care_plan_suggestion."acceptedById" IS NULL
          WHERE care_team."userId" = ?
            AND care_team."deletedAt" IS NULL
        )`,
        userId,
      )
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize);

    return patientsResult;
  }
}
/* tslint:enable:member-ordering */
