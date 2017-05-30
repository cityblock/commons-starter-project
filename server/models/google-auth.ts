import { Model, RelationMappings, ValidationError } from 'objection';
import * as uuid from 'uuid';

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
    if (this.id) {
      throw new ValidationError({
        id: [{
          message: 'id should not be defined before insert',
        }],
      });
    }

    this.id = uuid.v4();
    this.createdAt = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async updateOrCreate(options: ICreateGoogleAuth): Promise<GoogleAuth> {
    const existingGoogleAuth = await this.query().where({ userId: options.userId }).first();
    if (existingGoogleAuth) {
      return await this.query().updateAndFetchById(existingGoogleAuth.id, options);
    }
    return await this
      .query()
      .insertAndFetch(options);
  }
}
/* tslint:enable:member-ordering */
