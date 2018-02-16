import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import { Priority, PRIORITY } from './task';
import { UserRole, USER_ROLE } from './user';

export type CompletedWithinInterval = 'hour' | 'day' | 'week' | 'month' | 'year';

interface ITaskTemplateEditableFields {
  title: string;
  completedWithinNumber?: number;
  completedWithinInterval?: CompletedWithinInterval;
  repeating: boolean;
  goalSuggestionTemplateId?: string;
  priority: Priority;
  careTeamAssigneeRole: UserRole;
  CBOCategoryId?: string | null;
}

/* tslint:disable:member-ordering */
export default class TaskTemplate extends BaseModel {
  title: string;
  completedWithinNumber: number | null;
  completedWithinInterval: CompletedWithinInterval | null;
  repeating: boolean | null;
  goalSuggestionTemplateId: string;
  priority: Priority | null;
  careTeamAssigneeRole: UserRole | null;
  CBOCategoryId: string | null;

  static tableName = 'task_template';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      completedWithinNumber: { type: 'number', minimum: 1 }, // cannot be zero or negative
      completedWithinInterval: { type: 'string', enum: ['hour', 'day', 'week', 'month', 'year'] },
      repeating: { type: 'boolean' },
      goalSuggestionTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      priority: { type: 'string', enum: PRIORITY },
      careTeamAssigneeRole: { type: 'string', enum: USER_ROLE },
      CBOCategoryId: { type: 'string', format: 'uuid' },
    },
    // TODO: make goalSuggestionTemplateId required?
    required: ['title'],
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

  static async get(taskTemplateId: string, txn: Transaction): Promise<TaskTemplate> {
    const taskTemplate = await this.query(txn).findOne({ id: taskTemplateId, deletedAt: null });

    if (!taskTemplate) {
      return Promise.reject(`No such taskTemplate: ${taskTemplateId}`);
    }
    return taskTemplate;
  }

  static async create(input: ITaskTemplateEditableFields, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    taskTemplateId: string,
    taskTemplate: Partial<ITaskTemplateEditableFields>,
    txn: Transaction,
  ): Promise<TaskTemplate> {
    return this.query(txn).patchAndFetchById(taskTemplateId, taskTemplate);
  }

  // TODO: paginate?
  static async getAll(txn: Transaction): Promise<TaskTemplate[]> {
    return this.query(txn).where('deletedAt', null);
  }

  static async delete(taskTemplateId: string, txn: Transaction): Promise<TaskTemplate> {
    await this.query(txn)
      .where({ id: taskTemplateId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const taskTemplate = await this.query(txn).findById(taskTemplateId);
    if (!taskTemplate) {
      return Promise.reject(`No such taskTemplate: ${taskTemplateId}`);
    }
    return taskTemplate;
  }
}
/* tslint:enable:member-ordering */
