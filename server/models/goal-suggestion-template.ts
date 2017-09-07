import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import TaskTemplate from './task-template';

export interface IGoalSuggestionTemplateEditableFields {
  title: string;
}

/* tslint:disable:member-ordering */
export default class GoalSuggestionTemplate extends Model {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  taskTemplates: TaskTemplate[];

  static tableName = 'goal_suggestion_template';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(
    goalSuggestionTemplateId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate | undefined> {
    const goalSuggestionTemplate = await this.query(txn)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null))
      .findById(goalSuggestionTemplateId);

    if (!goalSuggestionTemplate) {
      return Promise.reject(`No such goalSuggestionTemplate: ${goalSuggestionTemplateId}`);
    }
    return goalSuggestionTemplate;
  }

  static async create(input: IGoalSuggestionTemplateEditableFields) {
    return await this.query()
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

  // TODO: paginate?
  static async getAll(): Promise<GoalSuggestionTemplate[]> {
    return await this.query()
      .where('deletedAt', null)
      .eager('taskTemplates')
      .modifyEager('taskTemplates', builder => builder.where('deletedAt', null));
  }

  static async delete(goalSuggestionTemplateId: string): Promise<GoalSuggestionTemplate> {
    return await this.query().updateAndFetchById(goalSuggestionTemplateId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
