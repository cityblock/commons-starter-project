import { Model, RelationMappings } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';
import ProgressNote from './progress-note';
import QuestionCondition from './question-condition';
import RiskArea from './risk-area';
import ScreeningTool from './screening-tool';

interface IQuestionEditableFields {
  title: string;
  answerType: AnswerType;
  validatedSource?: string;
  riskAreaId?: string;
  screeningToolId?: string;
  order: number;
  applicableIfType?: QuestionConditionType;
}

type AnswerType = 'dropdown' | 'radio' | 'freetext' | 'multiselect';
type QuestionConditionType = 'allTrue' | 'oneTrue';

/* tslint:disable:max-line-length */
const EAGER_QUERY =
  '[applicableIfQuestionConditions, answers(orderByOrder).[concernSuggestions, goalSuggestions.[taskTemplates]]]';
/* tslint:enable:max-line-length */

/* tslint:disable:member-ordering */
export default class Question extends BaseModel {
  title: string;
  answers: Answer[];
  answerType: AnswerType;
  riskAreaId: string;
  riskArea: RiskArea;
  screeningToolId: string;
  screeningTool: ScreeningTool;
  progressNoteId: string;
  progressNote: ProgressNote;
  applicableIfQuestionConditions: QuestionCondition[];
  applicableIfType: QuestionConditionType;
  validatedSource: string;
  order: number;

  static tableName = 'question';

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
    progressNote: {
      relation: Model.HasOneRelation,
      modelClass: 'progress-note',
      join: {
        from: 'question.progressNoteId',
        to: 'progress_note.id',
      },
    },

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
      .findOne({ id: questionId, deletedAt: null });

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
    await this.query()
      .where({ id: questionId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const question = await this.query().findById(questionId);
    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }
}
/* tslint:enable:member-ordering */
