import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import CBO from './cbo';
import CBOCategory from './cbo-category';
import Task from './task';

const EAGER_QUERY = '[category, cbo]';

interface ICBOReferralCreateFields {
  categoryId: string;
  CBOId?: string;
  name?: string;
  url?: string;
  diagnosis?: string;
}

interface ICBOReferralEditFields {
  sentAt?: string;
  acknowledgedAt?: string;
}

/* tslint:disable:member-ordering */
export default class CBOReferral extends BaseModel {
  categoryId: string;
  category: CBOCategory;
  CBOId?: string;
  CBO?: CBO;
  name?: string; // provided if referring to "Other" CBO
  url?: string; // provided if referring to "Other" CBO
  diagnosis?: string; // allowing to be blank if no diagnoses available from redox
  sentAt: string;
  acknowledgedAt: string;
  task: Task;

  static tableName = 'cbo_referral';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      categoryId: { type: 'string', format: 'uuid' },
      CBOId: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 }, // cannot be blank
      url: { type: 'string', minLength: 1 }, // cannot be blank
      diagnosis: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      sentAt: { type: 'string' },
      acknowledgedAt: { type: 'string' },
    },
    required: ['categoryId'],
    oneOf: [
      // must provide either a CBO id or information about other CBO
      { required: ['CBOId'] },
      { required: ['name', 'url'] },
    ],
  };

  static relationMappings: RelationMappings = {
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'cbo-category',
      join: {
        from: 'cbo_referral.categoryId',
        to: 'cbo_category.id',
      },
    },
    cbo: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'cbo',
      join: {
        from: 'cbo_referral.CBOId',
        to: 'cbo.id',
      },
    },
    task: {
      relation: Model.HasOneRelation,
      modelClass: 'task',
      join: {
        from: 'task.cboReferralId',
        to: 'cbo_referral.id',
      },
    },
  };

  static async get(CBOReferralId: string, txn: Transaction): Promise<CBOReferral> {
    const cboReferral = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: CBOReferralId, deletedAt: null });

    if (!cboReferral) {
      return Promise.reject(`No such CBO referral: ${CBOReferralId}`);
    }

    return cboReferral;
  }

  static async create(input: ICBOReferralCreateFields, txn: Transaction): Promise<CBOReferral> {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    input: ICBOReferralEditFields,
    CBOReferralId: string,
    txn: Transaction,
  ): Promise<CBOReferral> {
    const edited = await this.query(txn).patchAndFetchById(CBOReferralId, input);

    if (!edited) {
      return Promise.reject(`No such CBO referral: ${CBOReferralId}`);
    }

    return edited;
  }

  static async delete(CBOReferralId: string, txn: Transaction): Promise<CBOReferral> {
    await this.query(txn)
      .where({ id: CBOReferralId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(CBOReferralId);

    if (!deleted) {
      return Promise.reject(`No such CBO referral: ${CBOReferralId}`);
    }

    return deleted;
  }
}
/* tslint:enable:member-ordering */
