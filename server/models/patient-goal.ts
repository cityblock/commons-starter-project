import { omit } from 'lodash';
import { transaction, Model, RelationMappings, Transaction } from 'objection';
import { createTaskForTaskTemplate } from '../lib/create-task-for-task-template';
import BaseModel from './base-model';
import CarePlanUpdateEvent from './care-plan-update-event';
import GoalSuggestionTemplate from './goal-suggestion-template';
import Patient from './patient';
import Task from './task';
import TaskTemplate from './task-template';

interface IPatientGoalEditableFields {
  title: string;
  patientId: string;
  goalSuggestionTemplateId?: string;
  taskTemplateIds?: string[];
  patientConcernId?: string;
  userId: string;
}

export const EAGER_QUERY = '[patient, tasks, goalSuggestionTemplate]';

/* tslint:disable:member-ordering */
export default class PatientGoal extends BaseModel {
  title: string;
  patient: Patient;
  patientId: string;
  goalSuggestionTemplateId?: string;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  patientConcernId?: string;
  tasks: Task[];

  static tableName = 'patient_goal';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      patientId: { type: 'string' },
      goalSuggestionTemplateId: { type: 'string' },
      patientConcernId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_goal.patientId',
        to: 'patient.id',
      },
    },
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: 'task',
      join: {
        from: 'patient_goal.id',
        to: 'task.patientGoalId',
      },
    },
    patientConcern: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-concern',
      join: {
        from: 'patient_goal.patientConcernId',
        to: 'patient_concern.id',
      },
    },
    goalSuggestionTemplate: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'goal-suggestion-template',
      join: {
        from: 'patient_goal.goalSuggestionTemplateId',
        to: 'goal_suggestion_template.id',
      },
    },
  };

  static async get(patientGoalId: string): Promise<PatientGoal> {
    const patientGoal = await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .findOne({ id: patientGoalId, deletedAt: null });

    if (!patientGoal) {
      return Promise.reject(`No such patientGoal: ${patientGoalId}`);
    }
    return patientGoal;
  }

  static async create(input: IPatientGoalEditableFields, existingTxn?: Transaction) {
    const { taskTemplateIds, goalSuggestionTemplateId, userId, patientId } = input;

    return await transaction(PatientGoal.knex(), async txn => {
      let patientGoal: PatientGoal;
      let validTaskTemplates: TaskTemplate[] = [];

      if (!taskTemplateIds || !taskTemplateIds.length || !goalSuggestionTemplateId) {
        patientGoal = await this.query(existingTxn)
          .eager(EAGER_QUERY)
          .insertAndFetch(omit(input, ['userId', 'taskTemplates']));
      } else {
        const goalSuggestionTemplate = await GoalSuggestionTemplate.get(
          goalSuggestionTemplateId,
          existingTxn || txn,
        );
        validTaskTemplates = goalSuggestionTemplate!.taskTemplates.filter(
          taskTemplate => taskTemplateIds.indexOf(taskTemplate.id) > -1,
        );
        patientGoal = await this.query(existingTxn || txn)
          .eager(EAGER_QUERY)
          .insertAndFetch(omit(input, ['userId', 'taskTemplates']));
      }

      await CarePlanUpdateEvent.create(
        {
          patientId,
          userId,
          patientGoalId: patientGoal.id,
          eventType: 'create_patient_goal',
        },
        existingTxn || txn,
      );

      // TODO: do a graph insert here or use the Task resolver. Also note: must use 'map' instead
      //       of 'forEach' as we need to wait for the loop to complete before committing the
      //       transaction below.
      if (validTaskTemplates.length) {
        await Promise.all(
          validTaskTemplates.map(async taskTemplate =>
            createTaskForTaskTemplate(
              taskTemplate,
              userId,
              patientId,
              existingTxn || txn,
              patientGoal.id,
            ),
          ),
        );
      }

      return patientGoal;
    });
  }

  static async update(
    patientGoalId: string,
    patientGoal: Partial<IPatientGoalEditableFields>,
    userId: string,
  ): Promise<PatientGoal> {
    return await transaction(PatientGoal.knex(), async txn => {
      const updatedPatientGoal = await this.query(txn)
        .eager(EAGER_QUERY)
        .updateAndFetchById(patientGoalId, patientGoal);

      await CarePlanUpdateEvent.create(
        {
          patientId: updatedPatientGoal.patientId,
          userId,
          patientGoalId: updatedPatientGoal.id,
          eventType: 'edit_patient_goal',
        },
        txn,
      );

      return updatedPatientGoal;
    });
  }

  static async getForPatient(patientId: string): Promise<PatientGoal[]> {
    return await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('createdAt', 'asc');
  }

  static async delete(patientGoalId: string, userId: string): Promise<PatientGoal> {
    return await transaction(PatientGoal.knex(), async txn => {
      await this.query(txn)
        .where({ id: patientGoalId, deletedAt: null })
        .update({ deletedAt: new Date().toISOString() });

      const patientGoal = await this.query(txn)
        .eager(EAGER_QUERY)
        .modifyEager('tasks', builder => {
          builder.where('task.completedAt', null);
        })
        .findOne({ id: patientGoalId });
      if (!patientGoal) {
        return Promise.reject(`No such patientGoal: ${patientGoalId}`);
      }

      await CarePlanUpdateEvent.create(
        {
          patientId: patientGoal.patientId,
          userId,
          patientGoalId: patientGoal.id,
          eventType: 'delete_patient_goal',
        },
        txn,
      );

      return patientGoal;
    });
  }
}
/* tslint:enable:member-ordering */
