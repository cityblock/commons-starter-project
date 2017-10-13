import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import { Priority } from './task';
import { UserRole } from './user';

export type CompletedWithinInterval = 'hour' | 'day' | 'week' | 'month' | 'year';

export interface ITaskTemplateEditableFields {
  title: string;
  completedWithinNumber?: number;
  completedWithinInterval?: CompletedWithinInterval;
  repeating: boolean;
  goalSuggestionTemplateId: string;
  priority: Priority;
  careTeamAssigneeRole: UserRole;
}

/* tslint:disable:member-ordering */
export default class TaskTemplate extends Model {
  id: string;
  title: string;
  completedWithinNumber: number;
  completedWithinInterval: CompletedWithinInterval;
  repeating: boolean;
  goalSuggestionTemplateId: string;
  priority: Priority;
  careTeamAssigneeRole: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'task_template';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(taskTemplateId: string): Promise<TaskTemplate> {
    const taskTemplate = await this.query().findOne({ id: taskTemplateId, deletedAt: null });

    if (!taskTemplate) {
      return Promise.reject(`No such taskTemplate: ${taskTemplateId}`);
    }
    return taskTemplate;
  }

  static async create(input: ITaskTemplateEditableFields) {
    return await this.query().insertAndFetch(input);
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
/* tslint:disable:member-ordering */
