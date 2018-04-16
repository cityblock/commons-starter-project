import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Email from './email';
import Patient from './patient';
import PatientInfo from './patient-info';

interface IPatientEmailOptions {
  emailId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class PatientEmail extends BaseModel {
  patient: Patient;
  patientId: string;
  email: Email;
  emailId: string;

  static tableName = 'patient_email';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      emailId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['emailId', 'patientId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      email: {
        relation: Model.BelongsToOneRelation,
        modelClass: Email,
        join: {
          from: 'patient_email.emailId',
          to: 'email.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_email.patientId',
          to: 'patient.id',
        },
      },
      patientInfo: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientInfo,
        join: {
          from: 'patient_email.patientId',
          to: 'patient_info.patientId',
        },
      },
    };
  }

  static async getAll(patientId: string, txn: Transaction): Promise<Email[]> {
    return (await PatientEmail.query(txn)
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .eager('email')
      .orderBy('createdAt', 'asc')
      .pluck('email')) as any;
  }

  static async create(
    { emailId, patientId }: IPatientEmailOptions,
    txn: Transaction,
  ): Promise<Email[]> {
    const relations = await PatientEmail.query(txn).where({
      patientId,
      emailId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientEmail.query(txn).insert({ patientId, emailId });
    }

    return this.getAll(patientId, txn);
  }

  static async delete(
    { emailId, patientId }: IPatientEmailOptions,
    txn: Transaction,
  ): Promise<Email[]> {
    await this.query(txn)
      .where('emailId', emailId)
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .patch({ deletedAt: new Date().toISOString() });
    return this.getAll(patientId, txn);
  }
}
/* tslint:enable:member-ordering */
