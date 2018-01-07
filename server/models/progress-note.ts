import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import ProgressNoteTemplate from './progress-note-template';
import User from './user';

interface IProgressNoteEditableFields {
  patientId: string;
  startedAt?: string;
  location?: string;
  userId: string;
  summary?: string;
  memberConcern?: string;
  progressNoteTemplateId: string;
  needsSupervisorReview?: boolean;
  supervisorId?: string;
}

interface IProgressNoteAutoOpenFields {
  patientId: string;
  userId: string;
}

const EAGER_QUERY = '[progressNoteTemplate, user, patient, supervisor]';

/* tslint:disable:member-ordering */
export default class ProgressNote extends BaseModel {
  patientId: string;
  userId: string;
  progressNoteTemplateId?: string;
  progressNoteTemplate?: ProgressNoteTemplate;
  location: string;
  startedAt: string;
  completedAt: string;
  summary: string;
  memberConcern: string;
  user: User;
  patient: Patient;
  supervisorNotes: string;
  supervisorId: string;
  supervisor: User;
  needsSupervisorReview: boolean;
  reviewedBySupervisorAt: string;

  static tableName = 'progress_note';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      progressNoteTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      startedAt: { type: 'string' },
      location: { type: 'string' },
      completedAt: { type: 'string' },
      summary: { type: 'string' },
      memberConcern: { type: 'string' },
      deletedAt: { type: 'string' },
      supervisorNotes: { type: 'string' },
      supervisorId: { type: 'string' },
      needsSupervisorReview: { type: 'boolean' },
      reviewedBySupervisorAt: { type: 'string' },
    },
    required: ['patientId', 'userId'],
  };

  static relationMappings: RelationMappings = {
    /**
     *  Future relations
     * - Task Events - join on task events with a progress note id
     * - Patient Answer Events - join on patient answer event with a progress note id
     * - Care Plan Update Events - join on care plan update events where progress note id
     * - Quick calls
     * - Patient answers - for questions in the progress note (could just be on question/answer)
     */

    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'progress_note.patientId',
        to: 'patient.id',
      },
    },
    user: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'progress_note.userId',
        to: 'user.id',
      },
    },
    supervisor: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'progress_note.supervisorId',
        to: 'user.id',
      },
    },
    progressNoteTemplate: {
      relation: Model.HasOneRelation,
      modelClass: 'progress-note-template',
      join: {
        from: 'progress_note.progressNoteTemplateId',
        to: 'progress_note_template.id',
      },
    },
    taskEvents: {
      relation: Model.HasManyRelation,
      modelClass: 'task-event',
      join: {
        from: 'progress_note.id',
        to: 'task_event.progressNoteId',
      },
    },
  };

  static async get(progressNoteId: string, txn?: Transaction): Promise<ProgressNote> {
    const progressNote = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({
        id: progressNoteId,
        deletedAt: null,
      });
    if (!progressNote) {
      return Promise.reject(`No such progress note: ${progressNoteId}`);
    }
    return progressNote;
  }

  static async getAllForPatient(
    patientId: string,
    completed: boolean,
    txn?: Transaction,
  ): Promise<ProgressNote[]> {
    const query = this.query(txn)
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .where({ deletedAt: null, patientId });

    if (completed) {
      query.whereNotNull('completedAt');
    } else {
      query.whereNull('completedAt');
    }
    return await query;
  }

  static async getAllForUser(
    userId: string,
    completed: boolean,
    txn?: Transaction,
  ): Promise<ProgressNote[]> {
    const query = this.query(txn)
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .where({ deletedAt: null, userId });

    if (completed) {
      query.whereNotNull('completedAt');
    } else {
      query.whereNull('completedAt');
    }
    return await query;
  }

  static async create(input: IProgressNoteEditableFields, txn?: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async update(
    progressNoteId: string,
    progressNote: Partial<IProgressNoteEditableFields>,
    txn?: Transaction,
  ) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(progressNoteId, progressNote);
  }

  static async addSupervisorReview(
    progressNoteId: string,
    supervisorNotes: string,
    txn?: Transaction,
  ) {
    await this.query(txn)
      .where({ id: progressNoteId, deletedAt: null, reviewedBySupervisorAt: null })
      .whereNotNull('completedAt')
      .patch({
        supervisorNotes,
        reviewedBySupervisorAt: new Date().toISOString(),
      });

    const progressNote = await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ id: progressNoteId, deletedAt: null })
      .whereNotNull('completedAt')
      .whereNotNull('reviewedBySupervisorAt')
      .first();

    if (!progressNote) {
      return Promise.reject(`Progress note already reviewed: ${progressNoteId}`);
    }
    return progressNote;
  }

  static async autoOpenIfRequired(input: IProgressNoteAutoOpenFields, txn?: Transaction) {
    const { patientId, userId } = input;

    const existingProgressNote = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({
        deletedAt: null,
        completedAt: null,
        patientId,
        userId,
      });

    if (!existingProgressNote) {
      return await this.query(txn)
        .eager(EAGER_QUERY)
        .insertAndFetch(input);
    }

    return existingProgressNote;
  }

  static async complete(progressNoteId: string, txn?: Transaction): Promise<ProgressNote> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(progressNoteId, {
        completedAt: new Date().toISOString(),
      });
  }

  static async delete(progressNoteId: string, txn?: Transaction) {
    await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ id: progressNoteId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const progressNote = await this.query(txn).findById(progressNoteId);

    if (!progressNote) {
      return Promise.reject(`No such progress note: ${progressNoteId}`);
    }
    return progressNote;
  }
}
/* tslint:enable:member-ordering */
