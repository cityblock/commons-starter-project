import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';

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

  static async get(goalSuggestionTemplateId: string): Promise<GoalSuggestionTemplate | undefined> {
    const goalSuggestionTemplate = await this.query().findById(goalSuggestionTemplateId);

    if (!goalSuggestionTemplate) {
      return Promise.reject(`No such goalSuggestionTemplate: ${goalSuggestionTemplateId}`);
    }
    return goalSuggestionTemplate;
  }

  static async create(input: IGoalSuggestionTemplateEditableFields, txn?: Transaction) {
    return await this
      .query(txn)
      .insertAndFetch(input);
  }

  static async edit(
    goalSuggestionTemplateId: string,
    goalSuggestionTemplate: Partial<IGoalSuggestionTemplateEditableFields>,
  ): Promise<GoalSuggestionTemplate> {
    return await this
      .query()
      .updateAndFetchById(goalSuggestionTemplateId, goalSuggestionTemplate);
  }

  // TODO: paginate?
  static async getAll(): Promise<GoalSuggestionTemplate[]> {
    return await this.query().where('deletedAt', null);
  }

  static async delete(goalSuggestionTemplateId: string): Promise<GoalSuggestionTemplate> {
    return await this.query()
      .updateAndFetchById(goalSuggestionTemplateId, {
        deletedAt: new Date().toISOString(),
      });
  }
}
/* tslint:disable:member-ordering */
