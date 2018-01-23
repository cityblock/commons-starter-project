import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Cbo from './cbo';

interface ICboCategoryEditableFields {
  title: string;
}

/* tslint:disable:member-ordering */
export default class CboCategory extends BaseModel {
  title: string;
  cbos: Cbo[];

  static tableName = 'cbo_category';

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
    cbo: {
      relation: Model.HasManyRelation,
      modelClass: 'cbo',
      join: {
        from: 'cbo.categoryId',
        to: 'cbo_category.id',
      },
    },
  };

  static async create(input: ICboCategoryEditableFields, txn: Transaction): Promise<CboCategory> {
    return this.query(txn).insertAndFetch(input);
  }
}
/* tslint:enable:member-ordering */
