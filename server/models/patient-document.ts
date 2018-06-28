import { Model, RelationMappings, Transaction } from 'objection';
import { DocumentTypeOptions } from 'schema';
import uuid from 'uuid/v4';
import ComputedPatientStatus from './computed-patient-status';
import Patient from './patient';
import User from './user';

export const FULL_CONSENT_TYPES = [
  'treatmentConsent',
  'phiSharingConsent',
  'hieHealthixConsent',
  'textConsent',
  'privacyPracticesNotice',
];

export const CORE_CONSENT_TYPES = ['treatmentConsent', 'privacyPracticesNotice'];

const EAGER_QUERY = '[uploadedBy]';

export interface IPatientDocumentOptions {
  id?: string;
  patientId: string;
  uploadedById: string;
  filename: string;
  description?: string;
  documentType?: DocumentTypeOptions;
}

/* tslint:disable:member-ordering */
export default class PatientDocument extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  patientId!: string;
  uploadedById!: string;
  filename!: string;
  description!: string;
  documentType!: DocumentTypeOptions;
  uploadedBy!: User;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;

  static tableName = 'patient_document';
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      uploadedById: { type: 'string', format: 'uuid' },
      filename: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      documentType: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['patientId', 'uploadedById', 'filename'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_document.patientId',
          to: 'patient.id',
        },
      },

      uploadedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'patient_document.uploadedById',
          to: 'user.id',
        },
      },
    };
  }

  $beforeInsert() {
    this.id = this.id || uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(patientDocumentId: string, txn: Transaction): Promise<PatientDocument> {
    const document = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: patientDocumentId, deletedAt: null });

    if (!document) {
      return Promise.reject(`No such document: ${patientDocumentId}`);
    }

    return document;
  }

  static async getAllForPatient(patientId: string, txn: Transaction): Promise<PatientDocument[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, deletedAt: null });
  }

  static async getConsentsForPatient(
    patientId: string,
    consentTypes: string[],
    txn: Transaction,
  ): Promise<PatientDocument[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, deletedAt: null })
      .whereIn('documentType', consentTypes);
  }

  static async getMOLSTForPatient(patientId: string, txn: Transaction): Promise<PatientDocument[]> {
    return this.getByDocumentTypeForPatient(patientId, 'molst' as DocumentTypeOptions, txn);
  }

  static async getHCPsForPatient(patientId: string, txn: Transaction): Promise<PatientDocument[]> {
    return this.getByDocumentTypeForPatient(patientId, 'hcp' as DocumentTypeOptions, txn);
  }

  static async getByDocumentTypeForPatient(
    patientId: string,
    documentType: DocumentTypeOptions,
    txn: Transaction,
  ): Promise<PatientDocument[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, deletedAt: null, documentType });
  }

  static async create(input: IPatientDocumentOptions, txn: Transaction) {
    const patientDocument = await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);

    await ComputedPatientStatus.updateForPatient(input.patientId, input.uploadedById, txn);

    return patientDocument;
  }

  static async delete(
    patientDocumentId: string,
    userId: string,
    txn: Transaction,
  ): Promise<PatientDocument> {
    await this.query(txn)
      .where({ id: patientDocumentId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientDocumentId);

    if (!deleted) {
      return Promise.reject(`No such patient document: ${patientDocumentId}`);
    }

    await ComputedPatientStatus.updateForPatient(deleted.patientId, userId, txn);
    return deleted;
  }
}
/* tslint:enable:member-ordering */
