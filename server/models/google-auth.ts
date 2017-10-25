import { Model, RelationMappings } from 'objection';
import BaseModel from './base-model';

interface ICreateGoogleAuth {
  accessToken: string;
  expiresAt: string;
  userId: string;
}

/* tslint:disable:member-ordering */
export default class GoogleAuth extends BaseModel {
  accessToken: string;
  expiresAt: string;

  static tableName = 'google_auth';

  static jsonSchema = {
    type: 'object',
    required: ['accessToken', 'userId'],
    properties: {
      id: { type: 'string' },
      accessToken: { type: 'string' },
      expiresAt: { type: 'string' },
      userId: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'google_auth.userId',
        to: 'user.id',
      },
    },
  };

  static async updateOrCreate(options: ICreateGoogleAuth): Promise<GoogleAuth> {
    const existingGoogleAuth = await this.query()
      .where({ userId: options.userId })
      .first();
    if (existingGoogleAuth) {
      return await this.query().updateAndFetchById(existingGoogleAuth.id, options);
    }
    return await this.query().insertAndFetch(options);
  }
}
/* tslint:enable:member-ordering */
