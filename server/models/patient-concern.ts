import { keys } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Concern from './concern';
import Patient from './patient';
import PatientGoal from './patient-goal';

interface IPatientConcernEditableFields {
  order?: number;
  concernId: string;
  patientId: string;
  startedAt?: string;
  completedAt?: string;
}

export const EAGER_QUERY =
  '[patient, concern, patientGoals.[patient, tasks.[assignedTo, followers]]]';

/* tslint:disable:member-ordering */
export default class PatientConcern extends BaseModel {
  order: number;
  concernId: string;
  concern: Concern;
  patientId: string;
  patientGoals: PatientGoal[];
  patient: Patient;
  startedAt: string;
  completedAt: string;

  static tableName = 'patient_concern';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      order: { type: 'integer' },
      patientId: { type: 'string' },
      concernId: { type: 'string' },
      deletedAt: { type: 'string' },
      startedAt: { type: 'string' },
      completedAt: { type: 'string' },
    },
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

  static async get(patientConcernId: string): Promise<PatientConcern> {
    const patientConcern = await this.query()
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

  static async create(input: IPatientConcernEditableFields, txn?: Transaction) {
    const insertInput: any = {};

    keys(input).forEach(inputKey => (insertInput[inputKey] = (input as any)[inputKey]));

    insertInput.order = this.query(txn)
      .where('patientId', input.patientId)
      .andWhere('deletedAt', null)
      .select(this.raw('coalesce(max("order"), 0) + 1'));

    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(insertInput);
  }

  static async update(
    patientConcernId: string,
    concern: Partial<IPatientConcernEditableFields>,
  ): Promise<PatientConcern> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientConcernId, concern);
  }

  static async getForPatient(patientId: string): Promise<PatientConcern[]> {
    return await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('patientGoals.tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('order');
  }

  static async delete(patientConcernId: string): Promise<PatientConcern> {
    await this.query()
      .where({ id: patientConcernId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const patientConcern = await this.query().findById(patientConcernId);
    if (!patientConcern) {
      return Promise.reject(`No such patientConcern: ${patientConcern}`);
    }
    return patientConcern;
  }
}
/* tslint:enable:member-ordering */
