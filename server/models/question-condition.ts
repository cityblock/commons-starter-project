import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';

export interface IQuestionConditionEditableFields {
  answerId: string;
  questionId: string;
}

/* tslint:disable:member-ordering */
export default class QuestionCondition extends Model {
  id: string;
  answerId: string;
  questionId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'question_condition';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(questionConditionId: string): Promise<QuestionCondition> {
    const questionCondition = await this.query().findById(questionConditionId);

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
    return await this.query().updateAndFetchById(questionConditionId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
