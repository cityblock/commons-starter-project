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
      title: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  static async get(progressNoteTemplateId: string): Promise<ProgressNoteTemplate> {
    const progressNoteTemplate = await this.query().findOne({
      id: progressNoteTemplateId,
      deletedAt: null,
    });
    if (!progressNoteTemplate) {
      return Promise.reject(`No such progress note template: ${progressNoteTemplateId}`);
    }
    return progressNoteTemplate;
  }

  static async getAll(): Promise<ProgressNoteTemplate[]> {
    return this.query()
      .orderBy('createdAt', 'asc')
      .where({ deletedAt: null });
  }

  static async create(input: IProgressNoteTemplateEditableFields, txn?: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    progressNoteTemplate: Partial<IProgressNoteTemplateEditableFields>,
    progressNoteTemplateId: string,
  ): Promise<ProgressNoteTemplate> {
    return await this.query().updateAndFetchById(progressNoteTemplateId, progressNoteTemplate);
  }

  static async delete(progressNoteTemplateId: string) {
    await this.query()
      .where({ id: progressNoteTemplateId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const progressNoteTemplate = await this.query().findById(progressNoteTemplateId);
    if (!progressNoteTemplate) {
      return Promise.reject(`No such progess note template: ${progressNoteTemplateId}`);
    }
    return progressNoteTemplate;
  }
}

/* tslint:enable:member-ordering */
