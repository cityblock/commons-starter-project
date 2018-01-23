import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import CboCategory from './cbo-category';

const EAGER_QUERY = 'category';

interface ICboEditableFields {
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax?: string;
  phone: string;
  url: string;
}

/* tslint:disable:member-ordering */
export default class Cbo extends BaseModel {
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string;
  phone: string;
  url: string;
  category: CboCategory;

  static tableName = 'cbo';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 1 }, // cannot be blank
      categoryId: { type: 'string', format: 'uuid' },
      address: { type: 'string', minLength: 1 }, // cannot be blank
      city: { type: 'string', minLength: 1 }, // cannot be blank
      state: { type: 'string', minLength: 2, maxLength: 2 }, // use state abbreviation
      zip: { type: 'string', minLength: 5 }, // at least 5 digits
      fax: { type: 'string', minLength: 10 }, // at least 10 digits
      phone: { type: 'string', minLength: 10 }, // at least 10 digits
      url: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
    },
    required: ['name', 'categoryId', 'address', 'city', 'state', 'zip', 'phone', 'url'],
  };

  static relationMappings: RelationMappings = {
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'cbo-category',
      join: {
        from: 'cbo.categoryId',
        to: 'cbo_category.id',
      },
    },
  };

  static async get(cboId: string, txn: Transaction): Promise<Cbo> {
    const cbo = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: cboId, deletedAt: null });

    if (!cbo) {
      return Promise.reject(`No such CBO: ${cboId}`);
    }

    return cbo;
  }

  static async getAll(txn: Transaction): Promise<Cbo[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null })
      .orderBy('name', 'ASC');
  }

  static async create(input: ICboEditableFields, txn: Transaction): Promise<Cbo> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    input: Partial<ICboEditableFields>,
    cboId: string,
    txn: Transaction,
  ): Promise<Cbo> {
    const edited = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(cboId, input);

    if (!edited) {
      return Promise.reject(`No such CBO: ${cboId}`);
    }

    return edited;
  }

  static async delete(cboId: string, txn: Transaction): Promise<Cbo> {
    await this.query(txn)
      .where({ id: cboId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(cboId);

    if (!deleted) {
      return Promise.reject(`No such CBO: ${cboId}`);
    }

    return deleted;
  }
}
/* tslint:enable:member-ordering */
