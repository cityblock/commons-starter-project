import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import ProgressNoteTemplate from './progress-note-template';

interface IProgressNoteEditableFields {
  patientId: string;
  startedAt?: string;
  location?: string;
  userId: string;
  progressNoteTemplateId: string;
}

interface IProgressNoteAutoOpenFields {
  patientId: string;
  userId: string;
}

const EAGER_QUERY = '[progressNoteTemplate, user]';

/* tslint:disable:member-ordering */
export default class ProgressNote extends BaseModel {
  patientId: string;
  userId: string;
  progressNoteTemplateId?: string;
  progressNoteTemplate?: ProgressNoteTemplate;
  location: string;
  startedAt: string;
  completedAt: string;

  static tableName = 'progress_note';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      progressNoteTemplateId: { type: 'string' },
      startedAt: { type: 'string' },
      location: { type: 'string' },
      completedAt: { type: 'string' },
      deletedAt: { type: 'string ' },
    },
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

  static async getAllForPatient(patientId: string, completed: boolean): Promise<ProgressNote[]> {
    const query = this.query()
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

  static async create(input: IProgressNoteEditableFields) {
    return this.query()
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async update(progressNoteId: string, progressNote: Partial<IProgressNoteEditableFields>) {
    return this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(progressNoteId, progressNote);
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

  static async complete(progressNoteId: string): Promise<ProgressNote> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(progressNoteId, {
        completedAt: new Date().toISOString(),
      });
  }

  static async delete(progressNoteId: string) {
    await this.query()
      .eager(EAGER_QUERY)
      .where({ id: progressNoteId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const progressNote = await this.query().findById(progressNoteId);

    if (!progressNote) {
      return Promise.reject(`No such progress note: ${progressNoteId}`);
    }
    return progressNote;
  }
}
/* tslint:enable:member-ordering */
