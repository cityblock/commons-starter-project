import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Address from './address';
import Email from './email';
import Phone from './phone';

const EAGER_QUERY = '[primaryAddress, primaryEmail, primaryPhone]';

export interface IPatientContactOptions {
  patientId: string;
  updatedById: string;
  relationToPatient: string;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  canContact: boolean;
  primaryPhoneId: string;
  description?: string;
  primaryAddressId?: string;
  primaryEmailId?: string;
}

interface IEditPatientContact extends Partial<IPatientContactOptions> {
  updatedById: string;
  relationToPatient?: string;
  firstName?: string;
  lastName?: string;
  isEmergencyContact?: boolean;
  isHealthcareProxy?: boolean;
  canContact?: boolean;
  primaryPhoneId?: string;
  description?: string;
  primaryAddressId?: string;
  primaryEmailId?: string;
}

/* tslint:disable:member-ordering */
export default class PatientContact extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id: string;
  patientId: string;
  updatedById: string;
  relationToPatient: string;
  firstName: string;
  lastName: string;
  isEmergencyContact: boolean;
  isHealthcareProxy: boolean;
  canContact: boolean;
  primaryPhoneId: string;
  primaryPhone: Phone;
  description: string;
  primaryAddressId: string;
  primaryAddress: Address;
  primaryEmailId: string;
  primaryEmail: Email;
  createdAt: string;
  updatedAt: string;

  $beforeInsert() {
    this.id = uuid();
    // NOTE: We are NOT setting updatedAt on insert. This is so we can know when first updated.
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'patient_contact';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      relationToPatient: { type: 'string', minLength: 1 },
      firstName: { type: 'string', minLength: 1 },
      lastName: { type: 'string', minLength: 1 },
      isEmergencyContact: { type: 'boolean' },
      isHealthcareProxy: { type: 'boolean' },
      canContact: { type: 'boolean' },
      primaryEmailId: { type: 'string', format: 'uuid' },
      primaryPhoneId: { type: 'string', format: 'uuid' },
      primaryAddressId: { type: 'string', format: 'uuid' },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
    },
    required: [
      'patientId',
      'updatedById',
      'relationToPatient',
      'firstName',
      'lastName',
      'primaryPhoneId',
    ],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_contact.patientId',
        to: 'patient.id',
      },
    },

    primaryAddress: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'address',
      join: {
        from: 'address.id',
        to: 'patient_contact.primaryAddressId',
      },
    },

    primaryEmail: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'email',
      join: {
        from: 'email.id',
        to: 'patient_contact.primaryEmailId',
      },
    },

    primaryPhone: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'phone',
      join: {
        from: 'phone.id',
        to: 'patient_contact.primaryPhoneId',
      },
    },
  };

  static async get(patientContactId: string, txn: Transaction): Promise<PatientContact> {
    const patientContact = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientContactId);

    if (!patientContact) {
      return Promise.reject(`No such patient contact: ${patientContactId}`);
    }
    return patientContact;
  }

  static async getHealthcareProxiesForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientContact[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, isHealthcareProxy: true })
      .orderBy('createdAt', 'asc');
  }

  static async getEmergencyContactsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientContact[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, isEmergencyContact: true })
      .orderBy('createdAt', 'asc');
  }

  static async create(input: IPatientContactOptions, txn: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    patientContact: IEditPatientContact,
    patientContactId: string,
    txn: Transaction,
  ): Promise<PatientContact> {
    const updatedPatientContact = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientContactId, patientContact);

    return updatedPatientContact;
  }
}
/* tslint:enable:member-ordering */
