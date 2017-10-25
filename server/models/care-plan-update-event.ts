import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import PatientConcern from './patient-concern';
import PatientGoal from './patient-goal';
import User from './user';

type EventTypes =
  | 'create_patient_concern'
  | 'edit_patient_concern'
  | 'delete_patient_concern'
  | 'create_patient_goal'
  | 'edit_patient_goal'
  | 'delete_patient_goal';

interface ICarePlanUpdateEventOptions {
  patientId: string;
  userId: string;
  patientConcernId?: string;
  patientGoalId?: string;
  eventType: EventTypes;
}

const EAGER_QUERY = '[patientConcern, patientGoal, patient, user]';

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
  eventType: EventTypes;

  static tableName = 'care_plan_update_event';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      patientConcernId: { type: 'string' },
      patientGoalId: { type: 'string' },
      eventType: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'care_plan_update_event.userId',
        to: 'user.id',
      },
    },

    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'care_plan_update_event.patientId',
        to: 'patient.id',
      },
    },

    patientConcern: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-concern',
      join: {
        from: 'care_plan_update_event.patientConcernId',
        to: 'patient_concern.id',
      },
    },

    patientGoal: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-goal',
      join: {
        from: 'care_plan_update_event.patientGoalId',
        to: 'patient_goal.id',
      },
    },
  };

  static async get(carePlanUpdateEventId: string): Promise<CarePlanUpdateEvent> {
    const carePlanUpdateEvent = await this.query()
      .eager(EAGER_QUERY)
      .findOne({ id: carePlanUpdateEventId, deletedAt: null });

    if (!carePlanUpdateEvent) {
      return Promise.reject(`No such carePlanUpdateEvent: ${carePlanUpdateEventId}`);
    }

    return carePlanUpdateEvent;
  }

  static async create(
    input: ICarePlanUpdateEventOptions,
    txn?: Transaction,
  ): Promise<CarePlanUpdateEvent> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insert(input);
  }

  static async delete(carePlanUpdateEventId: string): Promise<CarePlanUpdateEvent> {
    await this.query()
      .where({ id: carePlanUpdateEventId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const carePlanUpdateEvent = await this.query()
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
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query()
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
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query()
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
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query()
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
  ): Promise<IPaginatedResults<CarePlanUpdateEvent>> {
    const carePlanUpdateEvents = (await this.query()
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
