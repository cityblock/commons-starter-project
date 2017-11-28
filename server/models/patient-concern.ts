import { keys, omit } from 'lodash';
import { transaction, Model, RelationMappings, Transaction } from 'objection';
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
  '[patient, concern, patientGoals.[patient, tasks.[assignedTo, followers]]]';

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
      order: { type: 'integer' },
      patientId: { type: 'string' },
      concernId: { type: 'string' },
      deletedAt: { type: 'string' },
      startedAt: { type: 'string | null' },
      completedAt: { type: 'string | null' },
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

  static async create(input: IPatientConcernEditableFields, existingTxn?: Transaction) {
    const insertInput: any = {};

    keys(input).forEach(inputKey => (insertInput[inputKey] = (input as any)[inputKey]));

    return await transaction(PatientConcern.knex(), async txn => {
      insertInput.order = this.query(existingTxn || txn)
        .where('patientId', input.patientId)
        .andWhere('deletedAt', null)
        .select(this.raw('coalesce(max("order"), 0) + 1'));

      const patientConcern = await this.query(existingTxn || txn)
        .eager(EAGER_QUERY)
        .insertAndFetch(omit(insertInput, ['userId']));

      await CarePlanUpdateEvent.create(
        {
          patientId: input.patientId,
          userId: input.userId,
          patientConcernId: patientConcern.id,
          eventType: 'create_patient_concern',
        },
        existingTxn || txn,
      );

      return patientConcern;
    });
  }

  static async update(
    patientConcernId: string,
    concern: Partial<IPatientConcernEditableFields>,
    userId: string,
  ): Promise<PatientConcern> {
    return await transaction(PatientConcern.knex(), async txn => {
      const updatedPatientConcern = await this.query(txn)
        .eager(EAGER_QUERY)
        .updateAndFetchById(patientConcernId, concern);

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
    });
  }

  static async bulkUpdate(
    patientConcerns: Array<Partial<IPatientConcernEditableFields>>,
    patientId: string,
    existingTxn?: Transaction,
  ): Promise<PatientConcern[]> {
    return await transaction(existingTxn || PatientConcern.knex(), async txn => {
      if (patientConcerns.length) {
        await (PatientConcern.query(txn) as any).upsertGraph(patientConcerns, {
          noDelete: true,
        });
      }

      return await this.getForPatient(patientId, txn);
    });
  }

  static async getForPatient(patientId: string, txn?: Transaction): Promise<PatientConcern[]> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('patientGoals.tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('order');
  }

  static async delete(patientConcernId: string, userId: string): Promise<PatientConcern> {
    return await transaction(PatientConcern.knex(), async txn => {
      await this.query(txn)
        .where({ id: patientConcernId, deletedAt: null })
        .update({ deletedAt: new Date().toISOString() });

      const patientConcern = await this.query(txn).findById(patientConcernId);
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
    });
  }
}
/* tslint:enable:member-ordering */
