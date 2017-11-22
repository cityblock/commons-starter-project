import { omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import ProgressNote from './progress-note';
import User from './user';

type direction = 'Inbound' | 'Outbound';

const EAGER_QUERY = '[user,progressNote]';
interface IQuickCallCreateOptions {
  userId: string;
  patientId: string; // Needed to lookup or create progressNoteId
  reason: string;
  summary: string;
  direction: direction;
  callRecipient: string;
  wasSuccessful: boolean;
  startTime: string;
}

/* tslint:disable:member-ordering */
export default class QuickCall extends BaseModel {
  userId: string;
  progressNoteId: string;
  reason: string;
  summary: string;
  direction: direction;
  callRecipient: string;
  wasSuccessful: boolean;
  startTime: string;
  user: User;
  progressNote: ProgressNote;

  static tableName = 'quick_call';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      progressNoteId: { type: 'string' },
      userId: { type: 'string' },
      reason: { type: 'string' },
      summary: { type: 'string' },
      direction: { type: 'string' },
      callRecipient: { type: 'string' },
      wasSuccessful: { type: 'boolean' },
      startTime: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    progressNote: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'progress-note',
      join: {
        from: 'quick_call.progressNoteId',
        to: 'progress_note.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'quick_call.userId',
        to: 'user.id',
      },
    },
  };

  static async create(input: IQuickCallCreateOptions, txn: Transaction): Promise<QuickCall> {
    const progressNote = await ProgressNote.autoOpenIfRequired(
      { userId: input.userId, patientId: input.patientId },
      txn,
    );

    const quickCallInsertParams: any = omit(input, ['patientId']);
    quickCallInsertParams.progressNoteId = progressNote.id;
    return this.query<QuickCall>(txn)
      .insert(quickCallInsertParams)
      .eager(EAGER_QUERY) as any;
  }

  static async get(quickCallId: string, txn: Transaction): Promise<QuickCall> {
    const quickCall = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({
        id: quickCallId,
      });
    if (!quickCall) {
      return Promise.reject(`No such quick call: ${quickCallId}`);
    }
    return quickCall;
  }

  static async getQuickCallsForProgressNote(
    progressNoteId: string,
    txn: Transaction,
  ): Promise<QuickCall[]> {
    const quickCalls = await this.query(txn)
      .eager(EAGER_QUERY)
      .where('progressNoteId', progressNoteId);

    return quickCalls;
  }
}
/* tslint:enable:member-ordering */
