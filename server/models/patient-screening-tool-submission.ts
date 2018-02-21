import { isInteger, reduce } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { createSuggestionsForPatientScreeningToolSubmission } from '../lib/suggestions';
import BaseModel from './base-model';
import CarePlanSuggestion from './care-plan-suggestion';
import Patient from './patient';
import PatientAnswer from './patient-answer';
import ProgressNote from './progress-note';
import ScreeningTool from './screening-tool';
import ScreeningToolScoreRange from './screening-tool-score-range';
import User from './user';

interface IPatientScreeningToolSubmissionCreateFields {
  screeningToolId: string;
  patientId: string;
  userId: string;
}

interface IPatientScreeningToolSubmissionScoreFields {
  patientAnswers: PatientAnswer[];
}

export const EAGER_QUERY =
  '[screeningTool, screeningToolScoreRange, patient.[patientInfo], user, patientAnswers, carePlanSuggestions.[patient.[patientInfo], concern, goalSuggestionTemplate.[taskTemplates]]]';

/* tslint:disable:member-ordering */
export default class PatientScreeningToolSubmission extends BaseModel {
  screeningToolId: string;
  screeningTool: ScreeningTool;
  progressNoteId: string;
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  score: number;
  patientAnswers: PatientAnswer[];
  patientScreeningToolId: string;
  screeningToolScoreRangeId: string;
  screeningToolScoreRange: ScreeningToolScoreRange;
  carePlanSuggestions: CarePlanSuggestion[];
  scoredAt: string;

  static tableName = 'patient_screening_tool_submission';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      screeningToolId: { type: 'string', minLength: 1 }, // cannot be blank
      screeningToolScoreRangeId: { type: 'string', minLength: 1 }, // cannot be blank
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      progressNoteId: { type: 'string' },
      score: { type: 'integer', minimum: 0 }, // cannot be negative
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      scoredAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['screeningToolId', 'patientId', 'userId'],
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
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch({ ...input });
  }

  static async autoOpenIfRequired(
    input: IPatientScreeningToolSubmissionCreateFields,
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    const { patientId, userId, screeningToolId } = input;

    const existingScreeningToolSubmission = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({
        deletedAt: null,
        scoredAt: null,
        score: null,
        patientId,
        userId,
        screeningToolId,
      });

    if (!existingScreeningToolSubmission) {
      return this.create(input, txn);
    }

    return existingScreeningToolSubmission;
  }

  static async submitScore(
    patientScreeningToolSubmissionId: string,
    input: IPatientScreeningToolSubmissionScoreFields,
    txn: Transaction,
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

    if (patientAnswers && patientAnswers.length > 0) {
      score = this.calculateScore(patientAnswers);
    } else {
      return Promise.reject('Patient answers are required');
    }

    const patientId = patientAnswers[0].patientId;
    const userId = patientAnswers[0].userId;

    const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      score,
      patientScreeningToolSubmission.screeningToolId,
      txn,
    );

    const screeningToolScoreRangeId = screeningToolScoreRange
      ? screeningToolScoreRange.id
      : undefined;

    const progressNote = await ProgressNote.autoOpenIfRequired({ patientId, userId }, txn);

    await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(patientScreeningToolSubmissionId)
      .patch({
        score,
        screeningToolScoreRangeId,
        scoredAt: new Date().toISOString(),
        progressNoteId: progressNote.id,
      });

    await createSuggestionsForPatientScreeningToolSubmission(
      patientId,
      patientScreeningToolSubmissionId,
      txn,
    );
    return this.get(patientScreeningToolSubmissionId, txn);
  }

  static async get(
    patientScreeningToolSubmissionId: string,
    txn: Transaction,
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
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns *all* submissions (including deleted ones)
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId })
      .orderBy('createdAt', 'asc');
  }

  static async getFor360(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission[]> {
    const PATIENT_QUERY = '[screeningTool, screeningToolScoreRange, user, riskArea]';

    const submissions = await this.query(txn)
      .eager(PATIENT_QUERY)
      .modifyEager('riskArea', builder => {
        builder.where({ 'risk_area.deletedAt': null });
      })
      .modifyEager('screeningTool', builder => {
        builder.where({ 'screening_tool.deletedAt': null });
      })
      .modifyEager('screeningToolScoreRanges', builder => {
        builder.where({ 'screening_tool_score_range.deletedAt': null });
      })
      .where({ patientId, 'patient_screening_tool_submission.deletedAt': null })
      .orderBy('createdAt', 'desc');

    return submissions;
  }

  static async getForPatientAndScreeningTool(
    patientId: string,
    screeningToolId: string,
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns *all* submissions (including deleted ones)
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, screeningToolId })
      .orderBy('createdAt', 'asc');
  }

  static async getLatestForPatientAndScreeningTool(
    screeningToolId: string,
    patientId: string,
    scored: boolean,
    txn: Transaction,
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

  static async getAll(txn: Transaction): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns only current submissions (not deleted ones)
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async delete(
    patientScreeningToolSubmissionId: string,
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission> {
    await this.query(txn)
      .where({ id: patientScreeningToolSubmissionId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

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

  static async getForProgressNote(
    progressNoteId: string,
    txn: Transaction,
  ): Promise<PatientScreeningToolSubmission[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where('progressNoteId', progressNoteId);
  }

  static async getPatientIdForResource(
    patientScreeningToolId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientScreeningToolId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
