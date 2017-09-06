import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Question from './question';

export interface IAnswerEditableFields {
  displayValue: string;
  value: string;
  valueType: ValueTypeOptions;
  riskAdjustmentType?: RiskAdjustmentType;
  inSummary?: boolean;
  summaryText?: string;
  order: number;
}

export interface IAnswerCreateFields extends IAnswerEditableFields {
  questionId: string;
}

export type ValueTypeOptions = 'string' | 'boolean' | 'number';
export type RiskAdjustmentType = 'inactive' | 'increment' | 'forceHighRisk';

const EAGER_QUERY = '[concernSuggestions, goalSuggestions]';

/* tslint:disable:member-ordering */
export default class Answer extends Model {
  id: string;
  displayValue: string;
  value: string;
  valueType: ValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentType;
  inSummary: boolean;
  summaryText?: string;
  question: Question;
  questionId: string;
  order: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'answer';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      displayValue: { type: 'string' },
      value: { type: 'string' },
      valueType: { type: 'string' },
      riskAdjustmentType: { type: 'string' },
      inSummary: { type: 'boolean' },
      summaryText: { type: 'string' },
      questionId: { type: 'string' },
      order: { type: 'integer' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    question: {
      relation: Model.HasOneRelation,
      modelClass: 'question',
      join: {
        from: 'answer.questionId',
        to: 'question.id',
      },
    },
    concernSuggestions: {
      relation: Model.ManyToManyRelation,
      modelClass: 'concern',
      join: {
        from: 'answer.id',
        through: {
          from: 'concern_suggestion.answerId',
          to: 'concern_suggestion.concernId',
        },
        to: 'concern.id',
      },
    },
    goalSuggestions: {
      relation: Model.ManyToManyRelation,
      modelClass: 'goal-suggestion-template',
      join: {
        from: 'answer.id',
        through: {
          from: 'goal_suggestion.answerId',
          to: 'goal_suggestion.goalSuggestionTemplateId',
        },
        to: 'goal_suggestion_template.id',
      },
    },
    concerns: {
      relation: Model.ManyToManyRelation,
      modelClass: 'concern',
      join: {
        from: 'answer.id',
        through: {
          from: 'concern_suggestion.answerId',
          to: 'concern_suggestion.concernId',
        },
        to: 'concern.id',
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

  static async get(answerId: string): Promise<Answer> {
    const answer = await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('goalSuggestions', builder => builder.where('goal_suggestion.deletedAt', null))
      .findById(answerId);

    if (!answer) {
      return Promise.reject(`No such answer: ${answerId}`);
    }
    return answer;
  }

  static async getAllForQuestion(questionId: string): Promise<Answer[]> {
    return this.query()
      .where({ questionId, deletedAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('goalSuggestions', builder => builder.where('goal_suggestion.deletedAt', null))
      .orderBy('order');
  }

  static async create(input: IAnswerCreateFields) {
    return this.query()
      .eager(EAGER_QUERY)
      .modifyEager('concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('goalSuggestions', builder => builder.where('goal_suggestion.deletedAt', null))
      .insertAndFetch(input);
  }

  static async edit(answer: Partial<IAnswerEditableFields>, answerId: string): Promise<Answer> {
    return await this.query()
      .eager('[concernSuggestions, goalSuggestions]')
      .modifyEager('concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('goalSuggestions', builder => builder.where('goal_suggestion.deletedAt', null))
      .updateAndFetchById(answerId, answer);
  }

  static async delete(answerId: string): Promise<Answer> {
    return await this.query().updateAndFetchById(answerId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
