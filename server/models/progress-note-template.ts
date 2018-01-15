import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Question from './question';

interface IProgressNoteTemplateEditableFields {
  title: string;
}

/* tslint:disable:member-ordering */
export default class ProgressNoteTemplate extends BaseModel {
  title: string;
  questions: Question[];

  static tableName = 'progress_note_template';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 },
      deletedAt: { type: 'string' },
    },
    required: ['title'],
  };

  static relationalMappings: RelationMappings = {
    questions: {
      relation: Model.HasManyRelation,
      modelClass: 'question',
      join: {
        from: 'progress_note_template.id',
        to: 'question.progressNoteTemplateId',
      },
    },
  };

  static async get(
    progressNoteTemplateId: string,
    txn?: Transaction,
  ): Promise<ProgressNoteTemplate> {
    const progressNoteTemplate = await this.query(txn).findOne({
      id: progressNoteTemplateId,
      deletedAt: null,
    });
    if (!progressNoteTemplate) {
      return Promise.reject(`No such progress note template: ${progressNoteTemplateId}`);
    }
    return progressNoteTemplate;
  }

  static async getAll(txn?: Transaction): Promise<ProgressNoteTemplate[]> {
    return this.query(txn)
      .orderBy('createdAt', 'asc')
      .where({ deletedAt: null });
  }

  static async create(input: IProgressNoteTemplateEditableFields, txn?: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    progressNoteTemplate: Partial<IProgressNoteTemplateEditableFields>,
    progressNoteTemplateId: string,
    txn?: Transaction,
  ): Promise<ProgressNoteTemplate> {
    return await this.query(txn).patchAndFetchById(progressNoteTemplateId, progressNoteTemplate);
  }

  static async delete(progressNoteTemplateId: string, txn?: Transaction) {
    await this.query(txn)
      .where({ id: progressNoteTemplateId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const progressNoteTemplate = await this.query(txn).findById(progressNoteTemplateId);
    if (!progressNoteTemplate) {
      return Promise.reject(`No such progess note template: ${progressNoteTemplateId}`);
    }
    return progressNoteTemplate;
  }
}

/* tslint:enable:member-ordering */
