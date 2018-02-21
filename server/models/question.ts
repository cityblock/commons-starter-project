import { isEmpty, omit } from 'lodash';
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
  hasOtherTextAnswer?: boolean;
}

interface IQuestionCreatableFields {
  title: string;
  answerType: AnswerType;
  validatedSource?: string;
  order: number;
  applicableIfType?: QuestionConditionType;
  computedFieldId?: string;
  hasOtherTextAnswer?: boolean;
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
  computedFieldId: string;
  computedField: ComputedField;
  otherTextAnswerId: string | null;

  static tableName = 'question';

  static hasPHI = false;

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
      updatedAt: { type: 'string' },
      validatedSource: { type: 'string' },
      computedFieldId: { type: 'string' },
      otherTextAnswerId: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
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

  static async get(questionId: string, txn: Transaction): Promise<Question> {
    const question = await this.modifyEager(this.query(txn)).findOne({
      id: questionId,
      deletedAt: null,
    });

    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }

  static async create(input: IQuestionCreateFields, txn: Transaction) {
    const { computedFieldId } = input;

    if (computedFieldId) {
      input.answerType = 'radio';
    }

    let question = await this.modifyEager(this.query(txn)).insertAndFetch(input);

    const isDropdownQuestion = input.answerType === 'dropdown';
    const supportsOtherAnswerText =
      !computedFieldId && !(input as any).screeningToolId && isDropdownQuestion;

    // Safeguard against creating other answer for computed field/screening tool questions
    if (input.hasOtherTextAnswer && supportsOtherAnswerText) {
      const otherAnswer = await Answer.create(
        {
          questionId: question.id,
          displayValue: 'Other',
          value: 'other',
          valueType: 'string',
          order: 0,
        },
        txn,
      );

      question = await this.modifyEager(this.query(txn)).patchAndFetchById(question.id, {
        otherTextAnswerId: otherAnswer.id,
      });
    }

    return question;
  }

  static async getAllForRiskArea(riskAreaId: string, txn: Transaction): Promise<Question[]> {
    return this.modifyEager(this.query(txn))
      .where({ riskAreaId, deletedAt: null, screeningToolId: null })
      .orderBy('order');
  }

  static async getAllForScreeningTool(
    screeningToolId: string,
    txn: Transaction,
  ): Promise<Question[]> {
    return this.modifyEager(this.query(txn))
      .where({ screeningToolId, deletedAt: null })
      .orderBy('order');
  }

  static async getAllForProgressNoteTemplate(
    progressNoteTemplateId: string,
    txn: Transaction,
  ): Promise<Question[]> {
    return this.modifyEager(this.query(txn))
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
    txn: Transaction,
  ): Promise<Question> {
    const fetchedQuestion = await this.get(questionId, txn);
    const { otherTextAnswerId } = fetchedQuestion;
    const currentHasOtherAnswer = !!otherTextAnswerId;
    const isComputedFieldOrScreeningToolQuestion =
      !!fetchedQuestion.computedFieldId || !!fetchedQuestion.screeningToolId;
    const changingToNonDropdownAnswerType =
      !!question.answerType && question.answerType !== 'dropdown';
    const isNotAndWillNotBeDropdownQuestion =
      fetchedQuestion.answerType !== 'dropdown' && question.answerType !== 'dropdown';

    // Safeguard against breaking computed field/screening tool questions
    if (!isComputedFieldOrScreeningToolQuestion) {
      if (currentHasOtherAnswer && changingToNonDropdownAnswerType) {
        return Promise.reject('Cannot change answerType for a question with an "other" answer');
      }

      if (question.hasOtherTextAnswer && isNotAndWillNotBeDropdownQuestion) {
        return Promise.reject('Cannot add an "other" answer to a non-dropdown question');
      }

      if (question.hasOtherTextAnswer === true) {
        if (!currentHasOtherAnswer) {
          const newOtherAnswer = await Answer.create(
            {
              questionId,
              displayValue: 'Other',
              value: 'other',
              valueType: 'string',
              order: 0,
            },
            txn,
          );

          (question as any).otherTextAnswerId = newOtherAnswer.id;
        }
      } else if (question.hasOtherTextAnswer === false) {
        if (currentHasOtherAnswer) {
          await Answer.delete(otherTextAnswerId!, txn);

          (question as any).otherTextAnswerId = null;
        }
      }
    }

    const editInput = omit(question, ['hasOtherTextAnswer']);

    // It's possible the editInput contains no keys, so we protect against invalid SQL here
    if (isEmpty(editInput)) {
      return this.get(questionId, txn);
    } else {
      return this.modifyEager(this.query(txn)).patchAndFetchById(questionId, editInput);
    }
  }

  static async delete(questionId: string, txn: Transaction): Promise<Question> {
    await this.query(txn)
      .where({ id: questionId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const question = await this.modifyEager(this.query(txn)).findById(questionId);
    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }
}
/* tslint:enable:member-ordering */
