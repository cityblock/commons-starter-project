import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Cbo from './cbo';

interface ICBOCategoryEditableFields {
  title: string;
}

/* tslint:disable:member-ordering */
export default class CBOCategory extends BaseModel {
  title: string;
  cbos: Cbo[];

  static tableName = 'cbo_category';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['title'],
  };

  static relationMappings: RelationMappings = {
    cbo: {
      relation: Model.HasManyRelation,
      modelClass: 'cbo',
      join: {
        from: 'cbo.categoryId',
        to: 'cbo_category.id',
      },
    },
  };

  static async getAll(txn: Transaction): Promise<CBOCategory[]> {
    return this.query(txn)
      .where({ deletedAt: null })
      .orderBy('title', 'ASC');
  }

  static async create(input: ICBOCategoryEditableFields, txn: Transaction): Promise<CBOCategory> {
    return this.query(txn).insertAndFetch(input);
  }
}
/* tslint:enable:member-ordering */
