import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import QuestionCondition from './question-condition';
import RiskArea from './risk-area';
import ScreeningTool from './screening-tool';

export interface IQuestionEditableFields {
  title: string;
  answerType: AnswerType;
  validatedSource?: string;
  riskAreaId?: string;
  screeningToolId?: string;
  order: number;
  applicableIfType?: QuestionConditionType;
}

export type AnswerType = 'dropdown' | 'radio' | 'freetext' | 'multiselect';
export type QuestionConditionType = 'allTrue' | 'oneTrue';

/* tslint:disable:max-line-length */
const EAGER_QUERY =
  '[applicableIfQuestionConditions, answers(orderByOrder).[concernSuggestions, goalSuggestions.[taskTemplates]]]';
/* tslint:enable:max-line-length */

/* tslint:disable:member-ordering */
export default class Question extends Model {
  id: string;
  title: string;
  answers: Answer[];
  answerType: AnswerType;
  riskAreaId: string;
  riskArea: RiskArea;
  screeningToolId: string;
  screeningTool: ScreeningTool;
  applicableIfQuestionConditions: QuestionCondition[];
  applicableIfType: QuestionConditionType;
  validatedSource: string;
  order: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'question';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      answerType: { type: 'string' },
      applicableIfType: { type: 'string' },
      riskAreaId: { type: 'string' },
      screeningToolId: { type: 'string' },
      order: { type: 'integer' },
      deletedAt: { type: 'string' },
      validatedSource: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    answers: {
      relation: Model.HasManyRelation,
      modelClass: 'answer',
      join: {
        from: 'question.id',
        to: 'answer.questionId',
      },
    },

    applicableIfQuestionConditions: {
      relation: Model.HasManyRelation,
      modelClass: 'question-condition',
      join: {
        from: 'question.id',
        to: 'question_condition.questionId',
      },
    },

    riskArea: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'risk-area',
      join: {
        from: 'question.riskAreaId',
        to: 'risk_area.id',
      },
    },

    screeningTool: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'question.screeningToolId',
        to: 'screening_tool.id',
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

  static async get(questionId: string): Promise<Question> {
    const question = await this.query()
      .eager(EAGER_QUERY, {
        orderByOrder: (builder: any) => {
          builder.orderBy('order');
        },
      })
      .modifyEager('applicableIfQuestionConditions', builder => {
        builder.where('question_condition.deletedAt', null);
      })
      .modifyEager('answers', builder => {
        builder.where('answer.deletedAt', null);
      })
      .modifyEager('answers.concernSuggestions', builder => {
        builder.where('concern_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions', builder => {
        builder.where('goal_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions.taskTemplates', builder => {
        builder.where('task_template.deletedAt', null);
      })
      .findById(questionId);

    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }

  static async create(input: IQuestionEditableFields) {
    return this.query()
      .eager(EAGER_QUERY, {
        orderByOrder: (builder: any) => {
          builder.orderBy('order');
        },
      })
      .modifyEager('applicableIfQuestionConditions', builder => {
        builder.where('question_condition.deletedAt', null);
      })
      .modifyEager('answers', builder => {
        builder.where('answer.deletedAt', null);
      })
      .modifyEager('answers.concernSuggestions', builder => {
        builder.where('concern_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions', builder => {
        builder.where('goal_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions.taskTemplates', builder => {
        builder.where('task_template.deletedAt', null);
      })
      .insertAndFetch(input);
  }

  static async getAllForRiskArea(riskAreaId: string): Promise<Question[]> {
    return this.query()
      .where({ riskAreaId, deletedAt: null, screeningToolId: null })
      .eager(EAGER_QUERY, {
        orderByOrder: (builder: any) => {
          builder.orderBy('order');
        },
      })
      .modifyEager('applicableIfQuestionConditions', builder => {
        builder.where('question_condition.deletedAt', null);
      })
      .modifyEager('answers', builder => {
        builder.where('answer.deletedAt', null);
      })
      .modifyEager('answers.concernSuggestions', builder => {
        builder.where('concern_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions', builder => {
        builder.where('goal_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions.taskTemplates', builder => {
        builder.where('task_template.deletedAt', null);
      })
      .orderBy('order');
  }

  static async getAllForScreeningTool(screeningToolId: string): Promise<Question[]> {
    return this.query()
      .where({ screeningToolId, deletedAt: null })
      .eager(EAGER_QUERY, {
        orderByOrder: (builder: any) => {
          builder.orderBy('order');
        },
      })
      .modifyEager('applicableIfQuestionConditions', builder => {
        builder.where('question_condition.deletedAt', null);
      })
      .modifyEager('answers', builder => {
        builder.where('answer.deletedAt', null);
      })
      .modifyEager('answers.concernSuggestions', builder => {
        builder.where('concern_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions', builder => {
        builder.where('goal_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions.taskTemplates', builder => {
        builder.where('task_template.deletedAt', null);
      })
      .orderBy('order');
  }

  static async edit(
    patient: Partial<IQuestionEditableFields>,
    questionId: string,
  ): Promise<Question> {
    return await this.query()
      .eager(EAGER_QUERY, {
        orderByOrder: (builder: any) => {
          builder.orderBy('order');
        },
      })
      .modifyEager('applicableIfQuestionConditions', builder => {
        builder.where('question_condition.deletedAt', null);
      })
      .modifyEager('answers', builder => {
        builder.where('answer.deletedAt', null);
      })
      .modifyEager('answers.concernSuggestions', builder => {
        builder.where('concern_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions', builder => {
        builder.where('goal_suggestion.deletedAt', null);
      })
      .modifyEager('answers.goalSuggestions.taskTemplates', builder => {
        builder.where('task_template.deletedAt', null);
      })
      .updateAndFetchById(questionId, patient);
  }

  static async delete(questionId: string): Promise<Question> {
    return await this.query().updateAndFetchById(questionId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
