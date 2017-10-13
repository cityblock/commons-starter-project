import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';

export interface IConcernEditableFields {
  title: string;
}

/* tslint:disable:member-ordering */
export default class Concern extends Model {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'concern';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(concernId: string): Promise<Concern> {
    const concern = await this.query().findOne({ id: concernId, deletedAt: null });

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

  static async edit(concernId: string, concern: Partial<IConcernEditableFields>): Promise<Concern> {
    return await this.query().updateAndFetchById(concernId, concern);
  }

  static async getAll(): Promise<Concern[]> {
    return await this.query().where('deletedAt', null);
  }

  static async delete(concernId: string): Promise<Concern> {
    await this.query()
      .where({ id: concernId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const concern = await this.query().findById(concernId);
    if (!concern) {
      return Promise.reject(`No such concern: ${concernId}`);
    }
    return concern;
  }
}
/* tslint:disable:member-ordering */
