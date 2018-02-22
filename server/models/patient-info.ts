import { isNil, omitBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Address from './address';
import ComputedPatientStatus from './computed-patient-status';
import Email from './email';
import Patient from './patient';

export type PatientGenderOptions = 'male' | 'female' | 'transgender' | 'nonbinary' | null;

export interface IInitialPatientInfoOptions {
  patientId: string;
  updatedById: string;
  gender?: PatientGenderOptions;
  language?: string | null;
}

export interface IPatientInfoOptions {
  patientId: string;
  updatedById: string;
  gender?: string;
  language?: string;
  primaryAddressId?: string;
  primaryEmailId?: string;
}

interface IEditPatientInfo extends Partial<IPatientInfoOptions> {
  updatedById: string;
  gender?: string;
  language?: string;
  primaryAddressId?: string;
  primaryEmailId?: string;
}

/* tslint:disable:member-ordering */
export default class PatientInfo extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id: string;
  patientId: string;
  patient: Patient;
  gender: string;
  language: string;
  primaryAddressId: string;
  primaryAddress: Address;
  addresses: Address[];
  primaryEmailId: string;
  primaryEmail: Email;
  emails: Email[];
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
      language: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', 'nonbinary', 'transgender'] },
      primaryAddressId: { type: 'string', format: 'uuid' },
      primaryEmailId: { type: 'string', format: 'uuid' },
      updatedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'updatedById'],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_info.patientId',
        to: 'patient.id',
      },
    },

    addresses: {
      relation: Model.ManyToManyRelation,
      modelClass: 'address',
      join: {
        from: 'patient_info.patientId',
        through: {
          from: 'patient_address.patientId',
          to: 'patient_address.addressId',
        },
        to: 'address.id',
      },
    },

    primaryAddress: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'address',
      join: {
        from: 'address.id',
        to: 'patient_info.primaryAddressId',
      },
    },

    emails: {
      relation: Model.ManyToManyRelation,
      modelClass: 'email',
      join: {
        from: 'patient_info.patientId',
        through: {
          from: 'patient_email.patientId',
          to: 'patient_email.emailId',
        },
        to: 'email.id',
      },
    },

    primaryEmail: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'email',
      join: {
        from: 'email.id',
        to: 'patient_info.primaryEmailId',
      },
    },
  };

  static async get(patientInfoId: string, txn: Transaction): Promise<PatientInfo> {
    const patientInfo = await this.query(txn).findById(patientInfoId);

    if (!patientInfo) {
      return Promise.reject(`No such patient info: ${patientInfoId}`);
    }
    return patientInfo;
  }

  static async create(input: IPatientInfoOptions, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
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
      .eager('[primaryAddress, primaryEmail]')
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
