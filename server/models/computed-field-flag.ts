import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import PatientAnswer from './patient-answer';
import User from './user';

interface IComputedFieldFlagCreateFields {
  patientAnswerId: string;
  userId: string;
  reason: string | null;
}

/* tslint:disable:member-ordering */
// Patient computed field flag
export default class ComputedFieldFlag extends BaseModel {
  patientAnswerId: string;
  userId: string;
  reason: string | null;
  patientAnswer: PatientAnswer;
  user: User;

  static tableName = 'computed_field_flag';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientAnswerId: { type: 'string', format: 'uuid' }, // cannot be blank
      userId: { type: 'string', format: 'uuid' }, // cannot be blank
      reason: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientAnswerId', 'userId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patientAnswer: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientAnswer,
        join: {
          from: 'computed_field_flag.patientAnswerId',
          to: 'patient_answer.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'computed_field_flag.userId',
          to: 'user.id',
        },
      },
    };
  }

  static async create(
    { patientAnswerId, userId, reason }: IComputedFieldFlagCreateFields,
    txn: Transaction,
  ): Promise<ComputedFieldFlag> {
    return this.query(txn).insertAndFetch({ patientAnswerId, userId, reason });
  }

  static async get(computedFieldFlagId: string, txn: Transaction): Promise<ComputedFieldFlag> {
    const computedFieldFlag = await this.query(txn).findOne({
      id: computedFieldFlagId,
      deletedAt: null,
    });

    if (!computedFieldFlag) {
      return Promise.reject(`No such computed field flag: ${computedFieldFlagId}`);
    }

    return computedFieldFlag;
  }

  static async getAll(txn: Transaction): Promise<ComputedFieldFlag[]> {
    return this.query(txn)
      .orderBy('createdAt', 'desc')
      .where({ deletedAt: null });
  }

  static async delete(computedFieldFlagId: string, txn: Transaction): Promise<ComputedFieldFlag> {
    await this.query(txn)
      .where({ id: computedFieldFlagId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(computedFieldFlagId);

    if (!deleted) {
      return Promise.reject(`No such computed field flag: ${computedFieldFlagId}`);
    }

    return deleted;
  }
}
/* tslint:enable:member-ordering */
