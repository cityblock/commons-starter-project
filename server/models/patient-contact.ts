import { Model, RelationMappings, Transaction } from 'objection';
import { PatientRelationOptions } from 'schema';
import {
  getCountUndocumentedSharingConsentedForPatient,
  getQueryForAllForConsents,
  getQueryForAllNewlyUnconsented,
  ConsentModel,
} from '../helpers/consent-helpers';
import Address from './address';
import Email from './email';
import Patient from './patient';
import PatientContactAddress from './patient-contact-address';
import PatientContactEmail from './patient-contact-email';
import PatientContactPhone from './patient-contact-phone';
import PatientDocument from './patient-document';
import Phone from './phone';

const EAGER_QUERY = '[address, email, phone]';
const MAX_INDIVIDUALS = 12;

export interface IPatientContactOptions {
  patientId: string;
  updatedById: string;
  relationToPatient: PatientRelationOptions;
  relationFreeText?: string | null;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  description?: string;
  isConsentedForSubstanceUse?: boolean;
  isConsentedForHiv?: boolean;
  isConsentedForStd?: boolean;
  isConsentedForGeneticTesting?: boolean;
  isConsentedForFamilyPlanning?: boolean;
  isConsentedForMentalHealth?: boolean;
  consentDocumentId?: string;
  isConsentDocumentOutdated?: boolean;
}

interface IEditPatientContact {
  updatedById: string;
  relationToPatient?: PatientRelationOptions;
  relationFreeText?: string | null;
  firstName?: string;
  lastName?: string;
  isEmergencyContact?: boolean;
  isHealthcareProxy?: boolean;
  description?: string;
  isConsentedForSubstanceUse?: boolean;
  isConsentedForHiv?: boolean;
  isConsentedForStd?: boolean;
  isConsentedForGeneticTesting?: boolean;
  isConsentedForFamilyPlanning?: boolean;
  isConsentedForMentalHealth?: boolean;
  consentDocumentId?: string | null;
  isConsentDocumentOutdated?: boolean;
}

