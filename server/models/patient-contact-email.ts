import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Email from './email';
import Patient from './patient';
import PatientContact from './patient-contact';

interface IPatientContactEmailOptions {
  emailId: string;
  patientContactId: string;
}

/* tslint:disable:member-ordering */
export default class PatientContactEmail extends BaseModel {
  patientContact: PatientContact;
  patientContactId: string;
  email: Email;
  emailId: string;

  static tableName = 'patient_contact_email';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientContactId: { type: 'string', format: 'uuid' },
      emailId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['emailId', 'patientContactId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      email: {
        relation: Model.BelongsToOneRelation,
        modelClass: Email,
        join: {
          from: 'patient_contact_email.emailId',
          to: 'email.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_contact_email.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async getForPatientContact(patientContactId: string, txn: Transaction): Promise<Email[]> {
    return (await PatientContactEmail.query(txn)
      .where({ patientContactId, deletedAt: null })
      .eager('email')
      .orderBy('createdAt', 'asc')
      .pluck('email')) as any;
  }

  static async create(
    { emailId, patientContactId }: IPatientContactEmailOptions,
    txn: Transaction,
  ): Promise<Email[]> {
    const relations = await PatientContactEmail.query(txn).where({
      patientContactId,
      emailId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientContactEmail.query(txn).insert({ patientContactId, emailId });
    }

    return this.getForPatientContact(patientContactId, txn);
  }

  static async delete(
    { emailId, patientContactId }: IPatientContactEmailOptions,
    txn: Transaction,
  ): Promise<Email[]> {
    await this.query(txn)
      .where({ emailId, patientContactId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatientContact(patientContactId, txn);
  }
}
/* tslint:enable:member-ordering */
