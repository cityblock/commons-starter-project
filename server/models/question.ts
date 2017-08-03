import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import QuestionCondition from './question-condition';
import RiskArea from './risk-area';

export interface IQuestionEditableFields {
  title: string;
  answerType: AnswerType;
  validatedSource?: string;
  riskAreaId: string;
  order: number;
  applicableIfType?: QuestionConditionType;
}

export type AnswerType = 'dropdown' | 'radio' | 'freetext' | 'multiselect';
export type QuestionConditionType = 'allTrue' | 'oneTrue';

const EAGER_QUERY = '[applicableIfQuestionConditions, answers]';

/* tslint:disable:member-ordering */
export default class Question extends Model {
  id: string;
  title: string;
  answers: Answer[];
  answerType: AnswerType;
  riskAreaId: string;
  riskArea: RiskArea;
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
  };

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(questionId: string): Promise<Question> {
    const question = await this
      .query()
      .eager(EAGER_QUERY)
      .modifyEager(EAGER_QUERY, builder => {
        builder.where('deletedAt', null);
      })
      .findById(questionId);

    if (!question) {
      return Promise.reject(`No such question: ${questionId}`);
    }
    return question;
  }

  static async create(input: IQuestionEditableFields) {
    return this.query().insertAndFetch(input);
  }

  static async getAllForRiskArea(riskAreaId: string): Promise<Question[]> {
    return this
      .query()
      .where({ riskAreaId, deletedAt: null })
      .eager(EAGER_QUERY)
      .modifyEager(EAGER_QUERY, builder => {
        builder.where('deletedAt', null);
      })
      .orderBy('order');
  }

  static async edit(
    patient: Partial<IQuestionEditableFields>, questionId: string,
  ): Promise<Question> {
    return await this.query().updateAndFetchById(questionId, patient).eager(EAGER_QUERY);
  }

  static async delete(questionId: string): Promise<Question> {
    return await this.query().updateAndFetchById(questionId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
