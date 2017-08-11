import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults } from '../db';
import Answer from './answer';
import Question from './question';

export interface IPatientAnswerCreateFields {
  answerId: string;
  answerValue: string;
  patientId: string;
  applicable: boolean;
  userId: string;
}

/* tslint:disable:member-ordering */
export default class PatientAnswer extends Model {
  id: string;
  answerId: string;
  answerValue: string;
  patientId: string;
  userId: string;
  applicable: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'patient_answer';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      answerId: { type: 'string' },
      answerValue: { type: 'string' },
      applicable: { type: 'boolean' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    answer: {
      relation: Model.HasOneRelation,
      modelClass: 'answer',
      join: {
        from: 'patient_answer.answerId',
        to: 'answer.id',
      },
    },

    user: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_answer.userId',
        to: 'user.id',
      },
    },

    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_answer.patientId',
        to: 'patient.id',
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

  static async get(patientAnswerId: string): Promise<PatientAnswer> {
    const patientAnswer = await this
      .query()
      .findById(patientAnswerId);

    if (!patientAnswer) {
      return Promise.reject(`No such patientAnswer: ${patientAnswerId}`);
    }
    return patientAnswer;
  }

  static async getForQuestion(
    questionId: string, patientId: string,
  ): Promise<PatientAnswer[] | null> {
    const patientAnswers = await this
      .query()
      .joinRelation('answer')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer.questionId', questionId);

    return patientAnswers as PatientAnswer[];
  }

  static async getPreviousAnswersForQuestion(
    questionId: string, patientId: string, limit = 5,
  ): Promise<PatientAnswer[]> {
    const patientAnswers: IPaginatedResults<PatientAnswer> = await this
      .query()
      .joinRelation('answer')
      .where('answer.questionId', questionId)
      .andWhere('patientId', patientId)
      .whereNotNull('patient_answer.deletedAt')
      .orderBy('patient_answer.createdAt')
      .page(0, limit) as any;

    return patientAnswers.results;
  }

  static async getForRiskArea(riskAreaId: string, patientId: string): Promise<PatientAnswer[]> {
    const patientAnswers = await this
      .query()
      .joinRelation('answer.question')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer:question.riskAreaId', riskAreaId);

    return patientAnswers as PatientAnswer[];
  }

  static async create(input: IPatientAnswerCreateFields): Promise<PatientAnswer> {
    return await transaction(PatientAnswer, async PatientAnswerWithTrasaction => {
      /**
       * TODO: Improve performance
       * Goal is to mark previous answers as deleted for answers that are part of non-multiselect
       * question. For multiselect question, the api user needs to manually delete old answers.
       */
      const answer = await Answer.get(input.answerId);
      const question = await Question.get(answer.questionId);
      if (question.answerType !== 'multiselect') {
        await PatientAnswerWithTrasaction
          .query()
          .where('deletedAt', null)
          .andWhere('patientId', input.patientId)
          .andWhere('answerId', input.answerId)
          .patch({ deletedAt: new Date().toISOString() });
      }
      return await PatientAnswerWithTrasaction.query().insertAndFetch(input);
    });
  }

  static async editApplicable(
    applicable: boolean, patientAnswerId: string,
  ): Promise<PatientAnswer> {
    return await this.query()
      .updateAndFetchById(patientAnswerId, { applicable });
  }

  static async delete(patientAnswerId: string): Promise<PatientAnswer> {
    return await this.query().updateAndFetchById(patientAnswerId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
