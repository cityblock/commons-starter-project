import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import ComputedPatientStatus from './computed-patient-status';

export const CONSENT_TYPES = ['cityblockConsent', 'hipaaConsent', 'hieHealthixConsent'];

export type DocumentTypeOptions =
  | 'cityblockConsent'
  | 'hipaaConsent'
  | 'hieHealthixConsent'
  | 'hcp'
  | 'molst';

export interface IPatientDocumentOptions {
  patientId: string;
  uploadedById: string;
  filename: string;
  description?: string;
  documentType?: DocumentTypeOptions;
}

/* tslint:disable:member-ordering */
export default class PatientDocument extends BaseModel {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id: string;
  patientId: string;
  uploadedById: string;
  filename: string;
  description: string;
  documentType: DocumentTypeOptions;

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

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_document.patientId',
        to: 'patient.id',
      },
    },
  };

  static async get(patientDocumentId: string, txn: Transaction): Promise<PatientDocument> {
    const document = await this.query(txn).findOne({ id: patientDocumentId, deletedAt: null });

    if (!document) {
      return Promise.reject(`No such document: ${patientDocumentId}`);
    }

    return document;
  }

  static async getAllForPatient(patientId: string, txn: Transaction): Promise<PatientDocument[]> {
    return this.query(txn).where({ patientId, deletedAt: null });
  }

  static async getConsentsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientDocument[]> {
    return this.query(txn)
      .where({ patientId, deletedAt: null })
      .whereIn('documentType', CONSENT_TYPES);
  }

  static async getMOLSTForPatient(patientId: string, txn: Transaction): Promise<PatientDocument[]> {
    return this.query(txn).where({ patientId, deletedAt: null, documentType: 'molst' });
  }

  static async getHCPsForPatient(patientId: string, txn: Transaction): Promise<PatientDocument[]> {
    return this.query(txn).where({ patientId, deletedAt: null, documentType: 'hcp' });
  }

  static async create(input: IPatientDocumentOptions, txn: Transaction) {
    const patientDocument = await this.query(txn).insertAndFetch(input);

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

    const deleted = await this.query(txn).findById(patientDocumentId);

    if (!deleted) {
      return Promise.reject(`No such patient document: ${patientDocumentId}`);
    }

    await ComputedPatientStatus.updateForPatient(deleted.patientId, userId, txn);
    return deleted;
  }
}
/* tslint:enable:member-ordering */
