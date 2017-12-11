import { Model, RelationMappings } from 'objection';
import BaseModel from './base-model';

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

  static tableName = 'computed_field';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      slug: { type: 'string' },
      label: { type: 'string' },
      dataType: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  static async create(input: IComputedFieldCreateFields): Promise<ComputedField> {
    return await this.query().insertAndFetch(input);
  }

  static async get(computedFieldId: string): Promise<ComputedField> {
    const computedField = await this.query().findOne({ id: computedFieldId, deletedAt: null });

    if (!computedField) {
      return Promise.reject(`No such computed field: ${computedFieldId}`);
    }

    return computedField;
  }

  static async getBy(fieldName: GetByOptions, fieldValue: string): Promise<ComputedField | null> {
    const computedField = await this.query()
      .where(fieldName, fieldValue)
      .andWhere('deletedAt', null)
      .first();

    if (!computedField) {
      return null;
    }

    return computedField;
  }

  static async getBySlug(slug: string): Promise<ComputedField | null> {
    return await this.getBy('slug', slug);
  }

  static async getByLabel(label: string): Promise<ComputedField | null> {
    return await this.getBy('label', label);
  }

  static async getAll({ orderBy, order }: IComputedFieldOrderOptions): Promise<ComputedField[]> {
    return await this.query()
      .where('deletedAt', null)
      .orderBy(orderBy, order);
  }

  static async getAllAvailable({
    orderBy,
    order,
  }: IComputedFieldOrderOptions): Promise<ComputedField[]> {
    return (await this.query()
      .joinRaw('LEFT OUTER JOIN question ON question."computedFieldId" = computed_field.id')
      .where('computed_field.deletedAt', null)
      .andWhere('question.id', null)
      .orderBy(orderBy, order)) as any;
  }

  static async delete(computedFieldId: string): Promise<ComputedField> {
    await this.query()
      .where({ id: computedFieldId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const computedField = await this.query().findById(computedFieldId);
    if (!computedField) {
      return Promise.reject(`No such computed field: ${computedFieldId}`);
    }
    return computedField;
  }
}
/* tslint:enable:member-ordering */
