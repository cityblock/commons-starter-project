import { Model, RelationMappings, Transaction } from 'objection';
import { createSuggestionsForRiskAreaAssessmentSubmission } from '../lib/suggestions';
import BaseModel from './base-model';
import CarePlanSuggestion from './care-plan-suggestion';
import Patient from './patient';
import PatientAnswer from './patient-answer';
import RiskArea from './risk-area';
import User from './user';

interface IRiskAreaAssessmentSubmissionCreateFields {
  riskAreaId: string;
  patientId: string;
  userId: string;
}

export const EAGER_QUERY =
  '[patient.[patientInfo, patientState], user, riskArea, patientAnswers, carePlanSuggestions.[patient.[patientInfo, patientState], concern, goalSuggestionTemplate.[taskTemplates]]]';

/* tslint:disable:member-ordering */
export default class RiskAreaAssessmentSubmission extends BaseModel {
  riskAreaId: string;
  riskArea: RiskArea;
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  patientAnswers: PatientAnswer[];
  completedAt: string;
  carePlanSuggestions: CarePlanSuggestion[];

  static tableName = 'risk_area_assessment_submission';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      riskAreaId: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      completedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['riskAreaId', 'patientId', 'userId'],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'risk_area_assessment_submission.patientId',
        to: 'patient.id',
      },
    },

    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'risk_area_assessment_submission.userId',
        to: 'user.id',
      },
    },

    riskArea: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'risk-area',
      join: {
        from: 'risk_area_assessment_submission.riskAreaId',
        to: 'risk_area.id',
      },
    },

    patientAnswers: {
      relation: Model.HasManyRelation,
      modelClass: 'patient-answer',
      join: {
        from: 'risk_area_assessment_submission.id',
        to: 'patient_answer.riskAreaAssessmentSubmissionId',
      },
    },

    carePlanSuggestions: {
      relation: Model.HasManyRelation,
      modelClass: 'care-plan-suggestion',
      join: {
        from: 'risk_area_assessment_submission.id',
        to: 'care_plan_suggestion.riskAreaAssessmentSubmissionId',
      },
    },
  };

  static async create(
    input: IRiskAreaAssessmentSubmissionCreateFields,
    txn: Transaction,
  ): Promise<RiskAreaAssessmentSubmission> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async autoOpenIfRequired(
    input: IRiskAreaAssessmentSubmissionCreateFields,
    txn: Transaction,
  ): Promise<RiskAreaAssessmentSubmission> {
    const { patientId, userId, riskAreaId } = input;

    const existingRiskAreaAssessmentSubmission = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({
        deletedAt: null,
        completedAt: null,
        patientId,
        userId,
        riskAreaId,
      });

    if (!existingRiskAreaAssessmentSubmission) {
      return this.create(input, txn);
    }

    return existingRiskAreaAssessmentSubmission;
  }

  static async complete(
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<RiskAreaAssessmentSubmission> {
    const riskAreaAssessmentSubmission = await this.query(txn).findOne({
      id: riskAreaAssessmentSubmissionId,
      deletedAt: null,
    });

    if (!riskAreaAssessmentSubmission) {
      return Promise.reject('Invalid risk area assessment submission id');
    }
    if (riskAreaAssessmentSubmission.completedAt) {
      return Promise.reject(
        'Risk area assessment has already been completed, create a new submission',
      );
    }

    const submission = await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(riskAreaAssessmentSubmissionId, {
        completedAt: new Date().toISOString(),
      });

    await createSuggestionsForRiskAreaAssessmentSubmission(
      submission.patientId,
      submission.id,
      txn,
    );
    return this.get(riskAreaAssessmentSubmissionId, txn);
  }

  static async get(
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<RiskAreaAssessmentSubmission> {
    const riskAreaAssessmentSubmission = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: riskAreaAssessmentSubmissionId, deletedAt: null });

    if (!riskAreaAssessmentSubmission) {
      return Promise.reject(
        `No such risk area assessment submission: ${riskAreaAssessmentSubmissionId}`,
      );
    }

    return riskAreaAssessmentSubmission;
  }

  static async getLatestForPatient(
    riskAreaId: string,
    patientId: string,
    completed: boolean,
    txn: Transaction,
  ): Promise<RiskAreaAssessmentSubmission | null> {
    const query = this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, riskAreaId });

    if (completed) {
      query.whereNotNull('completedAt');
    } else {
      query.andWhere({ completedAt: null });
    }
    const latestRiskAreaAssessmentSubmission = await query.orderBy('createdAt', 'desc').first();

    if (!latestRiskAreaAssessmentSubmission) {
      return null;
    }

    return latestRiskAreaAssessmentSubmission;
  }

  static async delete(
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<RiskAreaAssessmentSubmission> {
    await this.query(txn)
      .where({ id: riskAreaAssessmentSubmissionId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const riskAreaAssessmentSubmission = await this.query(txn).findById(
      riskAreaAssessmentSubmissionId,
    );
    if (!riskAreaAssessmentSubmission) {
      return Promise.reject(
        `No such riskAreaAssessmentSubmission: ${riskAreaAssessmentSubmissionId}`,
      );
    }
    return riskAreaAssessmentSubmission;
  }

  static async getPatientIdForResource(
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(riskAreaAssessmentSubmissionId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
