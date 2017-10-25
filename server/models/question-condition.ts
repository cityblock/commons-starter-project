import { Model, RelationMappings } from 'objection';
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

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      questionId: { type: 'string' },
      answerId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  static async get(questionConditionId: string): Promise<QuestionCondition> {
    const questionCondition = await this.query().findOne({
      id: questionConditionId,
      deletedAt: null,
    });

    if (!questionCondition) {
      return Promise.reject(`No such questionCondition: ${questionConditionId}`);
    }
    return questionCondition;
  }

  static async create(input: IQuestionConditionEditableFields) {
    await this.validate(input);
    return this.query().insertAndFetch(input);
  }

  static async edit(
    questionCondition: IQuestionConditionEditableFields,
    questionConditionId: string,
  ): Promise<QuestionCondition> {
    await this.validate(questionCondition);
    return await this.query().updateAndFetchById(questionConditionId, questionCondition);
  }

  static async validate(input: IQuestionConditionEditableFields) {
    const answer = await Answer.get(input.answerId);
    if (answer.questionId === input.questionId) {
      return Promise.reject(
        `Error: Answer ${input.answerId} is an answer to question ${input.questionId}`,
      );
    }
  }

  static async delete(questionConditionId: string): Promise<QuestionCondition> {
    await this.query()
      .where({ id: questionConditionId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const questionCondition = await this.query().findById(questionConditionId);
    if (!questionCondition) {
      return Promise.reject(`No such questionCondition: ${questionConditionId}`);
    }
    return questionCondition;
  }
}
/* tslint:enable:member-ordering */
