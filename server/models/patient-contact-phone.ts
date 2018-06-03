import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import PatientContact from './patient-contact';
import Phone from './phone';

interface IPatientContactPhoneOptions {
  phoneId: string;
  patientContactId: string;
}

/* tslint:disable:member-ordering */
export default class PatientContactPhone extends BaseModel {
  patientContact!: PatientContact;
  patientContactId!: string;
  phone!: Phone;
  phoneId!: string;

  static tableName = 'patient_contact_phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientContactId: { type: 'string', format: 'uuid' },
      phoneId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['phoneId', 'patientContactId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      phone: {
        relation: Model.BelongsToOneRelation,
        modelClass: Phone,
        join: {
          from: 'patient_contact_phone.phoneId',
          to: 'phone.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_contact_phone.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async getForPatientContact(patientContactId: string, txn: Transaction): Promise<Phone[]> {
    return (await PatientContactPhone.query(txn)
      .where({ patientContactId, deletedAt: null })
      .eager('phone')
      .orderBy('createdAt', 'asc')
      .pluck('phone')) as any;
  }

  static async create(
    { phoneId, patientContactId }: IPatientContactPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    const relations = await PatientContactPhone.query(txn).where({
      patientContactId,
      phoneId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientContactPhone.query(txn).insert({ patientContactId, phoneId });
    }

    return this.getForPatientContact(patientContactId, txn);
  }

  static async delete(
    { phoneId, patientContactId }: IPatientContactPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    await this.query(txn)
      .where({ phoneId, patientContactId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatientContact(patientContactId, txn);
  }
}
/* tslint:enable:member-ordering */
