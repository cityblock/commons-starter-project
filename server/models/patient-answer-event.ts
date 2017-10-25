import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import PatientAnswer from './patient-answer';
import User from './user';

type EventTypes = 'create_patient_answer';

interface IPatientAnswerEventOptions {
  patientId: string;
  userId: string;
  patientAnswerId: string;
  previousPatientAnswerId?: string;
  eventType: EventTypes;
}

const EAGER_QUERY = '[patientAnswer.[answer], patient, user]';

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

  static tableName = 'patient_answer_event';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      patientAnswerId: { type: 'string' },
      previousPatientAnswerId: { type: 'string' },
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
  };

  static async get(patientAnswerEventId: string): Promise<PatientAnswerEvent> {
    const patientAnswerEvent = await this.query()
      .eager(EAGER_QUERY)
      .findOne({ id: patientAnswerEventId, deletedAt: null });

    if (!patientAnswerEvent) {
      return Promise.reject(`No such patientAnswerEvent: ${patientAnswerEventId}`);
    }

    return patientAnswerEvent;
  }

  static async create(
    input: IPatientAnswerEventOptions,
    txn?: Transaction,
  ): Promise<PatientAnswerEvent> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insert(input);
  }

  static async delete(patientAnswerEventId: string): Promise<PatientAnswerEvent> {
    await this.query()
      .where({ id: patientAnswerEventId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const patientAnswerEvent = await this.query()
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
  ): Promise<IPaginatedResults<PatientAnswerEvent>> {
    const patientAnswerEvents = (await this.query()
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
  ): Promise<IPaginatedResults<PatientAnswerEvent>> {
    const patientAnswerEvents = (await this.query()
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
  ): Promise<IPaginatedResults<PatientAnswerEvent>> {
    const patientAnswerEvents = (await this.query()
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
