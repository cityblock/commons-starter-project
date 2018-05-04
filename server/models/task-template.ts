import { Model, RelationMappings, Transaction } from 'objection';
import { CompletedWithinInterval, Priority, UserRole } from 'schema';
import BaseModel from './base-model';
import GoalSuggestion from './goal-suggestion';
import { PRIORITY } from './task';
import { USER_ROLE } from './user';

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
      completedWithinInterval: {
        type: 'string',
        enum: ['hour', 'day', 'week' as CompletedWithinInterval, 'month', 'year'],
      },
      repeating: { type: 'boolean' },
      goalSuggestionTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      priority: { type: 'string', enum: PRIORITY },
      careTeamAssigneeRole: { type: 'string', enum: USER_ROLE },
      CBOCategoryId: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
    },
    // TODO: make goalSuggestionTemplateId required?
    required: ['title'],
  };

  static get relationMappings(): RelationMappings {
    return {
      goalSuggestion: {
        relation: Model.HasOneRelation,
        modelClass: GoalSuggestion,
        join: {
          from: 'task_template.goalSuggestionId',
          to: 'goal_suggestion.id',
        },
      },
    };
  }

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
