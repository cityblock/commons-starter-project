import { Model, RelationMappings, ValidationError } from 'objection';
import * as uuid from 'uuid/v4';
import { isEmail } from 'validator';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Clinic from './clinic';
import GoogleAuth from './google-auth';

export type UserRole =
  'physician' |
  'nurseCareManager' |
  'healthCoach' |
  'familyMember' |
  'anonymousUser' |
  'admin';

export interface ICreateUser {
  email: string;
  homeClinicId: string;
  firstName?: string;
  lastName?: string;
  userRole?: UserRole;
  athenaProviderId?: number;
}

export interface IUpdateUser {
  locale: 'en' | 'es';
  googleProfileImageUrl: string;
  googleAuthId: string;
  homeClinicId: string;
  firstName: string;
  lastName: string;
  lastLoginAt: string;
}

export type GetByOptions = 'email';

/* tslint:disable:member-ordering */
export default class User extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  homeClinicId: string;
  homeClinic: Clinic;
  googleAuthId: string;
  googleAuth: GoogleAuth;
  locale: 'en' | 'es';
  athenaProviderId: number;
  googleProfileImageUrl: string;

  static tableName = 'user';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      lastLoginAt: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      locale: { locale: 'string' },
      userRole: {
        type: 'string',
        enum: ['familyMember', 'healthCoach', 'physician', 'nurseCareManager'],
      },
      homeClinicId: { type: 'string' },
      athenaProviderId: { type: 'number' },
      googleAuthId: { type: 'string' },
      googleProfileImageUrl: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    googleAuth: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'google-auth',
      join: {
        from: 'user.googleAuthId',
        to: 'google_auth.id',
      },
    },
    homeClinic: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'clinic',
      join: {
        from: 'user.homeClinicId',
        to: 'clinic.id',
      },
    },
    patients: {
      relation: Model.ManyToManyRelation,
      modelClass: 'patient',
      join: {
        from: 'user.id',
        // ManyToMany relation needs the `through` object to describe the join table.
        through: {
          modelClass: 'care-team',
          from: 'care_team.userId',
          to: 'care_team.patientId',
        },
        to: 'patient.id',
      },
    },
  };

  async $beforeSave(inserting: boolean) {
    if (this.email && !isEmail(this.email)) {
      throw new ValidationError({
        email: [{
          message: 'email is not valid',
        }],
      });
    }
  }

  async $beforeInsert() {
    if (this.id) {
      throw new ValidationError({
        id: [{
          message: 'id should not be defined before insert',
        }],
      });
    }

    await this.$beforeSave(true);
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  async $beforeUpdate() {
    await this.$beforeSave(false);
    this.updatedAt = new Date().toISOString();
  }

  static async getLastLoggedIn(userId: string): Promise<string | undefined> {
    // TODO: Figure out how to return select fields via knex
    const user = await this.query().findById(userId);
    return user ? user.lastLoginAt : undefined;
  }

  static async create(user: ICreateUser): Promise<User> {
    return await this
      .query()
      .insertAndFetch(user);
  }

  static async update(userId: string, user: Partial<IUpdateUser>): Promise<User> {
    return await this
      .query()
      .updateAndFetchById(userId, user);
  }

  static async get(userId: string): Promise<User> {
    const user = await this
      .query()
      .findById(userId);
    if (!user) {
      return Promise.reject(`No such user: ${userId}`);
    }
    return user;
  }

  static async getBy(fieldName: GetByOptions, field?: string): Promise<User | null> {
    if (!field) {
      return null;
    }

    const user = await this
      .query()
      .where(fieldName, field)
      .first();
    if (!user) {
      return null;
    }

    return user;
  }

  static async getAll(
    { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<User>> {
    const usersResult = await this
      .query()
      .page(pageNumber, pageSize) as any;

    return {
      results: usersResult.results,
      total: usersResult.total,
    };
  }
}
/* tslint:enable:member-ordering */
