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

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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
    txn?: Transaction,
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

  static async create(input: IGoalSuggestionTemplateEditableFields, txn?: Transaction) {
    return await this.query(txn)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .insertAndFetch(input);
  }

  static async edit(
    goalSuggestionTemplateId: string,
    goalSuggestionTemplate: Partial<IGoalSuggestionTemplateEditableFields>,
  ): Promise<GoalSuggestionTemplate> {
    return await this.query()
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .updateAndFetchById(goalSuggestionTemplateId, goalSuggestionTemplate);
  }

  static async getAll({
    orderBy,
    order,
  }: IGoalSuggestionTemplateOrderOptions): Promise<GoalSuggestionTemplate[]> {
    return await this.query()
      .where('deletedAt', null)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .orderBy(orderBy, order);
  }

  static async delete(goalSuggestionTemplateId: string): Promise<GoalSuggestionTemplate> {
    await this.query()
      .where({ id: goalSuggestionTemplateId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const goalSuggestion = await this.query().findById(goalSuggestionTemplateId);
    if (!goalSuggestion) {
      return Promise.reject(`No such goalSuggestionTemplate: ${goalSuggestionTemplateId}`);
    }
    return goalSuggestion;
  }
}
/* tslint:enable:member-ordering */
