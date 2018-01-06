import { Model, QueryBuilder, RelationMappings, Transaction } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';
import ComputedField from './computed-field';
import ProgressNoteTemplate from './progress-note-template';
import QuestionCondition from './question-condition';
import RiskArea from './risk-area';
import ScreeningTool from './screening-tool';

interface IQuestionEditableFields {
  title: string;
  answerType: AnswerType;
  validatedSource?: string;
  order: number;
  applicableIfType?: QuestionConditionType;
}

interface IQuestionCreatableFields {
  title: string;
  answerType: AnswerType;
  validatedSource?: string;
  order: number;
  applicableIfType?: QuestionConditionType;
  computedFieldId?: string;
}

export interface IRiskAreaQuestion extends IQuestionCreatableFields {
  riskAreaId: string;
  type: 'riskArea';
}

interface IScreeningToolQuestion extends IQuestionCreatableFields {
  screeningToolId: string;
  type: 'screeningTool';
}

interface IProgressNoteTemplateQuestion extends IQuestionCreatableFields {
  progressNoteTemplateId: string;
  type: 'progressNoteTemplate';
}

type IQuestionCreateFields =
  | IRiskAreaQuestion
  | IScreeningToolQuestion
  | IProgressNoteTemplateQuestion;

type AnswerType = 'dropdown' | 'radio' | 'freetext' | 'multiselect';
type QuestionConditionType = 'allTrue' | 'oneTrue';

const EAGER_QUERY =
  '[computedField, progressNoteTemplate, applicableIfQuestionConditions, answers(orderByOrder).[concernSuggestions, goalSuggestions.[taskTemplates]]]';

/* tslint:disable:member-ordering */
export default class Question extends BaseModel {
  title: string;
  answers: Answer[];
  answerType: AnswerType;
  riskAreaId: string;
  riskArea: RiskArea;
  screeningToolId: string;
  screeningTool: ScreeningTool;
  progressNoteTemplateId: string;
  progressNoteTemplate: ProgressNoteTemplate;
  applicableIfQuestionConditions: QuestionCondition[];
  applicableIfType: QuestionConditionType;
  validatedSource: string;
  order: number;
  computedField: ComputedField;

  static tableName = 'question';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      answerType: { type: 'string', minLength: 1 }, // cannot be blank
      applicableIfType: { type: 'string' },
      riskAreaId: { type: 'string' },
      screeningToolId: { type: 'string' },
      progressNoteTemplateId: { type: 'string' },
      order: { type: 'integer', minimum: 1 }, // cannot be zero ore negative
      deletedAt: { type: 'string' },
      validatedSource: { type: 'string' },
      computedFieldId: { type: 'string' },
    },
    required: ['title', 'answerType', 'order'],
  };

  static relationMappings: RelationMappings = {
    progressNoteTemplate: {
      relation: Model.HasOneRelation,
      modelClass: 'progress-note-template',
      join: {
        from: 'question.progressNoteTemplateId',
        to: 'progress_note_template.id',
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

    computedField: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'computed-field',
      join: {
        from: 'question.computedFieldId',
        to: 'computed_field.id',
      },
    },
  };

  static modifyEager(query: QueryBuilder<Question>): QueryBuilder<Question> {
    return query
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
      });
  }

  static async get(questionId: string): Promise<Question> {
    const question = await this.modifyEager(this.query()).findOne({
      id: questionId,
      deletedAt: null,
    });

    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }

  static async create(input: IQuestionCreateFields, txn?: Transaction) {
    const { computedFieldId } = input;

    if (computedFieldId) {
      input.answerType = 'radio';
    }

    return this.modifyEager(this.query(txn)).insertAndFetch(input);
  }

  static async getAllForRiskArea(riskAreaId: string): Promise<Question[]> {
    return this.modifyEager(this.query())
      .where({ riskAreaId, deletedAt: null, screeningToolId: null })
      .orderBy('order');
  }

  static async getAllForScreeningTool(screeningToolId: string): Promise<Question[]> {
    return this.modifyEager(this.query())
      .where({ screeningToolId, deletedAt: null })
      .orderBy('order');
  }

  static async getAllForProgressNoteTemplate(progressNoteTemplateId: string): Promise<Question[]> {
    return this.modifyEager(this.query())
      .where({ progressNoteTemplateId, deletedAt: null })
      .orderBy('order');
  }

  /**
   * NOTE: Intentionally not possible to change associated risk area / screening tool /
   * progress note template. Users should delete the question and create a new one rather than
   * alter association
   */
  static async edit(
    question: Partial<IQuestionEditableFields>,
    questionId: string,
  ): Promise<Question> {
    return await this.modifyEager(this.query()).patchAndFetchById(questionId, question);
  }

  static async delete(questionId: string): Promise<Question> {
    await this.query()
      .where({ id: questionId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const question = await this.modifyEager(this.query()).findById(questionId);
    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }
}
/* tslint:enable:member-ordering */
