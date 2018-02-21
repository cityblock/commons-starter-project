import { Model, RelationMappings, Transaction } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';

interface IQuestionConditionEditableFields {
  answerId: string;
  questionId: string;
}

/* tslint:disable:member-ordering */
export default class QuestionCondition extends BaseModel {
  answerId: string;
  questionId: string;

  static tableName = 'question_condition';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      questionId: { type: 'string', minLength: 1 }, // cannot be blank
      answerId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['questionId', 'answerId'],
  };

  static relationMappings: RelationMappings = {
    answer: {
      relation: Model.HasOneRelation,
      modelClass: 'answer',
      join: {
        from: 'question_condition.answerId',
        to: 'answer.id',
      },
    },

    question: {
      relation: Model.HasOneRelation,
      modelClass: 'question',
      join: {
        from: 'question_condition.questionId',
        to: 'question.id',
      },
    },
  };

  static async get(questionConditionId: string, txn: Transaction): Promise<QuestionCondition> {
    const questionCondition = await this.query(txn).findOne({
      id: questionConditionId,
      deletedAt: null,
    });

    if (!questionCondition) {
      return Promise.reject(`No such questionCondition: ${questionConditionId}`);
    }
    return questionCondition;
  }

  static async create(input: IQuestionConditionEditableFields, txn: Transaction) {
    await this.validate(input, txn);
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    questionCondition: IQuestionConditionEditableFields,
    questionConditionId: string,
    txn: Transaction,
  ): Promise<QuestionCondition> {
    await this.validate(questionCondition, txn);
    return this.query(txn).patchAndFetchById(questionConditionId, questionCondition);
  }

  static async validate(input: IQuestionConditionEditableFields, txn: Transaction) {
    const answer = await Answer.get(input.answerId, txn);
    if (answer.questionId === input.questionId) {
      return Promise.reject(
        `Error: Answer ${input.answerId} is an answer to question ${input.questionId}`,
      );
    }
  }

  static async delete(questionConditionId: string, txn: Transaction): Promise<QuestionCondition> {
    await this.query(txn)
      .where({ id: questionConditionId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const questionCondition = await this.query(txn).findById(questionConditionId);
    if (!questionCondition) {
      return Promise.reject(`No such questionCondition: ${questionConditionId}`);
    }
    return questionCondition;
  }
}
/* tslint:enable:member-ordering */
