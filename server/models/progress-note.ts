import { Model, RelationMappings } from 'objection';
import BaseModel from './base-model';

interface IProgressNoteEditableFields {
  patientId: string;
  userId: string;
  progressNoteTemplateId: string;
}

/* tslint:disable:member-ordering */
export default class ProgressNote extends BaseModel {
  patientId: string;
  userId: string;
  progressNoteTemplateId: string;
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
      completedAt: { type: 'string' },
      deletedAt: { type: 'string ' },
    },
  };

  static relationalMappings: RelationMappings = {
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
      modelClass: 'progress-note',
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

  static async get(progressNoteId: string): Promise<ProgressNote> {
    const progressNote = await this.query().findOne({
      id: progressNoteId,
      deletedAt: null,
    });
    if (!progressNote) {
      return Promise.reject(`No such progress note: ${progressNoteId}`);
    }
    return progressNote;
  }

  static async getAllForPatient(patientId: string): Promise<ProgressNote[]> {
    return this.query()
      .orderBy('createdAt', 'asc')
      .where({ deletedAt: null, patientId });
  }

  static async create(input: IProgressNoteEditableFields) {
    return this.query().insertAndFetch(input);
  }

  static async complete(progressNoteId: string): Promise<ProgressNote> {
    return await this.query().updateAndFetchById(progressNoteId, {
      completedAt: new Date().toISOString(),
    });
  }

  static async delete(progressNoteId: string) {
    await this.query()
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