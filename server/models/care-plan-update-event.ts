import { Model, RelationMappings, Transaction } from 'objection';
import { CarePlanUpdateEventTypes } from 'schema';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import PatientConcern from './patient-concern';
import PatientGoal from './patient-goal';
import ProgressNote from './progress-note';
import User from './user';

interface ICarePlanUpdateEventOptions {
  patientId: string;
  userId: string;
  patientConcernId?: string;
  patientGoalId?: string;
  eventType: CarePlanUpdateEventTypes;
  progressNoteId?: string;
}

const EAGER_QUERY = `[
    patientConcern.[concern, patient.[patientInfo, patientState]],
    patientGoal.[patient.[patientInfo, patientState], tasks.[createdBy, assignedTo, patient, completedBy, followers]],
    patient.[patientInfo, patientState], user
  ]`;

/* tslint:disable:member-ordering */
export default class CarePlanUpdateEvent extends BaseModel {
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  patientConcernId: string;
  patientConcern: PatientConcern;
  patientGoalId: string;
  patientGoal: PatientGoal;
  eventType: CarePlanUpdateEventTypes;
  progressNoteId: string;
  progressNote: ProgressNote;

  static tableName = 'care_plan_update_event';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      patientConcernId: { type: 'string' },
      patientGoalId: { type: 'string' },
      progressNoteId: { type: 'string' },
      eventType: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'userId', 'eventType'],
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'care_plan_update_event.userId',
          to: 'user.id',
        },
      },

      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'care_plan_update_event.patientId',
          to: 'patient.id',
        },
      },

      patientConcern: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientConcern,
        join: {
          from: 'care_plan_update_event.patientConcernId',
          to: 'patient_concern.id',
        },
      },

      patientGoal: {
        relation: Model.BelongsToOneRelation,
        modelClass: PatientGoal,
        join: {
          from: 'care_plan_update_event.patientGoalId',
          to: 'patient_goal.id',
        },
      },

      progressNote: {
        relation: Model.BelongsToOneRelation,
        modelClass: ProgressNote,
        join: {
          from: 'care_plan_update_event.progressNoteId',
          to: 'progress_note.id',
        },
      },
    };
  }

  static async get(carePlanUpdateEventId: string, txn: Transaction): Promise<CarePlanUpdateEvent> {
    const carePlanUpdateEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: carePlanUpdateEventId, deletedAt: null });

    if (!carePlanUpdateEvent) {
      return Promise.reject(`No such carePlanUpdateEvent: ${carePlanUpdateEventId}`);
    }

    return carePlanUpdateEvent;
  }

  static async getAllForProgressNote(
    progressNoteId: string,
    txn: Transaction,
  ): Promise<CarePlanUpdateEvent[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ progressNoteId, deletedAt: null });
  }

  static async create(
    input: ICarePlanUpdateEventOptions,
    txn: Transaction,
  ): Promise<CarePlanUpdateEvent> {
    const { patientId, userId } = input;

    const progressNote = await ProgressNote.autoOpenIfRequired({ patientId, userId }, txn);
    input.progressNoteId = progressNote.id;

    const carePlanUpdateEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .insert(input);

    return carePlanUpdateEvent;
  }

  static async delete(
    carePlanUpdateEventId: string,
    txn: Transaction,
  ): Promise<CarePlanUpdateEvent> {
    await this.query(txn)
      .where({ id: carePlanUpdateEventId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const carePlanUpdateEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(carePlanUpdateEventId);

    if (!carePlanUpdateEvent) {
      return Promise.reject(`No such carePlanUpdateEvent: ${carePlanUpdateEvent}`);
    }

    return carePlanUpdateEvent;
  }

  static async getAllForPatientConcern(
    patientConcernId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientConcernId, deletedAt: null })
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: carePlanUpdateEvents.results,
      total: carePlanUpdateEvents.total,
    };
  }

  static async getAllForPatientGoal(
    patientGoalId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientGoalId, deletedAt: null })
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: carePlanUpdateEvents.results,
      total: carePlanUpdateEvents.total,
    };
  }

  static async getAllForPatient(
    patientId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, deletedAt: null })
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: carePlanUpdateEvents.results,
      total: carePlanUpdateEvents.total,
    };
  }

  static async getAllForUser(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ userId, deletedAt: null })
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: carePlanUpdateEvents.results,
      total: carePlanUpdateEvents.total,
    };
  }
}
/* tslint:enable:member-ordering */
