import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Patient from './patient';
import User from './user';

export interface ICareTeamOptions {
  userId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class CareTeam extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  patient: Patient;
  user: User;

  static tableName = 'care_team';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'care_team.userId',
        to: 'user.id',
      },
    },
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'care_team.patientId',
        to: 'patient.id',
      },
    },
  };

  $beforeInsert() {
    this.id = uuid.v4();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async getForPatient(patientId: string): Promise<User[]> {
    const careTeam = await CareTeam
      .query()
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .eager('user')
      .orderBy('createdAt', 'asc');
    return careTeam.map((ct: CareTeam) => ct.user);
  }

  static async getForUser(
    userId: string, { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<Patient>> {
    const careTeam = await CareTeam
      .query()
      .where('userId', userId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .page(pageNumber, pageSize)
      .eager('patient') as any;
    return {
      results: careTeam.results.map((ct: CareTeam) => ct.patient),
      total: careTeam.total,
    };
  }

  static async addUserToCareTeam({ userId, patientId }: ICareTeamOptions): Promise<User[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(User, async UserWithTransaction => {
      const user = await UserWithTransaction
        .query()
        .findById(userId);
      if (!user) {
        throw new Error('user not found');
      } else {
        const relations = await user
          .$relatedQuery('patients')
          .where('patientId', patientId)
          .andWhere('deletedAt', null);
        if (relations.length < 1) {
          await user
            .$relatedQuery('patients')
            .relate(patientId);
        }
      }
    });
    return await this.getForPatient(patientId);
  }

  static async removeUserFromCareTeam({ userId, patientId }: ICareTeamOptions): Promise<User[]> {
    await this.query()
      .where('userId', userId)
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .update({ deletedAt: new Date().toISOString() });
    return await this.getForPatient(patientId);
  }

}
/* tslint:disable:member-ordering */
