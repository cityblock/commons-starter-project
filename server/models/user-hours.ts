import { omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import { RANGE_REGEX } from './screening-tool-score-range';
import User from './user';

interface IUserHoursCreate {
  userId: string;
  weekday: number;
  startTime: number;
  endTime: number;
}

interface IUserHoursEdit {
  startTime: number;
  endTime: number;
}

interface IUserHoursTemplate {
  weekday: number;
  startTime: number;
  endTime: number;
}

const MIN_START_TIME = 0;
const MAX_END_TIME = 2400;
const HOUR_CUTOFF = 60;

/* tslint:disable:member-ordering */
export default class UserHours extends BaseModel {
  userId!: string;
  user!: User;
  timeRange!: string;
  startTime!: number;
  endTime!: number;
  weekday!: number; // 0 - 6, corresponding to Sunday - Saturday

  static tableName = 'user_hours';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      weekday: { type: 'integer', minimum: 0, maximum: 6 },
      timeRange: { type: 'int4range' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['userId', 'weekday', 'timeRange'],
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_hours.userId',
          to: 'user.id',
        },
      },
    };
  }

  static withStartAndEndTime(userHours: UserHours) {
    const rangeMatch = RANGE_REGEX.exec(userHours.timeRange);

    return {
      ...userHours,
      startTime: parseInt(rangeMatch![1], 10),
      endTime: parseInt(rangeMatch![2], 10) - 1,
    };
  }

  static async create(input: IUserHoursCreate, txn: Transaction): Promise<UserHours> {
    const { startTime, endTime } = input;

    // ensure only valid time representations accepted
    if (startTime < MIN_START_TIME || endTime > MAX_END_TIME) {
      return Promise.reject(`start: ${startTime} and end: ${endTime} must be between 0 and 2400`);
    }
    if (startTime % 100 >= HOUR_CUTOFF || endTime % 100 >= HOUR_CUTOFF) {
      return Promise.reject(`start: ${startTime} and end: ${endTime} must be valid times`);
    }

    const timeRange = `[${startTime}, ${endTime}]`;

    const filtered = {
      ...omit<IUserHoursCreate>(input, ['startTime', 'endTime']),
      timeRange,
    };

    return this.query(txn).insertAndFetch(filtered);
  }

  // create default hours for a user based on templates
  static async createDefaultsForUser(
    userId: string,
    templates: IUserHoursTemplate[],
    txn: Transaction,
  ): Promise<UserHours[]> {
    const createPromises: Array<Promise<UserHours>> = [];

    templates.forEach(template => {
      const input = {
        ...template,
        userId,
      };

      createPromises.push(UserHours.create(input, txn));
    });

    await Promise.all(createPromises);

    return UserHours.getForUser(userId, txn);
  }

  // for ease will just send both start time and end time on edit
  static async edit(
    userHoursId: string,
    input: IUserHoursEdit,
    txn: Transaction,
  ): Promise<UserHours> {
    const { startTime, endTime } = input;

    const timeRange = `[${startTime}, ${endTime}]`;

    return this.query(txn).patchAndFetchById(userHoursId, { timeRange });
  }

  static async delete(userHoursId: string, txn: Transaction): Promise<UserHours> {
    await this.query(txn)
      .where({ id: userHoursId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const userHours = await this.query(txn).findById(userHoursId);

    if (!userHours) {
      return Promise.reject(`No such userHours: ${userHoursId}`);
    }

    return userHours;
  }

  static async getForUser(userId: string, txn: Transaction): Promise<UserHours[]> {
    return this.query(txn)
      .where({ userId, deletedAt: null })
      .orderBy('weekday', 'ASC');
  }
}
/* tslint:enable:member-ordering */
