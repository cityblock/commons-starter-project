import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults } from '../db';
import Answer from './answer';
import Question from './question';

export interface IPatientAnswerCreateFields {
  patientId: string;
  questionIds?: string[];
  answers: Array<{
    answerId: string;
    questionId: string;
    answerValue: string;
    patientId: string;
    applicable: boolean;
    userId: string;
  }>;
}

/* tslint:disable:member-ordering */
export default class PatientAnswer extends Model {
  id: string;
  answerId: string;
  answerValue: string;
  answer: Answer;
  patientId: string;
  userId: string;
  applicable: boolean;
  question: Question;

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

    question: {
      // TODO: remove once (if) https://github.com/Vincit/objection.js/pull/462 gets merged
      relation: (Model as any).HasOneThroughRelation,
      modelClass: 'question',
      join: {
        from: 'patient_answer.answerId',
        through: {
          modelClass: 'answer',
          from: 'answer.id',
          to: 'answer.questionId',
        },
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

  static async getForRiskArea(
    riskAreaId: string, patientId: string, eager = '',
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this
      .query()
      .joinRelation('answer.question')
      .eager(eager)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer:question.riskAreaId', riskAreaId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async create(input: IPatientAnswerCreateFields): Promise<PatientAnswer[]> {
    return await transaction(PatientAnswer, async PatientAnswerWithTransaction => {
      const questionIds = input.questionIds || input.answers.map(answer => answer.questionId);

      // NOTE: This needs to be done as a subquery as knex doesn't support FROM clauses for updates
      const patientAnswerIdsToDeleteQuery = PatientAnswerWithTransaction
        .query()
        .joinRelation('answer')
        .where('patient_answer.deletedAt', null)
        .andWhere('patientId', input.patientId)
        .where('answer.questionId', 'in', questionIds)
        .select('patient_answer.id');

      await PatientAnswerWithTransaction
        .query()
        .where('id', 'in', patientAnswerIdsToDeleteQuery)
        .patch({ deletedAt: new Date().toISOString() });

      let results: PatientAnswer[] = [];

      if (input.answers.length) {
        results = await PatientAnswerWithTransaction
          .query()
          .insertGraphAndFetch(input.answers);
      }

      return results;
    });
  }

  static async editApplicable(
    applicable: boolean, patientAnswerId: string,
  ): Promise<PatientAnswer> {
    return await this
      .query()
      .eager('question')
      .updateAndFetchById(patientAnswerId, { applicable });
  }

  static async delete(patientAnswerId: string): Promise<PatientAnswer> {
    return await this.query().updateAndFetchById(patientAnswerId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
