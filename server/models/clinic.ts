import { Model, ValidationError, RelationMappings } from 'objection';
import * as uuid from 'uuid';
import User from './user';

export interface ICreateClinic {
  name: string;
  departmentId: number;
}

export type GetByOptions = 'name' | 'departmentId';

export default class Clinic extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  departmentId: number;
  users: User[];

  static tableName = 'clinic';

  static modelPaths = [__dirname];

  static jsonSchema = {
    type: 'object',
    required: ['name', 'departmentId'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      departmentId: { type: 'integer' },
    },
  };

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: 'user',
      join: {
        from: 'clinic.id',
        to: 'user.homeClinicId',
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

  static async create(clinic: ICreateClinic): Promise<Clinic> {
    return await this
      .query()
      .insertAndFetch(clinic);
  }

  static async get(clinicId: string): Promise<Clinic | null> {
    const clinic = await this
      .query()
      .findById(clinicId);

      if (!clinic) {
        return null;
      }

      return clinic;
  }

  static async getBy(fieldName: GetByOptions, field?: string | number): Promise<Clinic | null> {
    if (!field) {
      return null;
    }

    const clinic = await this
      .query()
      .where(fieldName, field)
      .first();

    if (!clinic) {
      return null;
    }

    return clinic;
  }
}
