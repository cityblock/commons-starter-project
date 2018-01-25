import { Model, RelationMappings, Transaction } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';

interface IPatientListEditableFields {
  title: string;
  answerId: string;
  order: number;
}

/* tslint:disable:member-ordering */
export default class PatientList extends BaseModel {
  id: string;
  title: string;
  answerId: string;
  order: number;
  answer: Answer;

  static tableName = 'patient_list';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      answerId: { type: 'string', format: 'uuid' },
      order: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['title', 'answerId', 'order'],
  };

  static relationMappings: RelationMappings = {
    answer: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'answer',
      join: {
        from: 'patient_list.answerId',
        to: 'answer.id',
      },
    },
  };

  static async get(patientListId: string, txn: Transaction): Promise<PatientList> {
    const patientList = await this.query(txn).findOne({ id: patientListId, deletedAt: null });

    if (!patientList) {
      return Promise.reject(`No such patient list: ${patientListId}`);
    }

    return patientList;
  }

  static async getAll(txn: Transaction): Promise<PatientList[]> {
    return this.query(txn)
      .orderBy('order', 'ASC')
      .where({ deletedAt: null });
  }

  static async create(input: IPatientListEditableFields, txn: Transaction): Promise<PatientList> {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    input: Partial<IPatientListEditableFields>,
    patientListId: string,
    txn: Transaction,
  ): Promise<PatientList> {
    const edited = await this.query(txn).patchAndFetchById(patientListId, input);

    if (!edited) {
      return Promise.reject(`No such patient list: ${patientListId}`);
    }

    return edited;
  }

  static async delete(patientListId: string, txn: Transaction): Promise<PatientList> {
    await this.query(txn)
      .where({ id: patientListId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(patientListId);

    if (!deleted) {
      return Promise.reject(`No such patient list: ${patientListId}`);
    }
    return deleted;
  }
}
/* tslint:enable:member-ordering */
