import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Email from './email';
import Patient from './patient';

import PatientExternalProvider from './patient-external-provider';

interface IPatientExternalProviderEmailOptions {
  emailId: string;
  patientExternalProviderId: string;
}

/* tslint:disable:member-ordering */
export default class PatientExternalProviderEmail extends BaseModel {
  patientExternalProvider: PatientExternalProvider;
  patientExternalProviderId: string;
  email: Email;
  emailId: string;

  static tableName = 'patient_external_provider_email';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientExternalProviderId: { type: 'string', format: 'uuid' },
      emailId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['emailId', 'patientExternalProviderId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      email: {
        relation: Model.BelongsToOneRelation,
        modelClass: Email,
        join: {
          from: 'patient_external_provider_email.emailId',
          to: 'email.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_external_provider_email.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async getForPatientExternalProvider(
    patientExternalProviderId: string,
    txn: Transaction,
  ): Promise<Email[]> {
    return (await PatientExternalProviderEmail.query(txn)
      .where({ patientExternalProviderId, deletedAt: null })
      .eager('email')
      .orderBy('createdAt', 'asc')
      .pluck('email')) as any;
  }

  static async create(
    { emailId, patientExternalProviderId }: IPatientExternalProviderEmailOptions,
    txn: Transaction,
  ): Promise<Email[]> {
    const relations = await PatientExternalProviderEmail.query(txn).where({
      patientExternalProviderId,
      emailId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientExternalProviderEmail.query(txn).insert({ patientExternalProviderId, emailId });
    }

    return this.getForPatientExternalProvider(patientExternalProviderId, txn);
  }

  static async delete(
    { emailId, patientExternalProviderId }: IPatientExternalProviderEmailOptions,
    txn: Transaction,
  ): Promise<Email[]> {
    await this.query(txn)
      .where({ emailId, patientExternalProviderId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatientExternalProvider(patientExternalProviderId, txn);
  }
}
/* tslint:enable:member-ordering */
