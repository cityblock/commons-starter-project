import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import PatientAnswer from './patient-answer';
import ProgressNote from './progress-note';
import User from './user';

type EventTypes = 'create_patient_answer';

export interface IPatientAnswerEventOptions {
  patientId: string;
  userId?: string;
  patientAnswerId: string;
  previousPatientAnswerId?: string;
  eventType: EventTypes;
  progressNoteId?: string;
  computedFieldId?: string;
}

interface IMultiplePatientAnswerEventOptions {
  patientAnswerEvents: IPatientAnswerEventOptions[];
}

/* tslint:disable:max-line-length */
const EAGER_QUERY =
  '[patientAnswer.[answer.[riskArea, screeningTool.[riskArea]], question], previousPatientAnswer.[answer.[riskArea, screeningTool.[riskArea]]], patient, user]';
/* tslint:enable:max-line-length */

/* tslint:disable:member-ordering */
export default class PatientAnswerEvent extends BaseModel {
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  patientAnswerId: string;
  patientAnswer: PatientAnswer;
  previousPatientAnswerId: string;
  previousPatientAnswser: PatientAnswer;
  eventType: EventTypes;
  progressNoteId: string;
  progressNote: ProgressNote;

  static tableName = 'patient_answer_event';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      patientAnswerId: { type: 'string' },
      previousPatientAnswerId: { type: 'string' },
      progressNoteId: { type: 'string' },
      eventType: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_answer_event.userId',
        to: 'user.id',
      },
    },

    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_answer_event.patientId',
        to: 'patient.id',
      },
    },

    patientAnswer: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-answer',
      join: {
        from: 'patient_answer_event.patientAnswerId',
        to: 'patient_answer.id',
      },
    },

    previousPatientAnswer: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-answer',
      join: {
        from: 'patient_answer_event.previousPatientAnswerId',
        to: 'patient_answer.id',
      },
    },

    progressNote: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'progress-note',
      join: {
        from: 'patient_answer_event.progressNoteId',
        to: 'progress_note.id',
      },
    },
  };

  static async get(patientAnswerEventId: string, txn?: Transaction): Promise<PatientAnswerEvent> {
    const patientAnswerEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: patientAnswerEventId, deletedAt: null });

    if (!patientAnswerEvent) {
      return Promise.reject(`No such patientAnswerEvent: ${patientAnswerEventId}`);
    }

    return patientAnswerEvent;
  }

  static async getAllForProgressNote(
    progressNoteId: string,
    txn?: Transaction,
  ): Promise<PatientAnswerEvent[]> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ progressNoteId, deletedAt: null });
  }

  static async create(
    input: IPatientAnswerEventOptions,
    txn?: Transaction,
  ): Promise<PatientAnswerEvent> {
    const { patientId, userId, computedFieldId } = input;

    // Only auto-open a ProgressNote if this is not a ComputedField answer
    if (patientId && userId && !computedFieldId) {
      const progressNote = await ProgressNote.autoOpenIfRequired({ patientId, userId }, txn);
      input.progressNoteId = progressNote.id;
    }

    const patientAnswerEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .insert(input);

    return patientAnswerEvent;
  }

  static async createMultiple(
    input: IMultiplePatientAnswerEventOptions,
    txn: Transaction,
  ): Promise<PatientAnswerEvent[]> {
    const { patientAnswerEvents } = input;
    const { patientId, userId, computedFieldId } = patientAnswerEvents[0];

    let patientAnswerEventsToInsert: IPatientAnswerEventOptions[] = patientAnswerEvents;

    // Only auto-open a ProgressNote if this is not for ComputedField answers
    if (patientId && userId && !computedFieldId) {
      const progressNote = await ProgressNote.autoOpenIfRequired({ patientId, userId }, txn);
      patientAnswerEventsToInsert = patientAnswerEvents.map(patientAnswerEvent => ({
        progressNoteId: progressNote.id,
        ...patientAnswerEvent,
      }));
    } else {
      patientAnswerEventsToInsert = patientAnswerEvents;
    }

    const createdPatientAnswerEvents = await this.query(txn)
      .eager(EAGER_QUERY)
      .insertGraphAndFetch(patientAnswerEventsToInsert);

    return createdPatientAnswerEvents;
  }

  static async delete(
    patientAnswerEventId: string,
    txn?: Transaction,
  ): Promise<PatientAnswerEvent> {
    await this.query(txn)
      .where({ id: patientAnswerEventId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const patientAnswerEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientAnswerEventId);

    if (!patientAnswerEvent) {
      return Promise.reject(`No such patientAnswerEvent: ${patientAnswerEvent}`);
    }

    return patientAnswerEvent;
  }

  static async getAllForAnswer(
    answerId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn?: Transaction,
  ): Promise<IPaginatedResults<PatientAnswerEvent>> {
    const patientAnswerEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .joinRelation('patientAnswer')
      .where('patientAnswer.answerId', answerId)
      .andWhere('patient_answer_event.deletedAt', null)
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: patientAnswerEvents.results,
      total: patientAnswerEvents.total,
    };
  }

  static async getAllForPatient(
    patientId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn?: Transaction,
  ): Promise<IPaginatedResults<PatientAnswerEvent>> {
    const patientAnswerEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, deletedAt: null })
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: patientAnswerEvents.results,
      total: patientAnswerEvents.total,
    };
  }

  static async getAllForUser(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn?: Transaction,
  ): Promise<IPaginatedResults<PatientAnswerEvent>> {
    const patientAnswerEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ userId, deletedAt: null })
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: patientAnswerEvents.results,
      total: patientAnswerEvents.total,
    };
  }
}
/* tslint:enable:member-ordering */
