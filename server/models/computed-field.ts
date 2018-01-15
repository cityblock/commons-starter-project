import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Question from './question';

export type ComputedFieldOrderOptions = 'createdAt' | 'slug' | 'label';
type ComputedFieldDataTypes = 'boolean' | 'number' | 'string';
type GetByOptions = 'slug' | 'label';

interface IComputedFieldCreateFields {
  slug: string;
  label: string;
  dataType: ComputedFieldDataTypes;
}

interface IComputedFieldOrderOptions {
  orderBy: ComputedFieldOrderOptions;
  order: 'asc' | 'desc';
}

/* tslint:disable:member-ordering */
export default class ComputedField extends BaseModel {
  slug: string;
  label: string;
  dataType: ComputedFieldDataTypes;
  question: Question;

  static tableName = 'computed_field';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      slug: { type: 'string', minLength: 1 }, // cannot be blank
      label: { type: 'string', minLength: 1 }, // cannot be blank
      dataType: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
    },
    required: ['slug', 'label', 'dataType'],
  };

  static relationMappings: RelationMappings = {
    question: {
      relation: Model.HasOneRelation,
      modelClass: 'question',
      join: {
        from: 'computed_field.id',
        to: 'question.computedFieldId',
      },
    },
  };

  static async create(
    input: IComputedFieldCreateFields,
    txn?: Transaction,
  ): Promise<ComputedField> {
    return await this.query(txn).insertAndFetch(input);
  }

  static async get(computedFieldId: string, txn?: Transaction): Promise<ComputedField> {
    const computedField = await this.query(txn).findOne({ id: computedFieldId, deletedAt: null });

    if (!computedField) {
      return Promise.reject(`No such computed field: ${computedFieldId}`);
    }

    return computedField;
  }

  static async getBy(
    fieldName: GetByOptions,
    fieldValue: string,
    txn?: Transaction,
  ): Promise<ComputedField | null> {
    const computedField = await this.query(txn)
      .where(fieldName, fieldValue)
      .andWhere('deletedAt', null)
      .first();

    if (!computedField) {
      return null;
    }

    return computedField;
  }

  static async getBySlug(slug: string, txn?: Transaction): Promise<ComputedField | null> {
    return await this.getBy('slug', slug, txn);
  }

  static async getByLabel(label: string, txn?: Transaction): Promise<ComputedField | null> {
    return await this.getBy('label', label, txn);
  }

  static async getAll(
    { orderBy, order }: IComputedFieldOrderOptions,
    txn?: Transaction,
  ): Promise<ComputedField[]> {
    return await this.query(txn)
      .where('deletedAt', null)
      .orderBy(orderBy, order);
  }

  static async getForSchema(
    { orderBy, order }: IComputedFieldOrderOptions,
    txn?: Transaction,
  ): Promise<ComputedField[]> {
    return (await this.query(txn)
      .eager('question.answers')
      .modifyEager('question.answers', builder => builder.where('answer.deletedAt', null))
      .modifyEager('question', builder => builder.where('question.deletedAt', null))
      .joinRelation('question')
      .where('computed_field.deletedAt', null)
      .orderBy(orderBy, order)) as any;
  }

  static async delete(computedFieldId: string, txn?: Transaction): Promise<ComputedField> {
    await this.query(txn)
      .where({ id: computedFieldId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const computedField = await this.query(txn).findById(computedFieldId);
    if (!computedField) {
      return Promise.reject(`No such computed field: ${computedFieldId}`);
    }
    return computedField;
  }
}
/* tslint:enable:member-ordering */
