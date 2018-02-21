import { isBefore, subHours } from 'date-fns';
import { Transaction } from 'objection';
import config from '../config';
import BaseModel from './base-model';

interface IProgressNoteGlassBreakCreateFields {
  userId: string;
  progressNoteId: string;
  reason: string;
  note: string | null;
}

/* tslint:disable:member-ordering */
export default class ProgressNoteGlassBreak extends BaseModel {
  userId: string;
  progressNoteId: string;
  reason: string;
  note: string | null;

  static tableName = 'progress_note_glass_break';
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      createdAt: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      progressNoteId: { type: 'string', format: 'uuid' },
      reason: { type: 'string', minLength: 1 }, // cannot be blank
      note: { type: ['string', 'null'], minLength: 1 }, // cannot store empty string
    },
    required: ['userId', 'progressNoteId', 'reason'],
  };

  static async create(
    input: IProgressNoteGlassBreakCreateFields,
    txn: Transaction,
  ): Promise<ProgressNoteGlassBreak> {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(
    progressNoteGlassBreakId: string,
    txn: Transaction,
  ): Promise<ProgressNoteGlassBreak> {
    const progressNoteGlassBreak = await this.query(txn).findOne({
      id: progressNoteGlassBreakId,
      deletedAt: null,
    });

    if (!progressNoteGlassBreak) {
      return Promise.reject(`No such progress note glass break: ${progressNoteGlassBreakId}`);
    }

    return progressNoteGlassBreak;
  }

  static async validateGlassBreak(
    progressNoteGlassBreakId: string,
    txn: Transaction,
  ): Promise<boolean> {
    const glassBreak = await this.get(progressNoteGlassBreakId, txn);

    if (isBefore(glassBreak.createdAt, subHours(Date.now(), config.PERMISSIONS_SESSION_IN_HOURS))) {
      return Promise.reject(`Glass break ${progressNoteGlassBreakId} occurred too long ago`);
    }

    return true;
  }

  static async getForCurrentUserSession(
    userId: string,
    txn: Transaction,
  ): Promise<ProgressNoteGlassBreak[]> {
    return this.query(txn)
      .whereRaw(
        `
        progress_note_glass_break."createdAt" > now() - interval \'${config.PERMISSIONS_SESSION_IN_HOURS -
          1} hours\'
      `,
      )
      .andWhere({ userId, deletedAt: null });
  }
}
/* tslint:enable:member-ordering */
