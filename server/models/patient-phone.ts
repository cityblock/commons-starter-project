import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import Phone from './phone';

interface IPatientPhoneOptions {
  phoneId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class PatientPhone extends BaseModel {
  patient: Patient;
  patientId: string;
  phone: Phone;
  phoneId: string;

  static tableName = 'patient_phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      phoneId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['phoneId', 'patientId'],
  };

  static relationMappings: RelationMappings = {
    phone: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'phone',
      join: {
        from: 'patient_phone.phoneId',
        to: 'phone.id',
      },
    },
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_phone.patientId',
        to: 'patient.id',
      },
    },
    patientInfo: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-info',
      join: {
        from: 'patient_phone.patientId',
        to: 'patient_info.patientId',
      },
    },
  };

  static async getAll(patientId: string, txn: Transaction): Promise<Phone[]> {
    return (await PatientPhone.query(txn)
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .eager('phone')
      .orderBy('createdAt', 'asc')
      .pluck('phone')) as any;
  }

  static async create(
    { phoneId, patientId }: IPatientPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    const relations = await PatientPhone.query(txn).where({
      patientId,
      phoneId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientPhone.query(txn).insert({ patientId, phoneId });
    }

    return this.getAll(patientId, txn);
  }

  static async delete(
    { phoneId, patientId }: IPatientPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    await this.query(txn)
      .where('phoneId', phoneId)
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .patch({ deletedAt: new Date().toISOString() });
    return this.getAll(patientId, txn);
  }
}
/* tslint:enable:member-ordering */
