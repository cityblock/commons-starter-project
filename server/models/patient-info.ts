import { isNil, omitBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { BirthSexOptions, ContactMethodOptions, Gender } from 'schema';
import * as uuid from 'uuid/v4';
import Address from './address';
import ComputedPatientStatus from './computed-patient-status';
import Email from './email';
import Patient from './patient';
import Phone from './phone';

const EAGER_QUERY = `[
  primaryAddress,
  primaryEmail,
  primaryPhone,
]`;

export interface IInitialPatientInfoOptions {
  patientId: string;
  updatedById: string;
  gender?: Gender;
  language?: string | null;
}

export interface IPatientInfoOptions {
  patientId: string;
  updatedById: string;
  preferredName?: string;
  gender?: Gender;
  sexAtBirth?: BirthSexOptions;
  language?: string;
  isMarginallyHoused?: boolean;
  primaryAddressId?: string;
  hasEmail?: boolean;
  primaryEmailId?: string;
  primaryPhoneId?: string;
  preferredContactMethod?: ContactMethodOptions;
  canReceiveCalls?: boolean;
  canReceiveTexts?: boolean;
  hasHealthcareProxy?: boolean;
  hasMolst?: boolean;
  hasDeclinedPhotoUpload?: boolean;
  needToKnow?: string;
}

interface IEditPatientInfo {
  updatedById: string;
  preferredName?: string;
  gender?: Gender;
  sexAtBirth?: BirthSexOptions;
  language?: string;
  isMarginallyHoused?: boolean;
  primaryAddressId?: string | null;
  hasEmail?: boolean;
  primaryEmailId?: string | null;
  primaryPhoneId?: string | null;
  preferredContactMethod?: ContactMethodOptions;
  canReceiveCalls?: boolean;
  canReceiveTexts?: boolean;
  hasHealthcareProxy?: boolean;
  hasMolst?: boolean;
  hasDeclinedPhotoUpload?: boolean;
  hasUploadedPhoto?: boolean;
  needToKnow?: string;
  googleCalendarId?: string;
}

/* tslint:disable:member-ordering */
export default class PatientInfo extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id: string;
  patientId: string;
  patient: Patient;
  preferredName: string;
  gender: Gender;
  sexAtBirth: BirthSexOptions;
  language: string;
  isMarginallyHoused: boolean;
  primaryAddressId: string | null;
  primaryAddress: Address;
  hasEmail: boolean;
  primaryEmailId: string | null;
  primaryEmail: Email;
  primaryPhoneId: string | null;
  primaryPhone: Phone;
  preferredContactMethod: ContactMethodOptions;
  canReceiveCalls: boolean;
  canReceiveTexts: boolean;
  hasHealthcareProxy: boolean;
  hasMolst: boolean;
  hasDeclinedPhotoUpload: boolean;
  hasUploadedPhoto: boolean;
  needToKnow: string | null;
  googleCalendarId: string;
  createdAt: string;
  updatedAt: string;

  $beforeInsert() {
    this.id = uuid();
    // NOTE: We are NOT setting updatedAt on insert. This is so we can know when first updated.
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'patient_info';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      preferredName: { type: 'string' },
      language: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', 'nonbinary', 'transgender'] },
      sexAtBirth: { type: 'string', enum: ['female', 'male'] },
      isMarginallyHoused: { type: 'boolean' },
      primaryAddressId: { type: ['string', 'null'], format: 'uuid' },
      hasEmail: { type: 'boolean' },
      primaryEmailId: { type: ['string', 'null'], format: 'uuid' },
      primaryPhoneId: { type: ['string', 'null'], format: 'uuid' },
      preferredContactMethod: { type: 'string', enum: ['text', 'phone', 'email'] },
      canReceiveCalls: { type: 'boolean' },
      canReceiveTexts: { type: 'boolean' },
      hasHealthcareProxy: { type: 'boolean' },
      hasMolst: { type: 'boolean' },
      hasDeclinedPhotoUpload: { type: 'boolean' },
      hasUploadedPhoto: { type: 'boolean' },
      needToKnow: { type: 'text' },
      googleCalendarId: { type: 'string' },
      updatedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'updatedById'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_info.patientId',
          to: 'patient.id',
        },
      },

      primaryAddress: {
        relation: Model.BelongsToOneRelation,
        modelClass: Address,
        join: {
          from: 'address.id',
          to: 'patient_info.primaryAddressId',
        },
      },

      primaryEmail: {
        relation: Model.BelongsToOneRelation,
        modelClass: Email,
        join: {
          from: 'email.id',
          to: 'patient_info.primaryEmailId',
        },
      },

      primaryPhone: {
        relation: Model.BelongsToOneRelation,
        modelClass: Phone,
        join: {
          from: 'phone.id',
          to: 'patient_info.primaryPhoneId',
        },
      },
    };
  }

  static async get(patientInfoId: string, txn: Transaction): Promise<PatientInfo> {
    const patientInfo = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientInfoId);

    if (!patientInfo) {
      return Promise.reject(`No such patient info: ${patientInfoId}`);
    }
    return patientInfo;
  }

  static async createInitialPatientInfo(input: IInitialPatientInfoOptions, txn: Transaction) {
    const filteredInput = omitBy<IInitialPatientInfoOptions>(input, isNil);
    const existingPatientInfo = await this.query(txn).findOne({ patientId: input.patientId });

    if (!existingPatientInfo) {
      return this.query(txn).insertAndFetch(filteredInput as any); // TODO: Fix type
    }

    return existingPatientInfo;
  }

  static async edit(
    patientInfo: IEditPatientInfo,
    patientInfoId: string,
    txn: Transaction,
  ): Promise<PatientInfo> {
    const updatedPatientInfo = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientInfoId, patientInfo);

    await ComputedPatientStatus.updateForPatient(
      updatedPatientInfo.patientId,
      patientInfo.updatedById,
      txn,
    );

    return updatedPatientInfo;
  }
}
/* tslint:enable:member-ordering */
