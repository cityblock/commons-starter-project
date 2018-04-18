import { toNumber } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import {
  addUserToGoogleCalendar,
  createGoogleCalendarAuth,
  deleteUserFromGoogleCalendar,
} from '../helpers/google-calendar-helpers';
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
  googleCalendarAclRuleId?: string;
}

interface ICareTeamAssignOptions {
  userId: string;
  patientIds: string[];
}

interface IUserPatientCount {
  patientCount: number;
}

interface IMakeTeamLeadOptions {
  userId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class CareTeam extends BaseModel {
  patient: Patient;
  patientId: string;
  user: User;
  userId: string;
  isCareTeamLead: boolean;
  googleCalendarAclRuleId: string;

  static tableName = 'care_team';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      isCareTeamLead: { type: 'boolean' },
      googleCalendarAclRuleId: { type: 'string', minLength: 1 },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['userId', 'patientId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'care_team.userId',
          to: 'user.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'care_team.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async get(
    patientId: string,
    userId: string,
    txn: Transaction,
  ): Promise<CareTeam | undefined> {
    return CareTeam.query(txn).findOne({ patientId, userId, deletedAt: null });
  }

  static async getForPatient(patientId: string, txn: Transaction): Promise<User[]> {
    const careTeam = await this.getCareTeamRecordsForPatient(patientId, txn);
    return careTeam.map((ct: CareTeam) => ct.user);
  }

  static async getCareTeamRecordsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<CareTeam[]> {
    return CareTeam.query(txn)
      .where({ patientId, deletedAt: null })
      .eager('user')
      .orderBy('createdAt', 'asc');
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
      .eager('patient.[patientInfo.[primaryAddress], patientState]')) as any;
    return {
      results: careTeam.results.map((ct: CareTeam) => ct.patient),
      total: careTeam.total,
    };
  }

  static async create({ userId, patientId }: ICareTeamOptions, txn: Transaction): Promise<User> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const relations = await CareTeam.query(txn).where({ userId, patientId, deletedAt: null });

    if (relations.length < 1) {
      const googleCalendarAclRuleId = await this.addCalendarPermissions(userId, patientId, txn);
      await CareTeam.query(txn).insert({ patientId, userId, googleCalendarAclRuleId });
    }

    return User.get(userId, txn);
  }

  static async createAllForUser(
    { userId, patientIds }: ICareTeamAssignOptions,
    txn: Transaction,
  ): Promise<User & IUserPatientCount> {
    const promises = patientIds.map(async patientId => {
      const relations = await CareTeam.query(txn).where({ userId, patientId, deletedAt: null });

      if (relations.length < 1) {
        const googleCalendarAclRuleId = await this.addCalendarPermissions(userId, patientId, txn);
        return CareTeam.query(txn).insert({ patientId, userId, googleCalendarAclRuleId });
      }
    });
    await Promise.all(promises);

    const user = (await CareTeam.query(txn)
      .joinRelation('user')
      .select(['user.id', 'firstName', 'lastName'])
      .select(this.raw('COUNT("patientId") as "patientCount"'))
      .where('care_team.userId', userId)
      .andWhere('care_team.deletedAt', null)
      .groupBy('user.id')) as any;

    return user[0];
  }

  static async editGoogleCalendarAclRuleId(
    googleCalendarAclRuleId: string,
    userId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<void> {
    await this.query(txn)
      .where({ userId, patientId, deletedAt: null })
      .patch({ googleCalendarAclRuleId });
  }

  static async reassignUser(
    { userId, patientId, reassignedToId }: ICareTeamReassignOptions,
    txn: Transaction,
    testConfig?: any,
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

    const patient = await Patient.get(patientId, txn);
    const jwtClient = createGoogleCalendarAuth(testConfig) as any;

    if (reassignedToId) {
      // Reassign all tasks
      await Task.reassignForUserForPatient({ userId, patientId, reassignedToId }, txn);
      // Unfollow all tasks and add reassignedTo as follower
      await TaskFollower.unfollowPatientTasks(
        { userId, patientId, newFollowerId: reassignedToId },
        txn,
      );
      if (patient.patientInfo.googleCalendarId) {
        const newUser = await User.get(reassignedToId, txn);
        const googleCalendarAclRuleId = await addUserToGoogleCalendar(
          jwtClient,
          patient.patientInfo.googleCalendarId,
          newUser.email,
        );
        await this.editGoogleCalendarAclRuleId(googleCalendarAclRuleId, userId, patientId, txn);
      }
    }

    // Remove user from CareTeam
    if (patient.patientInfo.googleCalendarId) {
      const careTeam = await this.get(patientId, userId, txn);

      if (careTeam) {
        await deleteUserFromGoogleCalendar(
          jwtClient,
          patient.patientInfo.googleCalendarId,
          careTeam.googleCalendarAclRuleId,
        );
      }
    }
    await this.delete({ userId, patientId }, txn);

    return User.get(userId, txn);
  }

  static async makeTeamLead(
    { userId, patientId }: IMakeTeamLeadOptions,
    txn: Transaction,
  ): Promise<User> {
    // First, unset current care team lead
    await this.query(txn)
      .where({ patientId, deletedAt: null })
      .patch({ isCareTeamLead: false });

    // Next, set user as team lead
    await this.query(txn)
      .where({ patientId, userId, deletedAt: null })
      .patch({ isCareTeamLead: true });

    return User.get(userId, txn);
  }

  static async getTeamLeadForPatient(patientId: string, txn: Transaction): Promise<User | null> {
    const careTeamUser = await this.query(txn)
      .eager('user')
      .findOne({ patientId, deletedAt: null, isCareTeamLead: true });

    if (!careTeamUser) {
      return null;
    }

    return careTeamUser.user;
  }

  static async delete({ userId, patientId }: ICareTeamOptions, txn: Transaction): Promise<User[]> {
    await this.query(txn)
      .where({ userId, patientId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString(), isCareTeamLead: false });
    return this.getForPatient(patientId, txn);
  }

  static async isOnCareTeam(
    { userId, patientId }: ICareTeamOptions,
    txn: Transaction,
  ): Promise<boolean> {
    const result = await this.query(txn).where({ userId, patientId, deletedAt: null });

    return !!result.length;
  }

  static async addCalendarPermissions(userId: string, patientId: string, txn: Transaction) {
    const patient = await Patient.get(patientId, txn);
    if (patient.patientInfo.googleCalendarId) {
      const user = await User.get(userId, txn);
      const jwtClient = createGoogleCalendarAuth() as any;
      return addUserToGoogleCalendar(jwtClient, patient.patientInfo.googleCalendarId, user.email);
    }
  }
}
/* tslint:enable:member-ordering */
