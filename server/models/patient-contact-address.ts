import { Model, RelationMappings, Transaction } from 'objection';
import Address from './address';
import BaseModel from './base-model';
import PatientContact from './patient-contact';

interface IPatientContactAddressOptions {
  addressId: string;
  patientContactId: string;
}

/* tslint:disable:member-ordering */
export default class PatientContactAddress extends BaseModel {
  patientContact: PatientContact;
  patientContactId: string;
  address: Address;
  addressId: string;

  static tableName = 'patient_contact_address';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientContactId: { type: 'string', format: 'uuid' },
      addressId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['addressId', 'patientContactId'],
  };

  static relationMappings: RelationMappings = {
    address: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'address',
      join: {
        from: 'patient_contact_address.addressId',
        to: 'address.id',
      },
    },
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_contact_address.patientId',
        to: 'patient.id',
      },
    },
  };

  static async getForPatientContact(
    patientContactId: string,
    txn: Transaction,
  ): Promise<Address[]> {
    return (await PatientContactAddress.query(txn)
      .where({ patientContactId, deletedAt: null})
      .eager('address')
      .orderBy('createdAt', 'asc')
      .pluck('address')) as any;
  }

  static async create(
    { addressId, patientContactId }: IPatientContactAddressOptions,
    txn: Transaction,
  ): Promise<Address[]> {
    const relations = await PatientContactAddress.query(txn).where({
      patientContactId,
      addressId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientContactAddress.query(txn).insert({ patientContactId, addressId });
    }

    return this.getForPatientContact(patientContactId, txn);
  }

  static async delete(
    { addressId, patientContactId }: IPatientContactAddressOptions,
    txn: Transaction,
  ): Promise<Address[]> {
    await this.query(txn)
      .where({ addressId, patientContactId, deletedAt: null})
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatientContact(patientContactId, txn);
  }
}
/* tslint:enable:member-ordering */
