import { Model, RelationMappings, Transaction } from 'objection';
import { Permissions, PERMISSIONS } from '../../shared/permissions/permissions-mapping';
import { IPaginatedResults, IPaginationOptions } from '../db';
import {
  attributionUserEmail,
  attributionUserPermissions,
  attributionUserUserRole,
} from '../lib/consts';
import BaseModel from './base-model';
import Clinic from './clinic';
import GoogleAuth from './google-auth';

export type UserRole =
  | 'physician'
  | 'nurseCareManager'
  | 'healthCoach'
  | 'familyMember'
  | 'anonymousUser'
  | 'admin';
export const USER_ROLE: UserRole[] = [
  'physician',
  'nurseCareManager',
  'healthCoach',
  'familyMember',
  'anonymousUser',
  'admin',
];

export type Locale = 'en' | 'es';
const LOCALE: Locale[] = ['en', 'es'];

interface ICreateUser {
  email: string;
  homeClinicId: string;
  firstName?: string;
  lastName?: string;
  userRole?: UserRole;
  athenaProviderId?: number;
  phone?: string;
}

interface IUpdateUser {
  locale: Locale;
  googleProfileImageUrl: string;
  googleAuthId: string;
  homeClinicId: string;
  firstName: string;
  lastName: string;
  lastLoginAt: string;
  phone: string;
}

interface IGetByOptions {
  fieldName: GetByFields;
  field?: string;
}

type GetByFields = 'email';

export type UserOrderOptions =
  | 'createdAt'
  | 'createdAt'
  | 'lastLoginAt'
  | 'lastLoginAt'
  | 'updatedAt'
  | 'updatedAt'
  | 'email';

export interface IUserFilterOptions extends IPaginationOptions {
  hasLoggedIn: boolean;
  orderBy: UserOrderOptions;
  order: 'asc' | 'desc';
}

/* tslint:disable:member-ordering */
export default class User extends BaseModel {
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
  phone: string;
  permissions: Permissions;

  static tableName = 'user';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      lastLoginAt: { type: 'string' },
      firstName: { type: 'string', minLength: 1 }, // cannot be blank
      lastName: { type: 'string', minLength: 1 }, // cannot be blank
      email: { type: 'string', format: 'email' },
      locale: { type: 'string', enum: LOCALE },
      userRole: {
        type: 'string',
        enum: USER_ROLE,
      },
      homeClinicId: { type: 'string', minLength: 1 }, // cannot be blank
      athenaProviderId: { type: 'number', minLength: 1 }, // cannot be blank
      googleAuthId: { type: 'string', minLength: 1 }, // cannot be blank
      googleProfileImageUrl: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      phone: { type: 'string' },
      permissions: { type: 'string', enum: PERMISSIONS },
    },
    required: ['email', 'homeClinicId', 'userRole'],
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

  static async getLastLoggedIn(userId: string, txn: Transaction): Promise<string | undefined> {
    // TODO: Figure out how to return select fields via knex
    const user = await this.query(txn).findById(userId);
    return user ? user.lastLoginAt : undefined;
  }

  static async create(user: ICreateUser, txn: Transaction): Promise<User> {
    return this.query(txn).insertAndFetch(user);
  }

  static async findOrCreateAttributionUser(txn: Transaction): Promise<User> {
    const user = await this.query(txn).findOne({ email: attributionUserEmail });

    if (!user) {
      const clinic = await Clinic.findOrCreateAttributionClinic(txn);
      return this.query(txn).insertAndFetch({
        email: attributionUserEmail,
        permissions: attributionUserPermissions,
        userRole: attributionUserUserRole,
        homeClinicId: clinic.id,
      });
    }

    return user;
  }

  static async update(userId: string, user: Partial<IUpdateUser>, txn: Transaction): Promise<User> {
    return this.query(txn).patchAndFetchById(userId, user);
  }

  // NOTE: Separated because it is admin only - a user should not be able to change their own role
  static async updateUserRole(userId: string, userRole: UserRole, txn: Transaction): Promise<User> {
    return this.query(txn).patchAndFetchById(userId, { userRole });
  }

  static async get(userId: string, txn: Transaction): Promise<User> {
    const user = await this.query(txn).findOne({ id: userId, deletedAt: null });
    if (!user) {
      return Promise.reject(`No such user: ${userId}`);
    }
    return user;
  }

  static async getBy(input: IGetByOptions, txn: Transaction): Promise<User | null> {
    if (!input.field) {
      return null;
    }

    const user = await this.query(txn)
      .where(input.fieldName, input.field)
      .andWhere('deletedAt', null)
      .first();

    if (!user || !!user.deletedAt) {
      return null;
    }

    return user;
  }

  static async getAll(
    { pageNumber, pageSize, hasLoggedIn, orderBy, order }: IUserFilterOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<User>> {
    const query = this.query(txn).where('deletedAt', null);

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

  static async getUserSummaryList(userRoleFilters: UserRole[], txn: Transaction) {
    return this.query(txn)
      .whereIn('userRole', userRoleFilters)
      .select(['userRole', 'id', 'firstName', 'lastName'])
      .orderBy('lastName');
  }

  static async delete(userId: string, txn: Transaction): Promise<User> {
    await this.query(txn)
      .where({ id: userId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    const user = await this.query(txn).findById(userId);
    if (!user) {
      return Promise.reject(`No such user: ${userId}`);
    }
    return user;
  }
}
/* tslint:enable:member-ordering */
