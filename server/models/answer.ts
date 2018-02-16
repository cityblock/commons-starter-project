import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Concern from './concern';
import GoalSuggestionTemplate from './goal-suggestion-template';
import PatientAnswer from './patient-answer';
import Question from './question';
import RiskArea from './risk-area';
import ScreeningTool from './screening-tool';

interface IAnswerEditableFields {
  displayValue: string;
  value: string;
  valueType: ValueTypeOptions;
  riskAdjustmentType?: RiskAdjustmentType | null;
  inSummary?: boolean | null;
  summaryText?: string | null;
  order: number;
}

interface IAnswerCreateFields extends IAnswerEditableFields {
  questionId: string;
}

interface IGetByComputedFieldSlugAndValueOptions {
  slug: string;
  value: string | boolean | number;
}

type ValueTypeOptions = 'string' | 'boolean' | 'number';
type RiskAdjustmentType = 'inactive' | 'increment' | 'forceHighRisk';

const EAGER_QUERY = '[concernSuggestions, goalSuggestions.[taskTemplates]]';

/* tslint:disable:member-ordering */
export default class Answer extends BaseModel {
  id: string;
  displayValue: string;
  value: string;
  valueType: ValueTypeOptions;
  riskAdjustmentType: RiskAdjustmentType;
  inSummary: boolean;
  summaryText: string | null;
  question: Question;
  questionId: string;
  riskArea: RiskArea | null;
  riskAreaId: string | null;
  screeningTool: ScreeningTool | null;
  screeningToolId: string | null;
  order: number;
  goalSuggestions: GoalSuggestionTemplate[];
  concernSuggestions: Concern[];
  patientAnswers: PatientAnswer[];

  static tableName = 'answer';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      displayValue: { type: 'string', minLength: 1 }, // cannot be blank
      value: { type: 'string', minLength: 1 }, // cannot be blank
      valueType: { type: 'string', minLength: 1 }, // cannot be blank
      riskAdjustmentType: { type: 'string' },
      inSummary: { type: 'boolean' },
      summaryText: { type: 'string' },
      questionId: { type: 'string', minLength: 1 }, // cannot be blank
      order: { type: 'integer', minimum: 0 }, // cannot be negative
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['displayValue', 'value', 'valueType', 'questionId', 'order'],
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
    patientAnswers: {
      relation: Model.HasManyRelation,
      modelClass: 'patient-answer',
      join: {
        from: 'answer.id',
        to: 'patient_answer.answerId',
      },
    },
    riskArea: {
      relation: Model.HasOneThroughRelation,
      modelClass: 'risk-area',
      join: {
        from: 'answer.questionId',
        through: {
          modelClass: 'question',
          from: 'question.id',
          to: 'question.riskAreaId',
        },
        to: 'risk_area.id',
      },
    },
    screeningTool: {
      relation: Model.HasOneThroughRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'answer.questionId',
        through: {
          modelClass: 'question',
          from: 'question.id',
          to: 'question.screeningToolId',
        },
        to: 'screening_tool.id',
      },
    },
  };

  static async get(answerId: string, txn: Transaction): Promise<Answer> {
    const answer = await this.getQuery(txn).findOne({ id: answerId, deletedAt: null });

    if (!answer) {
      return Promise.reject(`No such answer: ${answerId}`);
    }
    return answer;
  }

  static async getMultiple(answerIds: string[], txn: Transaction): Promise<Answer[]> {
    return this.query(txn).where('id', 'in', answerIds);
  }

  static async getAllForQuestion(questionId: string, txn: Transaction): Promise<Answer[]> {
    return this.getQuery(txn)
      .where({ questionId, deletedAt: null })
      .orderBy('order');
  }

  static async getByComputedFieldSlugAndValue(
    args: IGetByComputedFieldSlugAndValueOptions,
    txn: Transaction,
  ): Promise<Answer | null> {
    const answer = (await this.query(txn)
      .eager('question.[computedField]')
      .joinRelation('question.computedField')
      .where('question:computedField.slug', args.slug)
      .andWhere('answer.value', args.value)
      .andWhere('answer.deletedAt', null)
      .first()) as any;

    return answer || null;
  }

  static async create(input: IAnswerCreateFields, txn: Transaction) {
    return this.getQuery(txn).insertAndFetch(input as any); // TODO: Fix this. Objection types are really weird
  }

  static async edit(
    answer: Partial<IAnswerEditableFields>,
    answerId: string,
    txn: Transaction,
  ): Promise<Answer> {
    return this.getQuery(txn).patchAndFetchById(answerId, answer as any); // TODO: Fix this. Objection types are really weird
  }

  static async delete(answerId: string, txn: Transaction): Promise<Answer> {
    await this.getQuery(txn)
      .where({ id: answerId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const answer = await this.query(txn).findById(answerId);
    if (!answer) {
      return Promise.reject(`No such answer: ${answerId}`);
    }
    return answer;
  }

  static getQuery(txn: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('goalSuggestions', builder => builder.where('goal_suggestion.deletedAt', null));
  }
}
/* tslint:enable:member-ordering */
