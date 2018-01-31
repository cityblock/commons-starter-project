import { toNumber } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import User from './user';

interface ICareTeamOptions {
  userId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class CareTeam extends BaseModel {
  patient: Patient;
  patientId: string;
  user: User;
  userId: string;

  static tableName = 'care_team';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['userId', 'patientId'],
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

  static async getForPatient(patientId: string, txn: Transaction): Promise<User[]> {
    const careTeam = await CareTeam.query(txn)
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .eager('user')
      .orderBy('createdAt', 'asc');
    return careTeam.map((ct: CareTeam) => ct.user);
  }

  static async getCountForPatient(patientId: string, txn: Transaction): Promise<number> {
    const careTeamCount = (await CareTeam.query(txn)
      .where('patientId', patientId)
      .andWhere('deletedAt', null)
      .count()) as any;

    return toNumber(careTeamCount[0].count);
  }

  static async getForUser(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<Patient>> {
    const careTeam = (await CareTeam.query(txn)
      .where('userId', userId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .page(pageNumber, pageSize)
      .eager('patient')) as any;
    return {
      results: careTeam.results.map((ct: CareTeam) => ct.patient),
      total: careTeam.total,
    };
  }

  static async create({ userId, patientId }: ICareTeamOptions, txn: Transaction): Promise<User[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const relations = await CareTeam.query(txn)
      .where('patientId', patientId)
      .andWhere('userId', userId)
      .andWhere('deletedAt', null);

    if (relations.length < 1) {
      await CareTeam.query(txn).insert({ patientId, userId });
    }

    return await this.getForPatient(patientId, txn);
  }

  static async delete({ userId, patientId }: ICareTeamOptions, txn: Transaction): Promise<User[]> {
    await this.query(txn)
      .where('userId', userId)
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .patch({ deletedAt: new Date().toISOString() });
    return await this.getForPatient(patientId, txn);
  }
}
/* tslint:enable:member-ordering */
