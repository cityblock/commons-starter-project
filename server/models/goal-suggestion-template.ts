import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import TaskTemplate from './task-template';

interface IGoalSuggestionTemplateEditableFields {
  title: string;
}

export type GoalSuggestionTemplateOrderOptions = 'createdAt' | 'title' | 'updatedAt';

interface IGoalSuggestionTemplateOrderOptions {
  orderBy: GoalSuggestionTemplateOrderOptions;
  order: 'asc' | 'desc';
}

/* tslint:disable:member-ordering */
export default class GoalSuggestionTemplate extends BaseModel {
  title: string;
  taskTemplates: TaskTemplate[];

  static tableName = 'goal_suggestion_template';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['title'],
  };

  static relationMappings: RelationMappings = {
    taskTemplates: {
      relation: Model.HasManyRelation,
      modelClass: 'task-template',
      join: {
        from: 'task_template.goalSuggestionTemplateId',
        to: 'goal_suggestion_template.id',
      },
    },
  };

  static async get(
    goalSuggestionTemplateId: string,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate> {
    const goalSuggestionTemplate = await this.query(txn)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .findOne({ id: goalSuggestionTemplateId, deletedAt: null });

    if (!goalSuggestionTemplate) {
      return Promise.reject(`No such goalSuggestionTemplate: ${goalSuggestionTemplateId}`);
    }
    return goalSuggestionTemplate;
  }

  static async create(input: IGoalSuggestionTemplateEditableFields, txn: Transaction) {
    return this.query(txn)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .insertAndFetch(input);
  }

  static async edit(
    goalSuggestionTemplateId: string,
    goalSuggestionTemplate: Partial<IGoalSuggestionTemplateEditableFields>,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate> {
    return this.query(txn)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .patchAndFetchById(goalSuggestionTemplateId, goalSuggestionTemplate);
  }

  static async getAll(
    { orderBy, order }: IGoalSuggestionTemplateOrderOptions,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    return this.query(txn)
      .where('deletedAt', null)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .orderBy(orderBy, order);
  }

  static async delete(
    goalSuggestionTemplateId: string,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate> {
    await this.query(txn)
      .where({ id: goalSuggestionTemplateId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const goalSuggestion = await this.query(txn).findById(goalSuggestionTemplateId);
    if (!goalSuggestion) {
      return Promise.reject(`No such goalSuggestionTemplate: ${goalSuggestionTemplateId}`);
    }
    return goalSuggestion;
  }
}
/* tslint:enable:member-ordering */
