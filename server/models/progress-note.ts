import { toNumber } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import ProgressNoteTemplate from './progress-note-template';
import TaskEvent from './task-event';
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
  worryScore?: number;
}

interface IProgressNoteAutoOpenFields {
  patientId: string;
  userId: string;
}

interface IProgressNoteId {
  id: string;
  createdAt: string;
}

const EAGER_QUERY = '[progressNoteTemplate, user, patient.[patientInfo, patientState], supervisor]';

/* tslint:disable:member-ordering */
export default class ProgressNote extends BaseModel {
  patientId: string;
  userId: string;
  progressNoteTemplateId: string | null;
  progressNoteTemplate: ProgressNoteTemplate | null;
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
  worryScore: number;

  static tableName = 'progress_note';

  static hasPHI = true;

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
      updatedAt: { type: 'string' },
      supervisorNotes: { type: 'string' },
      supervisorId: { type: 'string' },
      needsSupervisorReview: { type: 'boolean' },
      reviewedBySupervisorAt: { type: 'string' },
      worryScore: { type: 'integer', minimum: 1, maximum: 3 },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'userId'],
  };

  static get relationMappings(): RelationMappings {
    /**
     *  Future relations
     * - Task Events - join on task events with a progress note id
     * - Patient Answer Events - join on patient answer event with a progress note id
     * - Care Plan Update Events - join on care plan update events where progress note id
     * - Quick calls
     * - Patient answers - for questions in the progress note (could just be on question/answer)
     */
    return {
      patient: {
        relation: Model.HasOneRelation,
        modelClass: Patient,
        join: {
          from: 'progress_note.patientId',
          to: 'patient.id',
        },
      },
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'progress_note.userId',
          to: 'user.id',
        },
      },
      supervisor: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'progress_note.supervisorId',
          to: 'user.id',
        },
      },
      progressNoteTemplate: {
        relation: Model.HasOneRelation,
        modelClass: ProgressNoteTemplate,
        join: {
          from: 'progress_note.progressNoteTemplateId',
          to: 'progress_note_template.id',
        },
      },
      taskEvents: {
        relation: Model.HasManyRelation,
        modelClass: TaskEvent,
        join: {
          from: 'progress_note.id',
          to: 'task_event.progressNoteId',
        },
      },
    };
  }

  static async get(progressNoteId: string, txn: Transaction): Promise<ProgressNote> {
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
    txn: Transaction,
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
    return query;
  }

  static async getAllIdsForPatient(
    patientId: string,
    completed: boolean,
    txn: Transaction,
  ): Promise<IProgressNoteId[]> {
    const query = this.query(txn)
      .select(['id', 'createdAt'])
      .orderBy('createdAt', 'desc')
      .where({ deletedAt: null, patientId });

    if (completed) {
      query.whereNotNull('completedAt');
    } else {
      query.whereNull('completedAt');
    }
    return query;
  }

  static async getCountForPatient(patientId: string, txn: Transaction): Promise<number> {
    const progressNoteCount = (await this.query(txn)
      .where({ patientId, deletedAt: null })
      .count()) as any;

    return toNumber(progressNoteCount[0].count);
  }

  static async getLatestForPatient(patientId: string, txn: Transaction): Promise<ProgressNote> {
    const latestNote = await this.query(txn)
      .where({ patientId, deletedAt: null })
      .whereNotNull('completedAt')
      .orderBy('createdAt', 'desc')
      .limit(1);

    return latestNote[0] || null;
  }

  static async getAllForUser(
    userId: string,
    completed: boolean,
    txn: Transaction,
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
    return query;
  }

  static async getProgressNotesForSupervisorReview(
    supervisorId: string,
    txn: Transaction,
  ): Promise<ProgressNote[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .where({
        deletedAt: null,
        needsSupervisorReview: true,
        reviewedBySupervisorAt: null,
        supervisorId,
      })
      .whereNotNull('completedAt');
  }

  static async create(input: IProgressNoteEditableFields, txn: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async update(
    progressNoteId: string,
    progressNote: Partial<IProgressNoteEditableFields>,
    txn: Transaction,
  ) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(progressNoteId, progressNote);
  }

  static async addSupervisorNotes(
    progressNoteId: string,
    supervisorNotes: string,
    txn: Transaction,
  ) {
    const updates = await this.query(txn)
      .where({ id: progressNoteId, deletedAt: null, reviewedBySupervisorAt: null })
      .whereNull('reviewedBySupervisorAt')
      .whereNotNull('completedAt')
      .patch({
        supervisorNotes,
      });

    if (!updates) {
      return Promise.reject(`Progress note not yet completed: ${progressNoteId}`);
    }

    const progressNote = await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ id: progressNoteId, deletedAt: null })
      .whereNotNull('completedAt')
      .whereNull('reviewedBySupervisorAt')
      .first();

    if (!progressNote) {
      return Promise.reject(`Progress note already reviewed: ${progressNoteId}`);
    }
    return progressNote;
  }

  static async completeSupervisorReview(progressNoteId: string, txn: Transaction) {
    const updates = await this.query(txn)
      .where({ id: progressNoteId, deletedAt: null, reviewedBySupervisorAt: null })
      .whereNotNull('completedAt')
      .whereNotNull('supervisorNotes')
      .patch({
        reviewedBySupervisorAt: new Date().toISOString(),
      });

    if (!updates) {
      return Promise.reject(
        `Progress note not yet completed or missing supervisor notes: ${progressNoteId}`,
      );
    }
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

  static async autoOpenIfRequired(input: IProgressNoteAutoOpenFields, txn: Transaction) {
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
      return this.query(txn)
        .eager(EAGER_QUERY)
        .insertAndFetch(input);
    }

    return existingProgressNote;
  }

  static async complete(progressNoteId: string, txn: Transaction): Promise<ProgressNote> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(progressNoteId, {
        completedAt: new Date().toISOString(),
      });
  }

  static async delete(progressNoteId: string, txn: Transaction) {
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

  static async getPatientIdForResource(progressNoteId: string, txn: Transaction): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(progressNoteId);

    return result ? result.patientId : '';
  }

  static async getForGlassBreak(progressNoteId: string, txn: Transaction): Promise<ProgressNote> {
    const progressNote = await this.query(txn)
      .eager('[progressNoteTemplate]')
      .findOne({
        id: progressNoteId,
        deletedAt: null,
      });
    if (!progressNote) {
      return Promise.reject(`No such progress note: ${progressNoteId}`);
    }
    return progressNote;
  }

  static async getForUserForPatient(
    userId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<ProgressNote | null> {
    const progressNote = await this.query(txn).findOne({
      userId,
      patientId,
      deletedAt: null,
      completedAt: null,
    });

    if (!progressNote) {
      return null;
    }

    return progressNote;
  }
}
/* tslint:enable:member-ordering */
