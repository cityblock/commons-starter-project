import { hash } from 'bcrypt';
import { Model, RelationMappings, ValidationError } from 'objection';
import * as uuid from 'uuid';
import { isEmail } from 'validator';
import config from '../config';
import Clinic from './clinic';

export type UserRole =
  'physician' |
  'nurseCareManager' |
  'healthCoach' |
  'familyMember' |
  'anonymousUser';

export interface ICreateUser {
  email: string;
  password: string;
  homeClinicId: string;
  firstName?: string;
  lastName?: string;
  userRole?: UserRole;
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
  hashedPassword: string;
  homeClinicId: string;
  homeClinic: Clinic;

  static tableName = 'user';

  static modelPaths = [__dirname];

  static jsonSchema = {
    type: 'object',
    required: ['email', 'userRole', 'homeClinicId'],
    properties: {
      id: { type: 'string' },
      lastLoginAt: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string' },
      userRole: {
        type: 'string',
        enum: ['familyMember', 'healthCoach', 'physician', 'nurseCareManager'],
      },
      hashedPassword: { type: 'string' },
      homeClinicId: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    homeClinic: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'clinic',
      join: {
        from: 'user.homeClinicId',
        to: 'clinic.id',
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
    this.id = uuid.v4();
    this.createdAt = new Date().toISOString();
  }

  async $beforeUpdate() {
    await this.$beforeSave(false);
    this.updatedAt = new Date().toISOString();
  }

  async updateLoginAt(lastLoginAt: string) {
    return await this.$query().patch({ lastLoginAt } as this); // Typings are weird here
  }

  static async getLastLoggedIn(userId: string): Promise<string | undefined> {
    // TODO: Figure out how to return select fields via knex
    const user = await this.query().findById(userId);
    return user ? user.lastLoginAt : undefined;
  }

  static async create(user: ICreateUser): Promise<User> {
    const hashedPassword = await hash(user.password, config.SALT_ROUNDS);
    const userWithHashedPassword = { ...user, hashedPassword };

    return await this
      .query()
      .insertAndFetch(userWithHashedPassword);
  }

  static async get(userId: string): Promise<User> {
    const user = await this
      .query()
      .eager('[homeClinic]')
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
}
/* tslint:enable:member-ordering */
