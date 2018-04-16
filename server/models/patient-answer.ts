import { isEmpty, uniqBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults } from '../db';
import Answer from './answer';
import BaseModel from './base-model';
import Patient from './patient';
import PatientAnswerEvent, { IPatientAnswerEventOptions } from './patient-answer-event';
import PatientScreeningToolSubmission from './patient-screening-tool-submission';
import Question from './question';
import RiskAreaAssessmentSubmission from './risk-area-assessment-submission';
import ScreeningTool from './screening-tool';
import User from './user';

type IAnswers = Array<{
  answerId: string;
  questionId: string;
  answerValue: string;
  patientId: string;
  applicable: boolean;
  userId?: string;
  mixerJobId?: string;
  patientScreeningToolSubmissionId?: string;
  riskAreaAssessmentSubmissionId?: string;
  progressNoteId?: string;
}>;

interface IPatientAnswerCreateForRiskAreaAssessmentSubmission {
  patientId: string;
  questionIds: string[];
  riskAreaAssessmentSubmissionId: string;
  answers: IAnswers;
  type: 'riskAreaAssessmentSubmission';
}

interface IPatientAnswerCreateForProgressNote {
  patientId: string;
  questionIds: string[];
  progressNoteId: string;
  answers: IAnswers;
  type: 'progressNote';
}

interface IPatientAnswerCreateForScreeningToolSubmission {
  patientId: string;
  questionIds: string[];
  patientScreeningToolSubmissionId: string;
  answers: IAnswers;
  type: 'patientScreeningToolSubmission';
}

interface IPatientAnswerCreateForComputedField {
  patientId: string;
  questionIds: string[];
  mixerJobId: string;
  answers: IAnswers;
  type: 'computedFieldAnswer';
}

type IPatientAnswerCreateFields =
  | IPatientAnswerCreateForProgressNote
  | IPatientAnswerCreateForRiskAreaAssessmentSubmission
  | IPatientAnswerCreateForScreeningToolSubmission
  | IPatientAnswerCreateForComputedField;

export const EAGER_QUERY = '[answer, question]';

/* tslint:disable:member-ordering */
export default class PatientAnswer extends BaseModel {
  answerId: string;
  answerValue: string;
  answer: Answer;
  patientId: string;
  userId: string;
  applicable: boolean;
  question: Question;
  questionId: string;
  patientScreeningToolSubmissionId: string;
  patientScreeningToolSubmission: PatientScreeningToolSubmission;
  riskAreaAssessmentSubmissionId: string | null;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
  screeningTool: ScreeningTool;
  progressNoteId: string;
  mixerJobId: string;

