import { isEmpty, isNil, omitBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { Gender, IPatientFilterOptions } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import { adminTasksConcernTitle } from '../lib/consts';
import CarePlanSuggestion from './care-plan-suggestion';
import CareTeam from './care-team';
import Clinic from './clinic';
import ComputedPatientStatus from './computed-patient-status';
import Concern from './concern';
import PatientAnswer from './patient-answer';
import PatientConcern from './patient-concern';
import PatientDataFlag from './patient-data-flag';
import PatientInfo from './patient-info';
import PatientState from './patient-state';
import Phone from './phone';
import Task from './task';
import User from './user';

// how fuzzy is patient name search (0 (match everything) to 1 (exact match))
const SIMILARITY_THRESHOLD = 0.15;

const EAGER_QUERY = `[
  patientInfo.[
    primaryAddress,
    primaryEmail,
    primaryPhone,
  ],
  computedPatientStatus,
  patientDataFlags,
  patientState,
]`;

export interface IPatientCreateFields {
  patientId: string;
  cityblockId: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  homeClinicId: string;
  dateOfBirth: string; // mm/dd/yy
  ssn: string;
  ssnEnd: string;
  gender: Gender | null;
  language: string | null;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  nmi: string;
  mrn: string | null;
  productDescription: string | null;
  lineOfBusiness: string | null;
  medicaidPremiumGroup: string | null;
  pcpName: string | null;
  pcpPractice: string | null;
  pcpPhone: string | null;
  pcpAddress: string | null;
  memberId: string;
  insurance: string | null;
  inNetwork: boolean;
}

export interface IPatientUpdateFromAttributionFields {
  patientId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  ssnEnd: string;
  nmi: string;
  mrn: string | null;
  productDescription: string | null;
  lineOfBusiness: string | null;
  medicaidPremiumGroup: string | null;
  pcpName: string | null;
  pcpPractice: string | null;
  pcpPhone: string | null;
  pcpAddress: string | null;
  memberId: string;
  insurance: string | null;
  inNetwork: boolean;
}

export interface IPatientUpdateFields {
  patientId: string;
  cityblockId?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  homeClinicId?: string;
  dateOfBirth?: string; // mm/dd/yy
}

export interface IPatientInfoOptions {
  gender?: string;
  language?: string;
  primaryAddressId?: string;
}

interface IPatientSearchResult {
  userCareTeam: boolean;
}

/* tslint:disable:member-ordering */
export default class Patient extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  cityblockId!: number;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;
  firstName!: string;
  lastName!: string;
  middleName!: string | null;
  dateOfBirth!: string;
  ssnEnd!: string;
  ssn!: string;
  homeClinicId!: string;
  homeClinic!: Clinic;
  nmi!: string;
  mrn!: string | null;
  tasks!: Task[];
  patientInfo!: PatientInfo;
  careTeam!: User[];
  patientDataFlags!: PatientDataFlag[];
  coreIdentityVerifiedAt!: string | null;
  coreIdentityVerifiedById!: string | null;
  computedPatientStatus!: ComputedPatientStatus;
  patientState!: PatientState;
  phones!: Phone[];
  productDescription!: string | null;
  lineOfBusiness!: string | null;
  medicaidPremiumGroup!: string | null;
  pcpName!: string | null;
  pcpPractice!: string | null;
  pcpPhone!: string | null;
  pcpAddress!: string | null;
  memberId!: string;
  insurance!: string | null;
  inNetwork!: boolean;

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'patient';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      cityblockId: { type: 'number' },
      homeClinicId: { type: 'string' },
      firstName: { type: 'string', minLength: 1 }, // cannot be blank
      middleName: { type: 'string' },
      lastName: { type: 'string', minLength: 1 }, // cannot be blank
      dateOfBirth: { type: 'string' },
      ssn: { type: 'string', minLength: 1 },
      ssnEnd: { type: 'string', minLength: 1 },
      nmi: { type: 'string' }, // can probably add a constraint later...just not sure what data will look like
      mrn: { type: 'string' }, // can probably add a constraint later...just not sure what data will look like
      productDescription: { type: ['string', 'null'] },
      lineOfBusiness: { type: ['string', 'null'] },
      medicaidPremiumGroup: { type: ['string', 'null'] },
      pcpName: { type: ['string', 'null'] },
      pcpPractice: { type: ['string', 'null'] },
      pcpPhone: { type: ['string', 'null'] },
      pcpAddress: { type: ['string', 'null'] },
      memberId: { type: 'string', minLength: 1 },
      insurance: { type: ['string', 'null'] },
      inNetwork: { type: 'boolean' },
      coreIdentityVerifiedAt: { type: ['string', 'null'] },
      coreIdentityVerifiedById: { type: ['string', 'null'] },
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['id', 'cityblockId', 'firstName', 'lastName', 'dateOfBirth'],
  };

  static get relationMappings(): RelationMappings {
    return {
      homeClinic: {
        relation: Model.BelongsToOneRelation,
        modelClass: Clinic,
        join: {
          from: 'patient.homeClinicId',
          to: 'clinic.id',
        },
      },

      careTeam: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
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
        modelClass: Task,
        join: {
          from: 'task.patientId',
          to: 'patient.id',
        },
      },

      patientInfo: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientInfo,
        join: {
          from: 'patient_info.patientId',
          to: 'patient.id',
        },
      },

      patientDataFlags: {
        relation: Model.HasManyRelation,
        modelClass: PatientDataFlag,
        join: {
          from: 'patient_data_flag.patientId',
          to: 'patient.id',
        },
      },

      computedPatientStatus: {
        relation: Model.HasOneRelation,
        modelClass: ComputedPatientStatus,
        join: {
          from: 'computed_patient_status.patientId',
          to: 'patient.id',
        },
        modify: builder => builder.findOne({ deletedAt: null }),
      },

      patientState: {
        relation: Model.HasOneRelation,
        modelClass: PatientState,
        join: {
          from: 'patient_state.patientId',
          to: 'patient.id',
        },
        modify: builder => builder.findOne({ deletedAt: null }),
      },

      phones: {
        relation: Model.ManyToManyRelation,
        modelClass: Phone,
        join: {
          from: 'patient.id',
          through: {
            from: 'patient_phone.patientId',
            to: 'patient_phone.phoneId',
          },
          to: 'phone.id',
        },
      },
    };
  }

  static async get(patientId: string, txn: Transaction): Promise<Patient> {
    const patient = await this.query(txn)
      .eager(EAGER_QUERY)
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

  static async getById(patientId: string, txn: Transaction): Promise<Patient | null> {
    const patient = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: patientId });

    if (!patient) {
      return null;
    }

    return patient;
  }

  static async getSocialSecurityNumber(
    patientId: string,
    txn: Transaction,
  ): Promise<Patient | null> {
    const patient = await this.query(txn)
      .findOne({ id: patientId })
      .select('id', 'ssn');

    if (!patient) {
      return null;
    }

    return patient;
  }

  static async create(input: IPatientCreateFields, txn: Transaction) {
    const {
      patientId,
      cityblockId,
      firstName,
      middleName,
      lastName,
      homeClinicId,
      dateOfBirth,
      gender,
      language,
      ssn,
      ssnEnd,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      email,
      phone,
      nmi,
      mrn,
      productDescription,
      lineOfBusiness,
      medicaidPremiumGroup,
      pcpName,
      pcpPractice,
      pcpPhone,
      pcpAddress,
      memberId,
      insurance,
      inNetwork,
    } = input;
    const adminConcern = await Concern.findOrCreateByTitle(adminTasksConcernTitle, txn);
    const attributionUser = await User.findOrCreateAttributionUser(txn);
    const filteredInput = omitBy(
      {
        id: patientId,
        cityblockId,
        firstName,
        middleName,
        lastName,
        homeClinicId,
        dateOfBirth,
        ssn,
        ssnEnd,
        nmi,
        mrn,
        productDescription,
        lineOfBusiness,
        medicaidPremiumGroup,
        pcpName,
        pcpPractice,
        pcpPhone,
        pcpAddress,
        memberId,
        insurance,
        inNetwork,
      },
      isNil,
    );
    const patient = await this.query(txn).insertAndFetch(filteredInput);

    await PatientInfo.createInitialPatientInfo(
      {
        patientId,
        gender: gender ? gender : undefined,
        language,
        updatedById: attributionUser.id,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        email,
        phone,
      },
      txn,
    );
    await PatientConcern.create(
      {
        concernId: adminConcern.id,
        patientId,
        userId: attributionUser.id,
        startedAt: new Date().toISOString(),
      },
      txn,
    );

    await ComputedPatientStatus.updateForPatient(patientId, attributionUser.id, txn);

    return this.get(patient.id, txn);
  }

  static async updateFromAttribution(input: IPatientUpdateFromAttributionFields, txn: Transaction) {
    const { patientId } = input;

    await PatientDataFlag.deleteAllForPatient(patientId, txn);
    const updateInput = omitBy(
      {
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
        ssn: input.ssn,
        ssnEnd: input.ssnEnd,
        nmi: input.nmi,
        mrn: input.mrn,
      },
      isNil,
    );
    const finalUpdateInput = {
      ...updateInput,
      productDescription: input.productDescription,
      lineOfBusiness: input.lineOfBusiness,
      medicaidPremiumGroup: input.medicaidPremiumGroup,
      pcpName: input.pcpName,
      pcpPractice: input.pcpPractice,
      pcpPhone: input.pcpPhone,
      pcpAddress: input.pcpAddress,
      memberId: input.memberId,
      insurance: input.insurance,
      inNetwork: input.inNetwork,
    };
    const updatedPatient = await this.query(txn).patchAndFetchById(patientId, {
      ...finalUpdateInput,
      coreIdentityVerifiedById: null,
      coreIdentityVerifiedAt: null,
    });
    const attributionUser = await User.findOrCreateAttributionUser(txn);
    await ComputedPatientStatus.updateForPatient(patientId, attributionUser.id, txn);

    return updatedPatient;
  }

  static async createAllPatientInfo(userId: string, txn: Transaction) {
    const patientIds = await this.query(txn).pluck('id');
    const patientRows = patientIds.map(id => {
      return {
        patientId: id,
        updatedById: userId,
      };
    });
    return PatientInfo.query(txn).insert(patientRows as any);
  }

  static async coreIdentityVerify(
    patientId: string,
    userId: string,
    txn: Transaction,
  ): Promise<Patient> {
    await PatientDataFlag.deleteAllForPatient(patientId, txn);
    const patient = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientId, {
        coreIdentityVerifiedAt: new Date(Date.now()).toISOString(),
        coreIdentityVerifiedById: userId,
      });

    await ComputedPatientStatus.updateForPatient(patientId, userId, txn);

    return patient;
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
        'LEFT JOIN care_team ON patient.id = care_team."patientId" AND care_team."userId" = ? AND care_team."deletedAt" IS NULL',
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
    { ageMax, ageMin, gender, zip, careWorkerId, patientState }: Partial<IPatientFilterOptions>,
    showAllPatients: boolean,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    if (
      !ageMax &&
      !ageMin &&
      !gender &&
      !zip &&
      !careWorkerId &&
      !patientState &&
      !showAllPatients
    ) {
      return CareTeam.getForUser(userId, { pageNumber, pageSize }, txn);
    }

    const builder = this.query(txn)
      .eager(EAGER_QUERY)
      .leftOuterJoinRelation('patientInfo.[primaryAddress]');

    if (!showAllPatients) {
      builder.where('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn));
    }

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

    if (!isEmpty(patientState)) {
      builder
        .joinRaw(
          `
          LEFT OUTER JOIN patient_state ON patient.id = patient_state."patientId" AND patient_state."deletedAt" IS NULL
        `,
        )
        .where('patient_state.currentState', patientState);
    }

    if (!isEmpty(careWorkerId)) {
      builder
        .joinRaw(
          `
          LEFT OUTER JOIN care_team ON patient.id = care_team."patientId" AND care_team."deletedAt" IS NULL
        `,
        )
        .where('care_team.userId', careWorkerId);
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

  static async getPatientsWithRecentConversations(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .whereIn('patient.id', this.userCareTeamPatientIdsQuery(userId, txn))
      .joinRaw(
        `
        INNER JOIN (
          SELECT sms_message."patientId", MAX(sms_message."createdAt") AS latest_timestamp
          FROM sms_message
          WHERE sms_message."patientId" IS NOT NULL
          AND sms_message."deletedAt" IS NULL
          AND sms_message."userId" = ?
          AND (sms_message."createdAt" > now() - interval \'7 days\')
          GROUP BY sms_message."patientId"
        ) groupedSmsMessages
        ON groupedSmsMessages."patientId" = patient.id
      `,
        userId,
      )
      .orderBy('latest_timestamp', 'DESC')
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
        'INNER JOIN care_team ON care_team."patientId" = patient.id AND care_team."userId" = ? AND care_team."deletedAt" IS NULL',
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

  static async getPatientsWithAssignedState(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .leftOuterJoinRelation('patientState')
      .where('patientState.currentState', 'assigned')
      .andWhere('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize) as any;
  }

  static async getPatientsWithIntakeInProgress(
    { pageNumber, pageSize }: IPaginationOptions,
    userId: string,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .leftOuterJoinRelation('computedPatientStatus')
      .whereRaw(
        `
        (
          "isCoreIdentityVerified" IS NOT TRUE
          OR "isDemographicInfoUpdated" IS NOT TRUE
          OR "isEmergencyContactAdded" IS NOT TRUE
          OR "isAdvancedDirectivesAdded" IS NOT TRUE
          OR "isConsentSigned" IS NOT TRUE
          OR "isPhotoAddedOrDeclined" IS NOT TRUE
        )
      `,
      )
      .andWhere('patient.id', 'in', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .page(pageNumber, pageSize) as any;
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

  static async getPatientsWithPhonesForUser(userId: string, txn: Transaction): Promise<Patient[]> {
    return this.query(txn)
      .eager('[patientInfo, phones]', {
        orderByOrder: (builder: any) => {
          builder.orderBy('patientInfo.preferredName', 'ASC').orderBy('phone.createdAt', 'ASC');
        },
      })
      .modifyEager('phones', builder => {
        builder.where({ 'phone.deletedAt': null, 'patient_phone.deletedAt': null });
      })
      .whereIn('patient.id', this.userCareTeamPatientIdsQuery(userId, txn))
      .orderBy('lastName', 'ASC')
      .orderBy('firstName', 'ASC')
      .orderBy('middleName', 'ASC')
      .orderBy('createdAt', 'ASC');
  }
}
/* tslint:enable:member-ordering */
