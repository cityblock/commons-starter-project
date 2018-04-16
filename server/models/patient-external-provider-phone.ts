import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import PatientExternalProvider from './patient-external-provider';
import Phone from './phone';

interface IPatientExternalProviderPhoneOptions {
  phoneId: string;
  patientExternalProviderId: string;
}

/* tslint:disable:member-ordering */
export default class PatientExternalProviderPhone extends BaseModel {
  patientExternalProvider: PatientExternalProvider;
  patientExternalProviderId: string;
  phone: Phone;
  phoneId: string;

  static tableName = 'patient_external_provider_phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientExternalProviderId: { type: 'string', format: 'uuid' },
      phoneId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['phoneId', 'patientExternalProviderId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      phone: {
        relation: Model.BelongsToOneRelation,
        modelClass: Phone,
        join: {
          from: 'patient_external_provider_phone.phoneId',
          to: 'phone.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_external_provider_phone.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async getForPatientExternalProvider(
    patientExternalProviderId: string,
    txn: Transaction,
  ): Promise<Phone[]> {
    return (await PatientExternalProviderPhone.query(txn)
      .where({ patientExternalProviderId, deletedAt: null })
      .eager('phone')
      .orderBy('createdAt', 'asc')
      .pluck('phone')) as any;
  }

  static async create(
    { phoneId, patientExternalProviderId }: IPatientExternalProviderPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    const relations = await PatientExternalProviderPhone.query(txn).where({
      patientExternalProviderId,
      phoneId,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await PatientExternalProviderPhone.query(txn).insert({ patientExternalProviderId, phoneId });
    }

    return this.getForPatientExternalProvider(patientExternalProviderId, txn);
  }

  static async delete(
    { phoneId, patientExternalProviderId }: IPatientExternalProviderPhoneOptions,
    txn: Transaction,
  ): Promise<Phone[]> {
    await this.query(txn)
      .where({ phoneId, patientExternalProviderId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatientExternalProvider(patientExternalProviderId, txn);
  }
}
/* tslint:enable:member-ordering */