/* tslint:disable:member-ordering */
export default class PatientContact extends ConsentModel {
  id!: string;
  patientId!: string;
  updatedById!: string;
  relationToPatient!: PatientRelationOptions;
  relationFreeText!: string | null;
  firstName!: string;
  lastName!: string;
  isEmergencyContact!: boolean;
  isHealthcareProxy!: boolean;
  description!: string;
  address!: Address;
  email!: Email;
  phone!: Phone;
  isConsentedForSubstanceUse!: boolean;
  isConsentedForHiv!: boolean;
  isConsentedForStd!: boolean;
  isConsentedForGeneticTesting!: boolean;
  isConsentedForFamilyPlanning!: boolean;
  isConsentedForMentalHealth!: boolean;
  consentDocumentId!: string | null;
  isConsentDocumentOutdated!: boolean;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  static tableName = 'patient_contact';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      relationToPatient: { type: 'string', minLength: 1 },
      relationFreeText: { type: ['string', 'null'] },
      firstName: { type: 'string', minLength: 1 },
      lastName: { type: 'string', minLength: 1 },
      isEmergencyContact: { type: 'boolean' },
      isHealthcareProxy: { type: 'boolean' },
      description: { type: 'string' },
      isConsentedForSubstanceUse: { type: 'boolean' },
      isConsentedForHiv: { type: 'boolean' },
      isConsentedForStd: { type: 'boolean' },
      isConsentedForGeneticTesting: { type: 'boolean' },
      isConsentedForFamilyPlanning: { type: 'boolean' },
      isConsentedForMentalHealth: { type: 'boolean' },
      consentDocumentId: { type: ['string', 'null'], format: 'uuid' },
      isConsentDocumentOutdated: { type: 'boolean' },
      updatedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['patientId', 'updatedById', 'relationToPatient', 'firstName', 'lastName'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_contact.patientId',
          to: 'patient.id',
        },
      },

      // has only one non-deleted address
      address: {
        relation: Model.HasOneThroughRelation,
        modelClass: Address,
        join: {
          from: 'patient_contact.id',
          through: {
            modelClass: PatientContactAddress,
            from: 'patient_contact_address.patientContactId',
            to: 'patient_contact_address.addressId',
          },
          to: 'address.id',
        },
      },

      // has only one non-deleted email
      email: {
        relation: Model.HasOneThroughRelation,
        modelClass: Email,
        join: {
          from: 'patient_contact.id',
          through: {
            modelClass: PatientContactEmail,
            from: 'patient_contact_email.patientContactId',
            to: 'patient_contact_email.emailId',
          },
          to: 'email.id',
        },
      },

      phone: {
        relation: Model.HasOneThroughRelation,
        modelClass: Phone,
        join: {
          from: 'patient_contact.id',
          through: {
            modelClass: PatientContactPhone,
            from: 'patient_contact_phone.patientContactId',
            to: 'patient_contact_phone.phoneId',
          },
          to: 'phone.id',
        },
      },

      consentDocument: {
        relation: Model.HasOneRelation,
        modelClass: PatientDocument,
        join: {
          from: 'patient_contact.consentDocumentId',
          to: 'patient_document.id',
        },
      },
    };
  }

  static async get(patientContactId: string, txn: Transaction): Promise<PatientContact> {
    const patientContact = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('address', builder => builder.where('address.deletedAt', null))
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ deletedAt: null })
      .findById(patientContactId);

    if (!patientContact) {
      return Promise.reject(`No such patient contact: ${patientContactId}`);
    }
    return patientContact;
  }

  static async getAllForPatient(patientId: string, txn: Transaction): Promise<PatientContact[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('address', builder => builder.where('address.deletedAt', null))
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ patientId, deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async getAllForConsents(patientId: string, txn: Transaction): Promise<PatientContact[]> {
    const queryBuilder = this.query(txn);
    return getQueryForAllForConsents(queryBuilder, patientId, MAX_INDIVIDUALS, 'lastName')
      .eager('phone')
      .modifyEager('phone', builder => builder.where('phone.deletedAt', null));
  }

  static async assignDocumentToAllForPatient(
    patientId: string,
    consentDocumentId: string,
    txn: Transaction,
  ): Promise<number> {
    let queryBuilder = this.query(txn);
    const consentedNumber = await getQueryForAllForConsents(
      queryBuilder,
      patientId,
      MAX_INDIVIDUALS,
      'lastName',
    ).patch({
      consentDocumentId,
      isConsentDocumentOutdated: false,
    });

    queryBuilder = this.query(txn);
    const unconsentedNumber = await getQueryForAllNewlyUnconsented(queryBuilder, patientId).patch({
      consentDocumentId,
      isConsentDocumentOutdated: false,
    });

    return consentedNumber + unconsentedNumber;
  }

  static async getCountUndocumentedSharingConsentedForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<number> {
    const queryBuilder = this.query(txn);
    return getCountUndocumentedSharingConsentedForPatient(queryBuilder, patientId);
  }

  static async getHealthcareProxiesForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientContact[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('address', builder => builder.where('address.deletedAt', null))
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ patientId, isHealthcareProxy: true, deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async getEmergencyContactsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientContact[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('address', builder => builder.where('address.deletedAt', null))
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .where({ patientId, isEmergencyContact: true, deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async create(input: IPatientContactOptions, txn: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('address', builder => builder.where('address.deletedAt', null))
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .insertAndFetch(input);
  }

  static async edit(
    patientContact: IEditPatientContact,
    patientContactId: string,
    txn: Transaction,
  ): Promise<PatientContact> {
    const updatedPatientContact = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('address', builder => builder.where('address.deletedAt', null))
      .modifyEager('email', builder => builder.where('email.deletedAt', null))
      .patchAndFetchById(patientContactId, patientContact);

    return updatedPatientContact;
  }

  static async delete(
    patientContactId: string,
    updatedById: string,
    txn: Transaction,
  ): Promise<PatientContact> {
    await this.query(txn)
      .where({ id: patientContactId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString(), updatedById });

    const deleted = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientContactId);

    if (!deleted) {
      return Promise.reject(`No such patient contact: ${patientContactId}`);
    }

    return deleted;
  }

  static async getPatientIdForResource(
    patientContactId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientContactId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
