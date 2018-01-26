import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import CBO from './cbo';
import CBOCategory from './cbo-category';
import Task from './task';

const EAGER_QUERY = '[category, CBO]';

interface ICBOReferralCreateFields {
  categoryId: string;
  CBOId?: string | null;
  name?: string | null;
  url?: string | null;
  diagnosis?: string | null;
}

interface ICBOReferralEditFields {
  sentAt?: string | null;
  acknowledgedAt?: string | null;
}

/* tslint:disable:member-ordering */
export default class CBOReferral extends BaseModel {
  categoryId: string;
  category: CBOCategory;
  CBOId?: string | null;
  CBO?: CBO;
  name?: string | null; // provided if referring to "Other" CBO
  url?: string | null; // provided if referring to "Other" CBO
  diagnosis?: string | null; // allowing to be blank if no diagnoses available from redox
  sentAt: string | null;
  acknowledgedAt: string | null;
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
    CBO: {
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
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    input: ICBOReferralEditFields,
    CBOReferralId: string,
    txn: Transaction,
  ): Promise<CBOReferral> {
    const edited = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(CBOReferralId, input);

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
