import { Model, RelationMappings, Transaction } from 'objection';
import Address from './address';
import BaseModel from './base-model';
import Patient from './patient';

interface IPatientAddressOptions {
  addressId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class PatientAddress extends BaseModel {
  patient: Patient;
  patientId: string;
  address: Address;
  addressId: string;

  static tableName = 'patient_address';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      addressId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['addressId', 'patientId'],
  };

  static relationMappings: RelationMappings = {
    address: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'address',
      join: {
        from: 'patient_address.addressId',
        to: 'address.id',
      },
    },
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_address.patientId',
        to: 'patient.id',
      },
    },
    patientInfo: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-info',
      join: {
        from: 'patient_address.patientId',
        to: 'patient_info.patientId',
      },
    },
  };

  static async getForPatient(patientId: string, txn: Transaction): Promise<Address[]> {
    return (await PatientAddress.query(txn)
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .eager('address')
      .orderBy('createdAt', 'asc')
      .pluck('address')) as any;
  }

  static async create(
    { addressId, patientId }: IPatientAddressOptions,
    txn: Transaction,
  ): Promise<Address[]> {
    const relations = await PatientAddress.query(txn).where({
      patientId,
      addressId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientAddress.query(txn).insert({ patientId, addressId });
    }

    return this.getForPatient(patientId, txn);
  }

  static async delete(
    { addressId, patientId }: IPatientAddressOptions,
    txn: Transaction,
  ): Promise<Address[]> {
    await this.query(txn)
      .where('addressId', addressId)
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatient(patientId, txn);
  }
}
/* tslint:enable:member-ordering */