  static tableName = 'patient_answer';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      answerId: { type: 'string', minLength: 1 }, // cannot be blank
      answerValue: { type: 'string' },
      applicable: { type: 'boolean' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      patientScreeningToolSubmissionId: { type: 'string' },
      progressNoteId: { type: 'string' },
      riskAreaAssessmentSubmissionId: { type: 'string' },
      mixerJobId: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'answerId'],
    oneOf: [
      { required: ['patientScreeningToolSubmissionId'] },
      { required: ['progressNoteId'] },
      { required: ['riskAreaAssessmentSubmissionId'] },
      { required: ['mixerJobId'] },
    ],
  };

  static get relationMappings(): RelationMappings {
    return {
      answer: {
        relation: Model.HasOneRelation,
        modelClass: Answer,
        join: {
          from: 'patient_answer.answerId',
          to: 'answer.id',
        },
      },

      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'patient_answer.userId',
          to: 'user.id',
        },
      },

      patient: {
        relation: Model.HasOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_answer.patientId',
          to: 'patient.id',
        },
      },

      question: {
        relation: Model.HasOneThroughRelation,
        modelClass: Question,
        join: {
          from: 'patient_answer.answerId',
          through: {
            modelClass: Answer,
            from: 'answer.id',
            to: 'answer.questionId',
          },
          to: 'question.id',
        },
      },

      patientScreeningToolSubmission: {
        relation: Model.HasOneRelation,
        modelClass: PatientScreeningToolSubmission,
        join: {
          from: 'patient_answer.patientScreeningToolSubmissionId',
          to: 'patient_screening_tool_submission.id',
        },
      },

      riskAreaAssessmentSubmission: {
        relation: Model.HasOneRelation,
        modelClass: RiskAreaAssessmentSubmission,
        join: {
          from: 'patient_answer.riskAreaAssessmentSubmissionId',
          to: 'risk_area_assessment_submission.id',
        },
      },

      screeningTool: {
        relation: Model.HasOneThroughRelation,
        modelClass: ScreeningTool,
        join: {
          from: 'patient_answer.screeningToolSubmissionId',
          through: {
            modelClass: PatientScreeningToolSubmission,
            from: 'patient_screening_tool_submission.id',
            to: 'patient_screening_tool_submission.screeningToolId',
          },
          to: 'screening_tool.id',
        },
      },
    };
  }

  static async get(patientAnswerId: string, txn: Transaction): Promise<PatientAnswer> {
    const patientAnswer = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: patientAnswerId, deletedAt: null });

    if (!patientAnswer) {
      return Promise.reject(`No such patientAnswer: ${patientAnswerId}`);
    }
    return patientAnswer;
  }

  static async getPreviousAnswersForQuestion(
    questionId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers: IPaginatedResults<PatientAnswer> = (await this.query(txn)
      .joinRelation('answer')
      .where('answer.questionId', questionId)
      .andWhere('patientId', patientId)
      .whereNotNull('patient_answer.deletedAt')
      .orderBy('patient_answer.createdAt')
      // TODO: Make the limit an arg again.
      .page(0, 5)) as any;

    return patientAnswers.results;
  }

  static async getForQuestion(
    questionId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .eager(EAGER_QUERY)
      .joinRelation('answer')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer.questionId', questionId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getForRiskArea(
    riskAreaId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .joinRelation('answer.question')
      .eager(EAGER_QUERY)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer:question.riskAreaId', riskAreaId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getForScreeningTool(
    screeningToolId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .joinRelation('answer.question')
      .eager(EAGER_QUERY)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('answer:question.screeningToolId', screeningToolId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getForScreeningToolSubmission(
    patientScreeningToolSubmissionId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .joinRelation('answer.question')
      .eager(EAGER_QUERY)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientScreeningToolSubmissionId', patientScreeningToolSubmissionId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getForRiskAreaAssessmentSubmission(
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .joinRelation('answer.question')
      .eager(EAGER_QUERY)
      .where('patient_answer.deletedAt', null)
      .andWhere('riskAreaAssessmentSubmissionId', riskAreaAssessmentSubmissionId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async getForProgressNote(
    progressNoteId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .eager(EAGER_QUERY)
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .andWhere('patient_answer.progressNoteId', progressNoteId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers;
  }

  static async getAllForPatient(patientId: string, txn: Transaction): Promise<PatientAnswer[]> {
    const patientAnswers = await this.query(txn)
      .joinRelation('answer.question')
      .eager('[answer.[question.[riskArea]]]')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('patient_answer.updatedAt', 'asc');

    return patientAnswers as PatientAnswer[];
  }

  static async createPatientAnswerEvents(
    patientAnswers: PatientAnswer[],
    deletedPatientAnswers: PatientAnswer[],
    txn: Transaction,
  ) {
    const patientAnswerEventsToCreate = patientAnswers.map(patientAnswer => {
      const patientAnswerEvent: IPatientAnswerEventOptions = {
        patientId: patientAnswer.patientId,
        patientAnswerId: patientAnswer.id,
        eventType: 'create_patient_answer',
      };

      if (patientAnswer.userId) {
        patientAnswerEvent.userId = patientAnswer.userId;
      }
      const previousPatientAnswer = deletedPatientAnswers.find(
        deletedAnswer => deletedAnswer.answer.questionId === patientAnswer.answer.questionId,
      );

      if (previousPatientAnswer) {
        patientAnswerEvent.previousPatientAnswerId = previousPatientAnswer.id;
      }

      return patientAnswerEvent;
    });

    if (!isEmpty(patientAnswerEventsToCreate)) {
      await PatientAnswerEvent.createMultiple(
        {
          patientAnswerEvents: patientAnswerEventsToCreate,
        },
        txn,
      );
    }
  }

  static getAnswersForInput(input: IPatientAnswerCreateFields): IAnswers {
    switch (input.type) {
      case 'progressNote':
        return input.answers.map(answer => {
          answer.progressNoteId = input.progressNoteId;
          return answer;
        });
      case 'patientScreeningToolSubmission':
        return input.answers.map(answer => {
          answer.patientScreeningToolSubmissionId = input.patientScreeningToolSubmissionId;
          return answer;
        });
      case 'riskAreaAssessmentSubmission':
        return input.answers.map(answer => {
          answer.riskAreaAssessmentSubmissionId = input.riskAreaAssessmentSubmissionId;
          return answer;
        });
      case 'computedFieldAnswer':
        return input.answers.map(answer => {
          answer.mixerJobId = input.mixerJobId;
          return answer;
        });
    }
  }

  static async create(
    input: IPatientAnswerCreateFields,
    txn: Transaction,
  ): Promise<PatientAnswer[]> {
    const { patientId } = input;
    const questionIds = input.questionIds;
    const answers = this.getAnswersForInput(input);
    // NOTE: This needs to be done as a subquery as knex doesn't support FROM clauses for updates
    const patientAnswerIdsToDeleteQuery = PatientAnswer.query(txn)
      .joinRelation('answer')
      .where('patient_answer.deletedAt', null)
      .andWhere('patientId', patientId)
      .where('answer.questionId', 'in', questionIds)
      .select('patient_answer.id');

    const deletedPatientAnswers: PatientAnswer[] = (await PatientAnswer.query(txn)
      .eager('answer')
      .where('id', 'in', patientAnswerIdsToDeleteQuery as any)
      .patch({ deletedAt: new Date().toISOString() })
      .returning('*')) as any;
    const uniqueDeletedPatientAnswers = uniqBy(
      deletedPatientAnswers,
      deletedPatientAnswer => deletedPatientAnswer.answer.questionId,
    );

    let results: PatientAnswer[] = [];

    if (answers.length) {
      results = await PatientAnswer.query(txn)
        .eager(EAGER_QUERY)
        .insertGraphAndFetch(answers);
    }

    await PatientAnswer.createPatientAnswerEvents(results, uniqueDeletedPatientAnswers, txn);

    return results;
  }

  static async editApplicable(
    applicable: boolean,
    patientAnswerId: string,
    txn: Transaction,
  ): Promise<PatientAnswer> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientAnswerId, { applicable });
  }

  static async delete(patientAnswerId: string, txn: Transaction): Promise<PatientAnswer> {
    await this.query(txn)
      .where({ id: patientAnswerId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const patientAnswer = await this.query(txn).findById(patientAnswerId);
    if (!patientAnswer) {
      return Promise.reject(`No such patientAnswer: ${patientAnswerId}`);
    }
    return patientAnswer;
  }

  static async getPatientIdForResource(patientAnswerId: string, txn: Transaction): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientAnswerId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
