import { keys, omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import CarePlanUpdateEvent from './care-plan-update-event';
import Concern from './concern';
import Patient from './patient';
import PatientGoal from './patient-goal';

interface IPatientConcernEditableFields {
  order?: number;
  concernId: string;
  patientId: string;
  userId: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export const EAGER_QUERY =
  '[patient, concern, patientGoals.[patient, tasks.[assignedTo, createdBy, followers]]]';

/* tslint:disable:member-ordering */
export default class PatientConcern extends BaseModel {
  order: number;
  concernId: string;
  concern: Concern;
  patientId: string;
  patientGoals: PatientGoal[];
  patient: Patient;
  startedAt: string | null;
  completedAt: string | null;

  static tableName = 'patient_concern';

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
      startedAt: { type: 'string | null' },
      completedAt: { type: 'string | null' },
    },
    required: ['patientId', 'concernId'],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_concern.patientId',
        to: 'patient.id',
      },
    },
    concern: {
      relation: Model.HasOneRelation,
      modelClass: 'concern',
      join: {
        from: 'patient_concern.concernId',
        to: 'concern.id',
      },
    },
    patientGoals: {
      relation: Model.HasManyRelation,
      modelClass: 'patient-goal',
      join: {
        from: 'patient_concern.id',
        to: 'patient_goal.patientConcernId',
      },
    },
  };

  static async get(patientConcernId: string, txn: Transaction): Promise<PatientConcern> {
    const patientConcern = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('patientGoals.tasks', builder => {
        builder.where('task.completedAt', null);
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

    await CarePlanUpdateEvent.create(
      {
        patientId: input.patientId,
        userId: input.userId,
        patientConcernId: patientConcern.id,
        eventType: 'create_patient_concern',
      },
      txn,
    );

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
        eventType: 'edit_patient_concern',
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

    return await this.getForPatient(patientId, txn);
  }

  static async getForPatient(patientId: string, txn: Transaction): Promise<PatientConcern[]> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('patientGoals', builder => {
        builder.where('deletedAt', null);
      })
      .modifyEager('patientGoals.tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
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
        eventType: 'delete_patient_concern',
      },
      txn,
    );

    return patientConcern;
  }
}
/* tslint:enable:member-ordering */
