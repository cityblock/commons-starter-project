import { Model, RelationMappings, Transaction } from 'objection';
import { ExternalProviderOptions } from 'schema';
import BaseModel from './base-model';
import Email from './email';
import Patient from './patient';
import PatientExternalOrganization from './patient-external-organization';
import PatientExternalProviderEmail from './patient-external-provider-email';
import PatientExternalProviderPhone from './patient-external-provider-phone';
import Phone from './phone';

const EAGER_QUERY = '[email, phone, patientExternalOrganization]';

export interface IPatientExternalProviderOptions {
  patientId: string;
  updatedById: string;
  role: ExternalProviderOptions;
  roleFreeText?: string | null;
  lastName?: string;
  patientExternalOrganizationId: string;
  firstName?: string;
  description?: string;
}

interface IEditPatientExternalProvider extends Partial<IPatientExternalProviderOptions> {
  updatedById: string;
  role?: ExternalProviderOptions;
  roleFreeText?: string | null;
  lastName?: string;
  patientExternalOrganizationId?: string;
  firstName?: string;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class PatientExternalProvider extends BaseModel {
  id!: string;
  patientId!: string;
  updatedById!: string;
  role!: ExternalProviderOptions;
  roleFreeText!: string | null;
  lastName!: string;
  patientExternalOrganizationId!: string;
  patientExternalOrganization!: PatientExternalOrganization;
  firstName!: string;
  description!: string;
  createdAt!: string;
  updatedAt!: string;
  email!: Email;
  phone!: Phone;
  deletedAt!: string;

  static tableName = 'patient_external_provider';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      role: { type: 'string', minLength: 1 },
      roleFreeText: { type: ['string', 'null'] },
      firstName: { type: 'string', minLength: 1 },
      lastName: { type: 'string', minLength: 1 },
      patientExternalOrganizationId: { type: 'string', format: 'uuid' },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['patientId', 'updatedById', 'role', 'patientExternalOrganizationId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_external_provider.patientId',
          to: 'patient.id',
        },
      },

      patientExternalOrganization: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientExternalOrganization,
        join: {
          from: 'patient_external_provider.patientExternalOrganizationId',
          to: 'patient_external_organization.id',
        },
      },

      // has only one non-deleted email
      email: {
        relation: Model.HasOneThroughRelation,
        modelClass: Email,
        join: {
          from: 'patient_external_provider.id',
          through: {
            modelClass: PatientExternalProviderEmail,
            from: 'patient_external_provider_email.patientExternalProviderId',
            to: 'patient_external_provider_email.emailId',
          },
          to: 'email.id',
        },
      },

      phone: {
        relation: Model.HasOneThroughRelation,
        modelClass: Phone,
        join: {
          from: 'patient_external_provider.id',
          through: {
            modelClass: PatientExternalProviderPhone,
            from: 'patient_external_provider_phone.patientExternalProviderId',
            to: 'patient_external_provider_phone.phoneId',
          },
          to: 'phone.id',
        },
      },
    };
  }

  static async get(
    patientExternalProviderId: string,
    txn: Transaction,
  ): Promise<PatientExternalProvider> {
    const patientExternalProvider = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ deletedAt: null })
      .findById(patientExternalProviderId);

    if (!patientExternalProvider) {
      return Promise.reject(`No such patient external provider: ${patientExternalProviderId}`);
    }
    return patientExternalProvider;
  }

  static async getAllForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientExternalProvider[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ patientId, deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async getAllForOrganization(
    patientExternalOrganizationId: string,
    txn: Transaction,
  ): Promise<PatientExternalProvider[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ patientExternalOrganizationId, deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async create(input: IPatientExternalProviderOptions, txn: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .insertAndFetch(input);
  }

  static async edit(
    patientExternalProvider: IEditPatientExternalProvider,
    patientExternalProviderId: string,
    txn: Transaction,
  ): Promise<PatientExternalProvider> {
    const updatedPatientExternalProvider = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .patchAndFetchById(patientExternalProviderId, patientExternalProvider);

    return updatedPatientExternalProvider;
  }

  static async delete(
    patientExternalProviderId: string,
    updatedById: string,
    txn: Transaction,
  ): Promise<PatientExternalProvider> {
    await this.query(txn)
      .where({ id: patientExternalProviderId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString(), updatedById });

    const deleted = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientExternalProviderId);

    if (!deleted) {
      return Promise.reject(`No such patient external provider: ${patientExternalProviderId}`);
    }

    return deleted;
  }
}
/* tslint:enable:member-ordering */
