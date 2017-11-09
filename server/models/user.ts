import { Model, RelationMappings, ValidationError } from 'objection';
import * as uuid from 'uuid/v4';
import { isEmail } from 'validator';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Clinic from './clinic';
import GoogleAuth from './google-auth';

export type UserRole =
  | 'physician'
  | 'nurseCareManager'
  | 'healthCoach'
  | 'familyMember'
  | 'anonymousUser'
  | 'admin';

export type Locale = 'en' | 'es';

interface ICreateUser {
  email: string;
  homeClinicId: string;
  firstName?: string;
  lastName?: string;
  userRole?: UserRole;
  athenaProviderId?: number;
}

interface IUpdateUser {
  locale: Locale;
  googleProfileImageUrl: string;
  googleAuthId: string;
  homeClinicId: string;
  firstName: string;
  lastName: string;
  lastLoginAt: string;
}

type GetByOptions = 'email';

export type UserOrderOptions =
  | 'createdAt'
  | 'createdAt'
  | 'lastLoginAt'
  | 'lastLoginAt'
  | 'updatedAt'
  | 'updatedAt';

export interface IUserFilterOptions extends IPaginationOptions {
  hasLoggedIn: boolean;
  orderBy: UserOrderOptions;
  order: 'asc' | 'desc';
}

/* tslint:disable:member-ordering */
export default class User extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
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
      locale: { type: 'string' },
      userRole: {
        type: 'string',
        enum: ['familyMember', 'healthCoach', 'physician', 'nurseCareManager', 'admin'],
      },
      homeClinicId: { type: 'string' },
      athenaProviderId: { type: 'number' },
      googleAuthId: { type: 'string' },
      googleProfileImageUrl: { type: 'string' },
      deletedAt: { type: 'string' },
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
        email: [
          {
            message: 'email is not valid',
          },
        ],
      });
    }
  }

  async $beforeInsert() {
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
    return await this.query().insertAndFetch(user);
  }

  static async update(userId: string, user: Partial<IUpdateUser>): Promise<User> {
    return await this.query().updateAndFetchById(userId, user);
  }

  // NOTE: Separated because it is admin only - a user should not be able to change their own role
  static async updateUserRole(userId: string, userRole: UserRole): Promise<User> {
    return await this.query().updateAndFetchById(userId, { userRole });
  }

  static async get(userId: string): Promise<User> {
    const user = await this.query().findOne({ id: userId, deletedAt: null });
    if (!user) {
      return Promise.reject(`No such user: ${userId}`);
    }
    return user;
  }

  static async getBy(fieldName: GetByOptions, field?: string): Promise<User | null> {
    if (!field) {
      return null;
    }

    const user = await this.query()
      .where(fieldName, field)
      .andWhere('deletedAt', null)
      .first();
    if (!user || !!user.deletedAt) {
      return null;
    }

    return user;
  }

  static async getAll({
    pageNumber,
    pageSize,
    hasLoggedIn,
    orderBy,
    order,
  }: IUserFilterOptions): Promise<IPaginatedResults<User>> {
    const query = this.query().where('deletedAt', null);

    if (hasLoggedIn) {
      query.whereNotNull('lastLoginAt');
    } else {
      query.whereNull('lastLoginAt');
    }

    const usersResult = (await query.page(pageNumber, pageSize).orderBy(orderBy, order)) as any;
    return {
      results: usersResult.results,
      total: usersResult.total,
    };
  }

  static async delete(userId: string): Promise<User> {
    await this.query()
      .where({ id: userId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });
    const user = await this.query().findById(userId);
    if (!user) {
      return Promise.reject(`No such user: ${userId}`);
    }
    return user;
  }
}
/* tslint:enable:member-ordering */
