import { toNumber } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import ProgressNote from './progress-note';
import Task from './task';
import TaskFollower from './task-follower';
import User from './user';

interface ICareTeamReassignOptions {
  userId: string;
  patientId: string;
  reassignedToId?: string | null;
}

interface ICareTeamOptions {
  userId: string;
  patientId: string;
}

interface ICareTeamAssignOptions {
  userId: string;
  patientIds: string[];
}

interface IUserPatientCount {
  patientCount: number;
}

/* tslint:disable:member-ordering */
export default class CareTeam extends BaseModel {
  patient: Patient;
  patientId: string;
  user: User;
  userId: string;

  static tableName = 'care_team';

  static hasPHI = false;

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
      .where({ patientId, deletedAt: null })
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
      .eager('patient.[patientInfo.[primaryAddress]]')) as any;
    return {
      results: careTeam.results.map((ct: CareTeam) => ct.patient),
      total: careTeam.total,
    };
  }

  static async create({ userId, patientId }: ICareTeamOptions, txn: Transaction): Promise<User> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const relations = await CareTeam.query(txn).where({ userId, patientId, deletedAt: null });

    if (relations.length < 1) {
      await CareTeam.query(txn).insert({ patientId, userId });
    }

    return User.get(userId, txn);
  }

  static async createAllForUser(
    { userId, patientIds }: ICareTeamAssignOptions,
    txn: Transaction,
  ): Promise<User & IUserPatientCount> {
    const rows = patientIds.map(id => {
      return { id: uuid(), userId, patientId: id };
    });
    const insertQuery = txn
      .table('care_team')
      .insert(rows)
      .toString();
    await txn.raw(`${insertQuery} ON CONFLICT DO NOTHING`);

    const user = (await CareTeam.query(txn)
      .joinRelation('user')
      .select(['user.id', 'firstName', 'lastName'])
      .select(this.raw('COUNT("patientId") as "patientCount"'))
      .where('care_team.userId', userId)
      .andWhere('care_team.deletedAt', null)
      .groupBy('user.id')) as any;

    return user[0];
  }

  static async reassignUser(
    { userId, patientId, reassignedToId }: ICareTeamReassignOptions,
    txn: Transaction,
  ): Promise<User> {
    const tasksToBeReassigned = await Task.getAllUserPatientTasks({ userId, patientId }, txn);
    const openProgressNote = await ProgressNote.getForUserForPatient(userId, patientId, txn);

    if (openProgressNote) {
      return Promise.reject(
        'This user has an open Progress Note. Please submit before removing from care team.',
      );
    }

    if (tasksToBeReassigned.length && !reassignedToId) {
      return Promise.reject('Must provide a replacement user when there are tasks to reassign');
    }

    if (reassignedToId) {
      // Reassign all tasks
      await Task.reassignForUserForPatient({ userId, patientId, reassignedToId }, txn);
      // Unfollow all tasks and add reassignedTo as follower
      await TaskFollower.unfollowPatientTasks(
        { userId, patientId, newFollowerId: reassignedToId },
        txn,
      );
    }

    // Remove user from CareTeam
    await this.delete({ userId, patientId }, txn);

    return User.get(userId, txn);
  }

  static async delete({ userId, patientId }: ICareTeamOptions, txn: Transaction): Promise<User[]> {
    await this.query(txn)
      .where({ userId, patientId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    return this.getForPatient(patientId, txn);
  }

  static async isOnCareTeam(
    { userId, patientId }: ICareTeamOptions,
    txn: Transaction,
  ): Promise<boolean> {
    const result = await this.query(txn).where({ userId, patientId, deletedAt: null });

    return !!result.length;
  }
}
/* tslint:enable:member-ordering */
