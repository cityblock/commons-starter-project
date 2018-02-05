import { Model, RelationMappings, Transaction } from 'objection';
import Address from './address';
import BaseModel from './base-model';
import Patient from './patient';

export interface IPatientInfoOptions {
  patientId: string;
  updatedBy: string;
  gender?: string;
  language?: string;
  primaryAddressId?: string;
}

interface IEditPatientInfo extends Partial<IPatientInfoOptions> {
  updatedBy: string;
  gender?: string;
  language?: string;
  primaryAddressId?: string;
}

/* tslint:disable:member-ordering */
export default class PatientInfo extends BaseModel {
  patientId: string;
  patient: Patient;
  gender: string;
  language: string;
  primaryAddressId: string;
  primaryAddress: Address;
  addresses: Address[];

  static tableName = 'patient_info';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      language: { type: 'string' },
      gender: { type: 'string', enum: ['male', 'female', 'nonbinary', 'transgender'] },
      primaryAddressId: { type: 'string', format: 'uuid' },
      updatedAt: { type: 'string' },
      updatedBy: { type: 'string', format: 'uuid' },
    },
    required: ['patientId', 'updatedBy'],
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
