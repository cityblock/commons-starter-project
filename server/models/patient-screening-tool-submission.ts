import { isInteger, reduce } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { createSuggestionsForPatientScreeningToolSubmission } from '../lib/suggestions';
import BaseModel from './base-model';
import Patient from './patient';
import PatientAnswer from './patient-answer';
import RiskArea from './risk-area';
import ScreeningTool from './screening-tool';
import ScreeningToolScoreRange from './screening-tool-score-range';
import User from './user';

interface IPatientScreeningToolSubmissionCreateFields {
  screeningToolId: string;
  patientId: string;
  userId: string;
}

interface IPatientScreeningToolSubmissionScoreFields {
  score?: number;
  patientAnswers?: PatientAnswer[];
}

export const EAGER_QUERY =
  '[screeningTool, screeningToolScoreRange, patient, user, riskArea.[riskAreaGroup], patientAnswers, carePlanSuggestions.[patient, concern, goalSuggestionTemplate.[taskTemplates]]]';

/* tslint:disable:member-ordering */
export default class PatientScreeningToolSubmission extends BaseModel {
  screeningToolId: string;
  screeningTool: ScreeningTool;
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  score: number;
  riskArea: RiskArea;
  patientAnswers: PatientAnswer[];
  patientScreeningToolId: string;
  screeningToolScoreRangeId: string;
  screeningToolScoreRange: ScreeningToolScoreRange;
  scoredAt: string;

  static tableName = 'patient_screening_tool_submission';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      screeningToolId: { type: 'string' },
      screeningToolScoreRangeId: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      score: { type: 'integer' },
      deletedAt: { type: 'string' },
      scoredAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    screeningTool: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'patient_screening_tool_submission.screeningToolId',
        to: 'screening_tool.id',
      },
    },

    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_screening_tool_submission.patientId',
        to: 'patient.id',
      },
    },

    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_screening_tool_submission.userId',
        to: 'user.id',
      },
    },

    riskArea: {
      relation: Model.HasOneThroughRelation,
      modelClass: 'risk-area',
      join: {
        from: 'patient_screening_tool_submission.screeningToolId',
        through: {
          modelClass: 'screening-tool',
          from: 'screening_tool.id',
          to: 'screening_tool.riskAreaId',
        },
        to: 'risk_area.id',
      },
    },

    patientAnswers: {
      relation: Model.HasManyRelation,
      modelClass: 'patient-answer',
      join: {
        from: 'patient_screening_tool_submission.id',
        to: 'patient_answer.patientScreeningToolSubmissionId',
      },
    },

    carePlanSuggestions: {
      relation: Model.HasManyRelation,
      modelClass: 'care-plan-suggestion',
      join: {
        from: 'patient_screening_tool_submission.id',
        to: 'care_plan_suggestion.patientScreeningToolSubmissionId',
      },
    },

    screeningToolScoreRange: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'screening-tool-score-range',
      join: {
        from: 'patient_screening_tool_submission.screeningToolScoreRangeId',
        to: 'screening_tool_score_range.id',
      },
    },
  };

  static calculateScore(patientAnswers: PatientAnswer[]): number {
    return reduce(
      patientAnswers,
      (total, patientAnswer) => {
        const answerValue = parseInt(patientAnswer.answer.value, 10);

        if (isInteger(answerValue)) {
          return total + answerValue;
        } else {
          return total;
        }
      },
      0,
    );
  }

  static async create(
    input: IPatientScreeningToolSubmissionCreateFields,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async autoOpenIfRequired(
    input: IPatientScreeningToolSubmissionCreateFields,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    const { patientId, userId } = input;

    const existingScreeningToolSubmission = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({
        deletedAt: null,
        scoredAt: null,
        score: null,
        patientId,
        userId,
      });

    if (!existingScreeningToolSubmission) {
      return await this.create(input, txn);
    }

    return existingScreeningToolSubmission;
  }

  static async submitScore(
    patientScreeningToolSubmissionId: string,
    input: IPatientScreeningToolSubmissionScoreFields,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    let score: number = 0;
    const { patientAnswers } = input;

    const patientScreeningToolSubmission = await this.query(txn).findOne({
      id: patientScreeningToolSubmissionId,
      deletedAt: null,
    });

    if (!patientScreeningToolSubmission) {
      return Promise.reject('Invalid screening tool submission id');
    }
    if (patientScreeningToolSubmission.score) {
      return Promise.reject('Screening tool has already been scored, create a new submission');
    }

    if (!!input.score) {
      score = input.score;
    } else if (patientAnswers) {
      score = this.calculateScore(patientAnswers);
    } else {
      return Promise.reject('Either a score or patient answers are required');
    }

    const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      score,
      patientScreeningToolSubmission.screeningToolId,
      txn,
    );

    const screeningToolScoreRangeId = screeningToolScoreRange
      ? screeningToolScoreRange.id
      : undefined;

    const submission = await this.query(txn)
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientScreeningToolSubmissionId, {
        score,
        screeningToolScoreRangeId,
        scoredAt: new Date().toISOString(),
      });

    await createSuggestionsForPatientScreeningToolSubmission(
      submission.patientId,
      submission.id,
      txn,
    );
    return submission;
  }

  static async get(
    patientScreeningToolSubmissionId: string,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    const patientScreeningToolSubmission = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: patientScreeningToolSubmissionId, deletedAt: null });

    if (!patientScreeningToolSubmission) {
      return Promise.reject(
        `No such patient screening tool submission: ${patientScreeningToolSubmissionId}`,
      );
    }

    return patientScreeningToolSubmission;
  }

  static async getForPatient(
    patientId: string,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns *all* submissions (including deleted ones)
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId })
      .orderBy('createdAt', 'asc');
  }

  static async getForPatientAndScreeningTool(
    patientId: string,
    screeningToolId: string,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns *all* submissions (including deleted ones)
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, screeningToolId })
      .orderBy('createdAt', 'asc');
  }

  static async getLatestForPatientAndScreeningTool(
    screeningToolId: string,
    patientId: string,
    scored: boolean,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission | null> {
    const query = this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, screeningToolId });

    if (scored) {
      query.whereNotNull('scoredAt');
    } else {
      query.andWhere({ scoredAt: null, score: null });
    }
    const latestPatientScreeningToolSubmission = await query.orderBy('createdAt', 'desc').first();

    if (!latestPatientScreeningToolSubmission) {
      return null;
    }

    return latestPatientScreeningToolSubmission;
  }

  static async getAll(txn?: Transaction): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns only current submissions (not deleted ones)
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async delete(
    patientScreeningToolSubmissionId: string,
    txn?: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    await this.query(txn)
      .where({ id: patientScreeningToolSubmissionId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const patientScreeningToolSubmission = await this.query(txn).findById(
      patientScreeningToolSubmissionId,
    );
    if (!patientScreeningToolSubmission) {
      return Promise.reject(
        `No such patientScreeningToolSubmission: ${patientScreeningToolSubmissionId}`,
      );
    }
    return patientScreeningToolSubmission;
  }
}
/* tslint:enable:member-ordering */
