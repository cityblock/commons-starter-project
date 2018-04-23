import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import User from './user';

interface ICreateGoogleAuth {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  userId: string;
}

/* tslint:disable:member-ordering */
export default class GoogleAuth extends BaseModel {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;

  static tableName = 'google_auth';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    required: ['accessToken', 'userId'],
    properties: {
      id: { type: 'string' },
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
      expiresAt: { type: 'string' },
      userId: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'google_auth.userId',
          to: 'user.id',
        },
      },
    };
  }

  static async get(googleAuthId: string, txn: Transaction): Promise<GoogleAuth> {
    const googleAuth = await this.query(txn).findById(googleAuthId);

    if (!googleAuth) {
      return Promise.reject(`No such google auth: ${googleAuthId}`);
    }
    return googleAuth;
  }

  static async updateOrCreate(options: ICreateGoogleAuth, txn: Transaction): Promise<GoogleAuth> {
    const existingGoogleAuth = await this.query(txn)
      .where({ userId: options.userId })
      .first();
    if (existingGoogleAuth) {
      return this.query(txn).updateAndFetchById(existingGoogleAuth.id, options);
    }
    return this.query(txn).insertAndFetch(options);
  }
}
/* tslint:enable:member-ordering */
