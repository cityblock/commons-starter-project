import { omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { createTaskForTaskTemplate } from '../lib/create-task-for-task-template';
import BaseModel from './base-model';
import CarePlanUpdateEvent from './care-plan-update-event';
import GoalSuggestionTemplate from './goal-suggestion-template';
import Patient from './patient';
import PatientConcern from './patient-concern';
import Task from './task';
import TaskTemplate from './task-template';

interface IPatientGoalEditableFields {
  title?: string;
  patientId: string;
  goalSuggestionTemplateId?: string | null;
  taskTemplateIds?: string[];
  patientConcernId?: string | null;
  userId: string;
}

export const EAGER_QUERY =
  '[patient.[patientInfo], tasks.[createdBy, followers], goalSuggestionTemplate]';

/* tslint:disable:member-ordering */
export default class PatientGoal extends BaseModel {
  title: string;
  patient: Patient;
  patientId: string;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  patientConcernId: string | null;
  patientConcern: PatientConcern | null; // not eager loaded
  tasks: Task[];

  static tableName = 'patient_goal';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      goalSuggestionTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      patientConcernId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'title'],
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

  static async get(patientGoalId: string, txn: Transaction): Promise<PatientGoal> {
    const patientGoal = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('tasks', builder => {
        builder.where('task.completedAt', null);
        builder.where('task.deletedAt', null);
      })
      .findOne({ id: patientGoalId, deletedAt: null });

    if (!patientGoal) {
      return Promise.reject(`No such patientGoal: ${patientGoalId}`);
    }
    return patientGoal;
  }

  static async create(input: IPatientGoalEditableFields, txn: Transaction) {
    const { taskTemplateIds, goalSuggestionTemplateId, userId, patientId, title } = input;

    if (!goalSuggestionTemplateId && !title) {
      return Promise.reject('Must include either goal suggestion template id or title');
    }

    let patientGoal: PatientGoal;
    let validTaskTemplates: TaskTemplate[] = [];

    if (!goalSuggestionTemplateId) {
      patientGoal = await this.query(txn)
        .eager(EAGER_QUERY)
        .insertAndFetch(omit(input, ['userId', 'taskTemplates']));
    } else {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.get(
        goalSuggestionTemplateId,
        txn,
      );

      // set title to be same as goal suggestion template title
      input.title = goalSuggestionTemplate.title;
      validTaskTemplates =
        taskTemplateIds && taskTemplateIds.length
          ? goalSuggestionTemplate.taskTemplates.filter(
              taskTemplate => taskTemplateIds.indexOf(taskTemplate.id) > -1,
            )
          : [];

      patientGoal = await this.query(txn)
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
      txn,
    );

    // TODO: do a graph insert here or use the Task resolver. Also note: must use 'map' instead
    //       of 'forEach' as we need to wait for the loop to complete before committing the
    //       transaction below.
    if (validTaskTemplates.length) {
      await Promise.all(
        validTaskTemplates.map(async taskTemplate =>
          createTaskForTaskTemplate(taskTemplate, userId, patientId, txn, patientGoal.id),
        ),
      );
    }

    return patientGoal;
  }

  static async update(
    patientGoalId: string,
    patientGoal: Partial<IPatientGoalEditableFields>,
    userId: string,
    txn: Transaction,
  ): Promise<PatientGoal> {
    const updatedPatientGoal = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientGoalId, patientGoal);

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
  }

  static async getForPatient(patientId: string, txn: Transaction): Promise<PatientGoal[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('tasks', builder => {
        builder.where('task.completedAt', null);
        builder.where('task.deletedAt', null);
      })
      .modifyEager('tasks.followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('createdAt', 'asc');
  }

  static async delete(
    patientGoalId: string,
    userId: string,
    txn: Transaction,
  ): Promise<PatientGoal> {
    await this.query(txn)
      .where({ id: patientGoalId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

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
  }

  static async getPatientIdForResource(patientGoalId: string, txn: Transaction): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientGoalId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
