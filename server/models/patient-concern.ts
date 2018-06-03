import { keys, omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { CarePlanUpdateEventTypes } from 'schema';
import { attributionUserEmail } from '../lib/consts';
import BaseModel from './base-model';
import CarePlanUpdateEvent from './care-plan-update-event';
import Concern from './concern';
import Patient from './patient';
import PatientGoal from './patient-goal';
import User from './user';

interface IPatientConcernEditableFields {
  order?: number;
  concernId: string;
  patientId: string;
  userId: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export const EAGER_QUERY =
  '[patient.[patientInfo, patientState], concern, patientGoals.[patient.[patientInfo, patientState], tasks.[assignedTo, createdBy, followers]]]';

/* tslint:disable:member-ordering */
export default class PatientConcern extends BaseModel {
  order!: number;
  concernId!: string;
  concern!: Concern;
  patientId!: string;
  patientGoals!: PatientGoal[];
  patient!: Patient;
  startedAt!: string | null;
  completedAt!: string | null;

  static tableName = 'patient_concern';

  static hasPHI = true;

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      order: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      concernId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      startedAt: { type: ['string', 'null'] },
      completedAt: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'concernId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.HasOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_concern.patientId',
          to: 'patient.id',
        },
      },
      concern: {
        relation: Model.HasOneRelation,
        modelClass: Concern,
        join: {
          from: 'patient_concern.concernId',
          to: 'concern.id',
        },
      },
      patientGoals: {
        relation: Model.HasManyRelation,
        modelClass: PatientGoal,
        join: {
          from: 'patient_concern.id',
          to: 'patient_goal.patientConcernId',
        },
      },
    };
  }

  static async get(patientConcernId: string, txn: Transaction): Promise<PatientConcern> {
    const patientConcern = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('patientGoals.tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .modifyEager('patientGoals.tasks.followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .findOne({ id: patientConcernId, deletedAt: null });

    if (!patientConcern) {
      return Promise.reject(`No such patient concern: ${patientConcernId}`);
    }
    return patientConcern;
  }

  static async create(input: IPatientConcernEditableFields, txn: Transaction) {
    const insertInput: any = {};

    keys(input).forEach(inputKey => (insertInput[inputKey] = (input as any)[inputKey]));

    insertInput.order = this.query(txn)
      .where('patientId', input.patientId)
      .andWhere('deletedAt', null)
      .select(this.raw('coalesce(max("order"), 0) + 1'));

    const patientConcern = await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(omit(insertInput, ['userId']));

    // Do not create a CarePlanUpdateEvent if this is the attribution user.
    // TODO: maybe just pass down a different variable rather than needing to look up the user?
    const user = await User.get(input.userId, txn);
    if (user.email !== attributionUserEmail) {
      await CarePlanUpdateEvent.create(
        {
          patientId: input.patientId,
          userId: input.userId,
          patientConcernId: patientConcern.id,
          eventType: 'create_patient_concern' as CarePlanUpdateEventTypes,
        },
        txn,
      );
    }

    return patientConcern;
  }

  static async update(
    patientConcernId: string,
    concern: Partial<IPatientConcernEditableFields>,
    userId: string,
    txn: Transaction,
  ): Promise<PatientConcern> {
    const updatedPatientConcern = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientConcernId, concern);

    await CarePlanUpdateEvent.create(
      {
        patientId: updatedPatientConcern.patientId,
        userId,
        patientConcernId: updatedPatientConcern.id,
        eventType: 'edit_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    return updatedPatientConcern;
  }

  static async bulkUpdate(
    patientConcerns: Array<Partial<IPatientConcernEditableFields>>,
    patientId: string,
    txn: Transaction,
  ): Promise<PatientConcern[]> {
    if (patientConcerns.length) {
      await (PatientConcern.query(txn) as any).upsertGraph(patientConcerns, {
        noDelete: true,
      });
    }

    return this.getForPatient(patientId, txn);
  }

  static async getForPatient(patientId: string, txn: Transaction): Promise<PatientConcern[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('patientGoals', builder => {
        builder.where({ deletedAt: null });
      })
      .modifyEager('patientGoals.tasks', builder => {
        builder.where({ 'task.completedAt': null, 'task.deletedAt': null });
      })
      .modifyEager('patientGoals.tasks.followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .where({ patientId, deletedAt: null })
      .orderBy('order');
  }

  static async delete(
    patientConcernId: string,
    userId: string,
    txn: Transaction,
  ): Promise<PatientConcern> {
    await this.query(txn)
      .where({ id: patientConcernId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const patientConcern = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientConcernId);

    if (!patientConcern) {
      return Promise.reject(`No such patientConcern: ${patientConcern}`);
    }

    await CarePlanUpdateEvent.create(
      {
        patientId: patientConcern.patientId,
        userId,
        patientConcernId: patientConcern.id,
        eventType: 'delete_patient_concern' as CarePlanUpdateEventTypes,
      },
      txn,
    );

    return patientConcern;
  }

  static async getPatientIdForResource(
    patientConcernId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientConcernId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
