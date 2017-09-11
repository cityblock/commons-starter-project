import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';

export interface ICreateGoogleAuth {
  accessToken: string;
  expiresAt: string;
  userId: string;
}

/* tslint:disable:member-ordering */
export default class GoogleAuth extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
  expiresAt: string;

  static tableName = 'google_auth';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

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

  async $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

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
