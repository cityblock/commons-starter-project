import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import { Priority } from './task';
import { UserRole } from './user';

export type CompletedWithinInterval = 'hour' | 'day' | 'week' | 'month' | 'year';

interface ITaskTemplateEditableFields {
  title: string;
  completedWithinNumber?: number;
  completedWithinInterval?: CompletedWithinInterval;
  repeating: boolean;
  goalSuggestionTemplateId?: string;
  priority: Priority;
  careTeamAssigneeRole: UserRole;
}

/* tslint:disable:member-ordering */
export default class TaskTemplate extends BaseModel {
  title: string;
  completedWithinNumber: number;
  completedWithinInterval: CompletedWithinInterval;
  repeating: boolean;
  goalSuggestionTemplateId?: string;
  priority: Priority;
  careTeamAssigneeRole: UserRole;

  static tableName = 'task_template';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      deletedAt: { type: 'string' },
      completedWithinNumber: { type: 'number' },
      completedWithinInterval: { type: 'string' },
      repeating: { type: 'boolean' },
      goalSuggestionTemplateId: { type: 'string' },
      priority: { type: 'string' },
      careTeamAssigneeRole: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    goalSuggestion: {
      relation: Model.HasOneRelation,
      modelClass: 'goal-suggestion',
      join: {
        from: 'task_template.goalSuggestionId',
        to: 'goal_suggestion.id',
      },
    },
  };

  static async get(taskTemplateId: string, txn?: Transaction): Promise<TaskTemplate> {
    const taskTemplate = await this.query(txn).findOne({ id: taskTemplateId, deletedAt: null });

    if (!taskTemplate) {
      return Promise.reject(`No such taskTemplate: ${taskTemplateId}`);
    }
    return taskTemplate;
  }

  static async create(input: ITaskTemplateEditableFields, txn?: Transaction) {
    return await this.query(txn).insertAndFetch(input);
  }

  static async edit(
    taskTemplateId: string,
    taskTemplate: Partial<ITaskTemplateEditableFields>,
  ): Promise<TaskTemplate> {
    return await this.query().updateAndFetchById(taskTemplateId, taskTemplate);
  }

  // TODO: paginate?
  static async getAll(): Promise<TaskTemplate[]> {
    return await this.query().where('deletedAt', null);
  }

  static async delete(taskTemplateId: string): Promise<TaskTemplate> {
    await this.query()
      .where({ id: taskTemplateId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const taskTemplate = await this.query().findById(taskTemplateId);
    if (!taskTemplate) {
      return Promise.reject(`No such taskTemplate: ${taskTemplateId}`);
    }
    return taskTemplate;
  }
}
/* tslint:enable:member-ordering */
