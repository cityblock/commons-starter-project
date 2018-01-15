import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';

interface IConcernEditableFields {
  title: string;
}

export type ConcernOrderOptions = 'createdAt' | 'title' | 'updatedAt';

interface IConcernOrderOptions {
  orderBy: ConcernOrderOptions;
  order: 'asc' | 'desc';
}

/* tslint:disable:member-ordering */
export default class Concern extends BaseModel {
  title: string;

  static tableName = 'concern';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
    },
    required: ['title'],
  };

  static relationMappings: RelationMappings = {
    answers: {
      relation: Model.ManyToManyRelation,
      modelClass: 'answer',
      join: {
        from: 'concern.id',
        through: {
          from: 'concern_suggestion.concernId',
          to: 'concern_suggestion.answerId',
        },
        to: 'answer.id',
      },
    },
  };

  static async get(concernId: string, txn?: Transaction): Promise<Concern> {
    const concern = await this.query(txn).findOne({ id: concernId, deletedAt: null });

    if (!concern) {
      return Promise.reject(`No such concern: ${concernId}`);
    }
    return concern;
  }

  static async create(input: IConcernEditableFields, txn?: Transaction) {
    return await this.query(txn).insertAndFetch(input);
  }

  static async findOrCreateByTitle(title: string, txn?: Transaction): Promise<Concern> {
    const fetchedConcern = await this.query(txn)
      .whereRaw('lower("title") = ?', title.toLowerCase())
      .limit(1)
      .first();

    if (fetchedConcern) {
      return fetchedConcern;
    }

    return await this.create({ title }, txn);
  }

  static async edit(
    concernId: string,
    concern: Partial<IConcernEditableFields>,
    txn?: Transaction,
  ): Promise<Concern> {
    return await this.query(txn).patchAndFetchById(concernId, concern);
  }

  static async getAll(
    { orderBy, order }: IConcernOrderOptions,
    txn?: Transaction,
  ): Promise<Concern[]> {
    return await this.query(txn)
      .where('deletedAt', null)
      .orderBy(orderBy, order);
  }

  static async delete(concernId: string, txn?: Transaction): Promise<Concern> {
    await this.query(txn)
      .where({ id: concernId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const concern = await this.query(txn).findById(concernId);
    if (!concern) {
      return Promise.reject(`No such concern: ${concernId}`);
    }
    return concern;
  }
}
/* tslint:enable:member-ordering */
