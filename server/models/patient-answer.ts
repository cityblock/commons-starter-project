import { transaction, Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults } from '../db';
import Answer from './answer';
import BaseModel from './base-model';
import PatientScreeningToolSubmission from './patient-screening-tool-submission';
import Question from './question';
import ScreeningTool from './screening-tool';

interface IPatientAnswerCreateFields {
  patientId: string;
  questionIds?: string[];
  patientScreeningToolSubmissionId?: string;
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
export default class PatientAnswer extends BaseModel {
  answerId: string;
  answerValue: string;
  answer: Answer;
  patientId: string;
  userId: string;
  applicable: boolean;
  question: Question;
  patientScreeningToolSubmissionId: string;
  patientScreeningToolSubmission: PatientScreeningToolSubmission;
  screeningTool: ScreeningTool;

  static tableName = 'patient_answer';

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
      patientScreeningToolSubmissionId: { type: 'string' },
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
      relation: Model.HasOneThroughRelation,
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

    patientScreeningToolSubmission: {
      relation: Model.HasOneRelation,
      modelClass: 'patient-screening-tool-submission',
      join: {
        from: 'patient_answer.patientScreeningToolSubmissionId',
        to: 'patient_screening_tool_submission.id',
      },
    },

    screeningTool: {
      relation: Model.HasOneThroughRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'patient_answer.screeningToolSubmissionId',
        through: {
          modelClass: 'patient-screening-tool-submission',
          from: 'patient_screening_tool_submission.id',
          to: 'patient_screening_tool_submission.screeningToolId',
        },
        to: 'screening_tool.id',
      },
    },
  };

  static async get(patientAnswerId: string): Promise<PatientAnswer> {
    const patientAnswer = await this.query()
      .eager('answer')
      .findOne({ id: patientAnswerId, deletedAt: null });

    if (!patientAnswer) {
      return Promise.reject(`No such patientAnswer: ${patientAnswerId}`);
    }
    return patientAnswer;
  }

  static async getForQuestion(
    questionId: string,
    patientId: string,
  ): Promise<PatientAnswer[] | null> {
    const patientAnswers = await this.query()
      .eager('answer')
      .joinRelation('answer')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer.questionId', questionId);

    return patientAnswers as PatientAnswer[];
  }

  static async getPreviousAnswersForQuestion(
    questionId: string,
    patientId: string,
    limit = 5,
  ): Promise<PatientAnswer[]> {
    const patientAnswers: IPaginatedResults<PatientAnswer> = (await this.query()
      .joinRelation('answer')
      .where('answer.questionId', questionId)
      .andWhere('patientId', patientId)
      .whereNotNull('patient_answer.deletedAt')
      .orderBy('patient_answer.createdAt')
      .page(0, limit)) as any;

    return patientAnswers.results;
  }

  static async getForRiskArea(
    riskAreaId: string,
    patientId: string,
    eager = 'answer',
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query()
      .joinRelation('answer.question')
      .eager(eager)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer:question.riskAreaId', riskAreaId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getForScreeningTool(
    screeningToolId: string,
    patientId: string,
    eager = 'answer',
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query()
      .joinRelation('answer.question')
      .eager(eager)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer:question.screeningToolId', screeningToolId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getAllForPatient(patientId: string): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query()
      .joinRelation('answer.question')
      .eager('[answer.[question.[riskArea]]]')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async create(
    input: IPatientAnswerCreateFields,
    existingTxn?: Transaction,
  ): Promise<PatientAnswer[]> {
    return await transaction(PatientAnswer.knex(), async txn => {
      const questionIds = input.questionIds || input.answers.map(answer => answer.questionId);

      // NOTE: This needs to be done as a subquery as knex doesn't support FROM clauses for updates
      const patientAnswerIdsToDeleteQuery = PatientAnswer.query(existingTxn || txn)
        .joinRelation('answer')
        .where('patient_answer.deletedAt', null)
        .andWhere('patientId', input.patientId)
        .where('answer.questionId', 'in', questionIds)
        .select('patient_answer.id');

      await PatientAnswer.query(existingTxn || txn)
        .where('id', 'in', patientAnswerIdsToDeleteQuery as any)
        .patch({ deletedAt: new Date().toISOString() });

      let results: PatientAnswer[] = [];

      if (input.answers.length) {
        results = await PatientAnswer.query(existingTxn || txn)
          .eager('answer')
          .insertGraphAndFetch(input.answers);
      }

      return results;
    });
  }

  static async editApplicable(
    applicable: boolean,
    patientAnswerId: string,
  ): Promise<PatientAnswer> {
    return await this.query()
      .eager('[question, answer]')
      .updateAndFetchById(patientAnswerId, { applicable });
  }

  static async delete(patientAnswerId: string): Promise<PatientAnswer> {
    await this.query()
      .where({ id: patientAnswerId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const patientAnswer = await this.query().findById(patientAnswerId);
    if (!patientAnswer) {
      return Promise.reject(`No such patientAnswer: ${patientAnswerId}`);
    }
    return patientAnswer;
  }
}
/* tslint:enable:member-ordering */
