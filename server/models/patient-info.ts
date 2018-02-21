import { isNil, omitBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Address from './address';
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
}

interface IEditPatientInfo extends Partial<IPatientInfoOptions> {
  updatedById: string;
  gender?: string;
  language?: string;
  primaryAddressId?: string;
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
    return this.query(txn)
      .eager('primaryAddress')
      .patchAndFetchById(patientInfoId, patientInfo);
  }
}
/* tslint:enable:member-ordering */
