import { clone } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import {
  formatPhoneNumberForTwilio,
  validatePhoneNumberForTwilio,
} from '../helpers/twilio-helpers';
import Address from './address';
import BaseModel from './base-model';
import Patient from './patient';
import PatientDocument from './patient-document';

const EAGER_QUERY = '[address]';

export interface IPatientExternalOrganizationOptions {
  patientId: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  faxNumber?: string;
  addressId?: string;
  isConsentedForSubstanceUse?: boolean;
  isConsentedForHiv?: boolean;
  isConsentedForStd?: boolean;
  isConsentedForGeneticTesting?: boolean;
  isConsentedForFamilyPlanning?: boolean;
  isConsentedForMentalHealth?: boolean;
  consentDocumentId?: string;
}

interface IEditPatientExternalOrganization {
  name?: string;
  description?: string | null;
  phoneNumber?: string | null;
  faxNumber?: string | null;
  addressId?: string | null;
  isConsentedForSubstanceUse?: boolean;
  isConsentedForHiv?: boolean;
  isConsentedForStd?: boolean;
  isConsentedForGeneticTesting?: boolean;
  isConsentedForFamilyPlanning?: boolean;
  isConsentedForMentalHealth?: boolean;
  consentDocumentId?: string | null;
}

/* tslint:disable:member-ordering */
export default class PatientExternalOrganization extends BaseModel {
  id!: string;
  patientId!: string;
  name!: string;
  description!: string | null;
  phoneNumber!: string | null;
  faxNumber!: string | null;
  address!: Address;
  addressId!: string | null;
  isConsentedForSubstanceUse!: boolean;
  isConsentedForHiv!: boolean;
  isConsentedForStd!: boolean;
  isConsentedForGeneticTesting!: boolean;
  isConsentedForFamilyPlanning!: boolean;
  isConsentedForMentalHealth!: boolean;
  consentDocumentId!: string | null;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  static tableName = 'patient_external_organization';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      description: { type: ['string', 'null'] },
      phoneNumber: { type: ['string', 'null'], minLength: 12, maxLength: 12 },
      faxNumber: { type: ['string', 'null'], minLength: 12, maxLength: 12 },
      addressId: { type: ['string', 'null'], format: 'uuid' },
      isConsentedForSubstanceUse: { type: 'boolean' },
      isConsentedForHiv: { type: 'boolean' },
      isConsentedForStd: { type: 'boolean' },
      isConsentedForGeneticTesting: { type: 'boolean' },
      isConsentedForFamilyPlanning: { type: 'boolean' },
      isConsentedForMentalHealth: { type: 'boolean' },
      consentDocumentId: { type: ['string', 'null'], format: 'uuid' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['patientId', 'name'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_external_organization.patientId',
          to: 'patient.id',
        },
      },

      address: {
        relation: Model.HasOneRelation,
        modelClass: Address,
        join: {
          from: 'patient_external_organization.addressId',
          to: 'address.id',
        },
      },

      consentDocument: {
        relation: Model.HasOneRelation,
        modelClass: PatientDocument,
        join: {
          from: 'patient_external_organization.consentDocumentId',
          to: 'patient_document.id',
        },
      },
    };
  }

  static async get(
    patientExternalOrganizationId: string,
    txn: Transaction,
  ): Promise<PatientExternalOrganization> {
    const patientExternalOrganization = await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null })
      .findById(patientExternalOrganizationId);

    if (!patientExternalOrganization) {
      return Promise.reject(
        `No such patient external organization: ${patientExternalOrganizationId}`,
      );
    }
    return patientExternalOrganization;
  }

  static async getAllForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientExternalOrganization[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async create(input: IPatientExternalOrganizationOptions, txn: Transaction) {
    const formattedInput = clone(input);
    if (input.phoneNumber) {
      (formattedInput.phoneNumber = formatPhoneNumberForTwilio(input.phoneNumber)),
        await validatePhoneNumberForTwilio(formattedInput.phoneNumber);
    }
    if (input.faxNumber) {
      (formattedInput.faxNumber = formatPhoneNumberForTwilio(input.faxNumber)),
        await validatePhoneNumberForTwilio(formattedInput.faxNumber);
    }

    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(formattedInput);
  }

  static async edit(
    input: IEditPatientExternalOrganization,
    patientExternalOrganizationId: string,
    txn: Transaction,
  ): Promise<PatientExternalOrganization> {
    const formattedInput = clone(input);
    if (input.phoneNumber) {
      (formattedInput.phoneNumber = formatPhoneNumberForTwilio(input.phoneNumber)),
        await validatePhoneNumberForTwilio(formattedInput.phoneNumber);
    }
    if (input.faxNumber) {
      (formattedInput.faxNumber = formatPhoneNumberForTwilio(input.faxNumber)),
        await validatePhoneNumberForTwilio(formattedInput.faxNumber);
    }

    const updatedPatientExternalOrganization = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientExternalOrganizationId, formattedInput);

    return updatedPatientExternalOrganization;
  }

  static async delete(
    patientExternalOrganizationId: string,
    txn: Transaction,
  ): Promise<PatientExternalOrganization> {
    await this.query(txn)
      .where({ id: patientExternalOrganizationId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientExternalOrganizationId);

    if (!deleted) {
      return Promise.reject(
        `No such patient external organization: ${patientExternalOrganizationId}`,
      );
    }

    return deleted;
  }

  static async getPatientIdForResource(
    patientExternalOrganizationId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientExternalOrganizationId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
