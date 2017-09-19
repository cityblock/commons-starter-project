import { omit } from 'lodash';
import { transaction, Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { dateAdd } from '../lib/date';
import CareTeam from './care-team';
import GoalSuggestionTemplate from './goal-suggestion-template';
import Patient from './patient';
import Task from './task';
import TaskEvent from './task-event';

export interface IPatientGoalEditableFields {
  title: string;
  patientId: string;
  goalSuggestionTemplateId?: string;
  taskTemplateIds?: string[];
  patientConcernId?: string;
  userId: string;
}

export const EAGER_QUERY = '[patient, tasks, goalSuggestionTemplate]';

/* tslint:disable:member-ordering */
export default class PatientGoal extends Model {
  id: string;
  title: string;
  patient: Patient;
  patientId: string;
  goalSuggestionTemplateId?: string;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  patientConcernId?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'patient_goal';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(patientGoalId: string): Promise<PatientGoal | undefined> {
    const patientGoal = await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('tasks', builder => {
        builder.where('task.completedAt', null);
      })
      .findById(patientGoalId);

    if (!patientGoal) {
      return Promise.reject(`No such patientGoal: ${patientGoalId}`);
    }
    return patientGoal;
  }

  static async create(input: IPatientGoalEditableFields, existingTxn?: Transaction) {
    const { taskTemplateIds, goalSuggestionTemplateId, userId, patientId } = input;

    if (!taskTemplateIds || !taskTemplateIds.length || !goalSuggestionTemplateId) {
      return await this.query(existingTxn)
        .eager(EAGER_QUERY)
        .insertAndFetch(omit(input, ['userId', 'taskTemplates']));
    }

    return await transaction(PatientGoal.knex(), async txn => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.get(
        goalSuggestionTemplateId,
        existingTxn || txn,
      );
      const validTaskTemplates = goalSuggestionTemplate!.taskTemplates.filter(
        taskTemplate => taskTemplateIds.indexOf(taskTemplate.id) > -1,
      );
      const careTeam = await CareTeam.getForPatient(patientId);

      // TODO: do a graph insert here or use the Task resolver. Also note: must use 'map' instead
      //       of 'forEach' as we need to wait for the loop to complete before committing the
      //       transaction below.
      const patientGoal = await this.query(existingTxn || txn)
        .eager(EAGER_QUERY)
        .insertAndFetch(omit(input, ['userId', 'taskTemplates']));

      await Promise.all(
        validTaskTemplates.map(async taskTemplate => {
          const {
            careTeamAssigneeRole,
            completedWithinInterval,
            completedWithinNumber,
          } = taskTemplate;

          let dueAt: string | undefined;
          let assignedToId: string | undefined;

          if (careTeamAssigneeRole) {
            const assignedCareTeamMember = careTeam.find(
              careTeamMember => careTeamMember.userRole === careTeamAssigneeRole,
            );

            if (assignedCareTeamMember) {
              assignedToId = assignedCareTeamMember.id;
            }
          }

          if (completedWithinInterval && completedWithinNumber) {
            dueAt = dateAdd(
              new Date(Date.now()),
              completedWithinNumber,
              completedWithinInterval,
            ).toISOString();
          }

          const task = await Task.create(
            {
              createdById: userId,
              title: taskTemplate.title,
              dueAt,
              patientId,
              assignedToId,
              patientGoalId: patientGoal.id,
            },
            existingTxn || txn,
          );

          await TaskEvent.create(
            {
              taskId: task.id,
              userId,
              eventType: 'create_task',
            },
            existingTxn || txn,
          );

          if (assignedToId) {
            await TaskEvent.create(
              {
                taskId: task.id,
                userId,
                eventType: 'edit_assignee',
                eventUserId: assignedToId,
              },
              existingTxn || txn,
            );
          }
        }),
      );

      return patientGoal;
    });
  }

  static async update(
    patientGoalId: string,
    patientGoal: Partial<IPatientGoalEditableFields>,
  ): Promise<PatientGoal> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientGoalId, patientGoal);
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

  static async delete(patientGoalId: string): Promise<PatientGoal> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientGoalId, {
        deletedAt: new Date().toISOString(),
      });
  }
}
/* tslint:disable:member-ordering */
