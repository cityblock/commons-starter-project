import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import CBOCategory from './cbo-category';

const EAGER_QUERY = 'category';

interface ICBOEditableFields {
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
export default class CBO extends BaseModel {
  name: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  fax: string;
  phone: string;
  url: string;
  category: CBOCategory;

  static tableName = 'cbo';

  static hasPHI = false;

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
      fax: { type: ['string', 'null'], minLength: 10 }, // at least 10 digits
      phone: { type: 'string', minLength: 10 }, // at least 10 digits
      url: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
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

  static async get(CBOId: string, txn: Transaction): Promise<CBO> {
    const cbo = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: CBOId, deletedAt: null });

    if (!cbo) {
      return Promise.reject(`No such CBO: ${CBOId}`);
    }

    return cbo;
  }

  static async getAll(txn: Transaction): Promise<CBO[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null })
      .orderBy('name', 'ASC');
  }

  static async getForCategory(categoryId: string, txn: Transaction): Promise<CBO[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ categoryId, deletedAt: null })
      .orderBy('name', 'ASC');
  }

  static async create(input: ICBOEditableFields, txn: Transaction): Promise<CBO> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    input: Partial<ICBOEditableFields>,
    CBOId: string,
    txn: Transaction,
  ): Promise<CBO> {
    const edited = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(CBOId, input);

    if (!edited) {
      return Promise.reject(`No such CBO: ${CBOId}`);
    }

    return edited;
  }

  static async delete(CBOId: string, txn: Transaction): Promise<CBO> {
    await this.query(txn)
      .where({ id: CBOId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(CBOId);

    if (!deleted) {
      return Promise.reject(`No such CBO: ${CBOId}`);
    }

    return deleted;
  }
}
/* tslint:enable:member-ordering */
