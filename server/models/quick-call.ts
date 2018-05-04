import { omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { QuickCallDirection } from 'schema';
import BaseModel from './base-model';
import ProgressNote from './progress-note';
import User from './user';

const EAGER_QUERY = '[user, progressNote]';

interface IQuickCallCreateOptions {
  userId: string;
  patientId: string; // Needed to lookup or create progressNoteId
  reason: string;
  summary: string;
  direction: QuickCallDirection;
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
  direction: QuickCallDirection;
  callRecipient: string;
  wasSuccessful: boolean;
  startTime: string;
  user: User;
  progressNote: ProgressNote;

  static tableName = 'quick_call';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      progressNoteId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      reason: { type: 'string', minLength: 1 }, // cannot be blank
      summary: { type: 'string', minLength: 1 }, // cannot be blank
      direction: { type: 'string', enum: ['Inbound', 'Outbound'] },
      callRecipient: { type: 'string', minLength: 1 }, // cannot be blank
      wasSuccessful: { type: 'boolean' },
      startTime: { type: 'string', minLength: 1 }, // cannot be blank
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: [
      'userId',
      'progressNoteId',
      'reason',
      'summary',
      'direction',
      'callRecipient',
      'wasSuccessful',
      'startTime',
    ],
  };

  static get relationMappings(): RelationMappings {
    return {
      progressNote: {
        relation: Model.BelongsToOneRelation,
        modelClass: ProgressNote,
        join: {
          from: 'quick_call.progressNoteId',
          to: 'progress_note.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'quick_call.userId',
          to: 'user.id',
        },
      },
    };
  }

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

  static async getPatientIdForResource(quickCallId: string, txn: Transaction): Promise<string> {
    const result = await this.query(txn)
      .eager('[progressNote]')
      .where({ deletedAt: null })
      .findById(quickCallId);

    return result ? result.progressNote.patientId : '';
  }
}
/* tslint:enable:member-ordering */
