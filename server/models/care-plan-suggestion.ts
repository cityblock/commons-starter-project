import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import ComputedField from './computed-field';
import Concern from './concern';
import GoalSuggestionTemplate from './goal-suggestion-template';
import Patient from './patient';
import PatientConcern from './patient-concern';
import PatientScreeningToolSubmission from './patient-screening-tool-submission';
import RiskAreaAssessmentSubmission from './risk-area-assessment-submission';
import User from './user';

type SuggestionType = 'concern' | 'goal';

export interface ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission {
  patientId: string;
  suggestionType: SuggestionType;
  concernId?: string;
  goalSuggestionTemplateId?: string;
  patientScreeningToolSubmissionId: string;
  type: 'patientScreeningToolSubmission';
}

export interface ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission {
  patientId: string;
  suggestionType: SuggestionType;
  concernId?: string;
  goalSuggestionTemplateId?: string;
  riskAreaAssessmentSubmissionId: string;
  type: 'riskAreaAssessmentSubmission';
}

export interface ICarePlanSuggestionCreateArgsForComputedFieldAnswer {
  patientId: string;
  suggestionType: SuggestionType;
  concernId?: string;
  goalSuggestionTemplateId?: string;
  computedFieldId: string;
  type: 'computedFieldAnswer';
}

type ICarePlanSuggestionCreateArgs =
  | ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission
  | ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission
  | ICarePlanSuggestionCreateArgsForComputedFieldAnswer;

interface ICarePlanSuggestionCreateMultipleArgs {
  suggestions:
    | ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission[]
    | ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission[]
    | ICarePlanSuggestionCreateArgsForComputedFieldAnswer[];
}

interface ICarePlanSuggestionDismissArgs {
  carePlanSuggestionId: string;
  dismissedById: string;
  dismissedReason: string;
}

export const EAGER_QUERY =
  '[patient.[patientInfo], concern, goalSuggestionTemplate.[taskTemplates], acceptedBy, dismissedBy]';

export const SUPER_EAGER_QUERY =
  '[patient.[patientInfo], concern, goalSuggestionTemplate.[taskTemplates], acceptedBy, dismissedBy, patientScreeningToolSubmission.[screeningTool], riskAreaAssessmentSubmission.[riskArea], computedField]';

/* tslint:disable:member-ordering */
export default class CarePlanSuggestion extends BaseModel {
  patientId: string;
  patient: Patient;
  suggestionType: SuggestionType;
  concernId: string | null;
  concern: Concern | null;
  goalSuggestionTemplateId: string | null;
  goalSuggestionTemplate: GoalSuggestionTemplate | null;
  acceptedById: string | null;
  acceptedBy: User | null;
  acceptedAt: string | null;
  dismissedById: string | null;
  dismissedBy: User | null;
  dismissedReason: string | null;
  dismissedAt: string | null;
  patientScreeningToolSubmissionId: string | null;
  patientScreeningToolSubmission: PatientScreeningToolSubmission | null;
  riskAreaAssessmentSubmissionId: string | null;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission | null;
  computedFieldId: string | null;
  computedField: ComputedField | null;

  static tableName = 'care_plan_suggestion';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      suggestionType: { type: 'string' },
      concernId: { type: 'string', format: 'uuid' },
      goalSuggestionTemplateId: { type: 'string', format: 'uuid' },
      dismissedById: { type: 'string', format: 'uuid' },
      dismissedReason: { type: 'string' },
      dismissedAt: { type: 'string' },
      acceptedAt: { type: 'string' },
      acceptedById: { type: 'string', format: 'uuid' },
      patientScreeningToolSubmissionId: { type: 'string', format: 'uuid' },
      riskAreaAssessmentSubmissionId: { type: 'string', format: 'uuid' },
      computedFieldId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'suggestionType'],
    oneOf: [
      { required: ['patientScreeningToolSubmissionId'] },
      { required: ['riskAreaAssessmentSubmissionId'] },
      { required: ['computedFieldId'] },
    ],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'care_plan_suggestion.patientId',
        to: 'patient.id',
      },
    },
    concern: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'concern',
      join: {
        from: 'care_plan_suggestion.concernId',
        to: 'concern.id',
      },
    },
    goalSuggestionTemplate: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'goal-suggestion-template',
      join: {
        from: 'care_plan_suggestion.goalSuggestionTemplateId',
        to: 'goal_suggestion_template.id',
      },
    },
    acceptedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'care_plan_suggestion.acceptedById',
        to: 'user.id',
      },
    },
    dismissedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'care_plan_suggestion.dismissedById',
        to: 'user.id',
      },
    },
    patientScreeningToolSubmission: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-screening-tool-submission',
      join: {
        from: 'care_plan_suggestion.patientScreeningToolSubmissionId',
        to: 'patient_screening_tool_submission.id',
      },
    },
    riskAreaAssessmentSubmission: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'risk-area-assessment-submission',
      join: {
        from: 'care_plan_suggestion.riskAreaAssessmentSubmissionId',
        to: 'risk_area_assessment_submission.id',
      },
    },
    computedField: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'computed-field',
      join: {
        from: 'care_plan_suggestion.computedFieldId',
        to: 'computed_field.id',
      },
    },
  };

  static async get(
    carePlanSuggestionId: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion | undefined> {
    const carePlanSuggestion = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(carePlanSuggestionId);

    if (!carePlanSuggestion) {
      return Promise.reject(`No such carePlanSuggestion: ${carePlanSuggestionId}`);
    }
    return carePlanSuggestion;
  }

  static async findForPatientAndConcern(
    patientId: string,
    concernId: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion | undefined> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ patientId, concernId, acceptedAt: null, dismissedAt: null });
  }

  static async create(
    input: ICarePlanSuggestionCreateArgs,
    txn: Transaction,
  ): Promise<CarePlanSuggestion> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async createMultiple(
    input: ICarePlanSuggestionCreateMultipleArgs,
    txn: Transaction,
  ): Promise<CarePlanSuggestion[]> {
    const { suggestions } = input;
    return this.query(txn).insertGraphAndFetch(suggestions);
  }

  static async getForPatient(patientId: string, txn: Transaction): Promise<CarePlanSuggestion[]> {
    // filter out patient concerns
    // unlike for goals, which come from goal suggesion templates, users can add concerns directly
    const existingPatientConcernIdsQuery = PatientConcern.query(txn)
      .where({ patientId, deletedAt: null })
      .select('concernId')
      .orderBy('createdAt', 'asc');

    return this.query(txn)
      .eager(SUPER_EAGER_QUERY)
      .where({
        dismissedAt: null,
        acceptedAt: null,
        patientId,
        goalSuggestionTemplateId: null, // ensure goalSuggestionTemplateId is null
      })
      .whereNotIn('concernId', existingPatientConcernIdsQuery)
      .orWhere({
        dismissedAt: null,
        acceptedAt: null,
        patientId,
        concernId: null, // ensure concernId is null
      })
      .orderBy('createdAt', 'asc');
  }

  // For concern suggestions, marks all not-accepted suggestions with that concern as accepted
  // For goal suggestions, marks all non-accepted suggests for that goal suggestion template as accepted
  static async accept(
    carePlanSuggestion: CarePlanSuggestion,
    acceptedById: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion | undefined> {
    if (carePlanSuggestion.concernId) {
      await this.query(txn)
        .where({
          acceptedAt: null,
          dismissedAt: null,
          patientId: carePlanSuggestion.patientId,
          concernId: carePlanSuggestion.concernId,
        })
        .patch({
          acceptedAt: new Date().toISOString(),
          acceptedById,
        });
    } else if (carePlanSuggestion.goalSuggestionTemplateId) {
      await this.query(txn)
        .where({
          acceptedAt: null,
          dismissedAt: null,
          patientId: carePlanSuggestion.patientId,
          goalSuggestionTemplateId: carePlanSuggestion.goalSuggestionTemplateId,
        })
        .patch({
          acceptedAt: new Date().toISOString(),
          acceptedById,
        });
    }
    return this.get(carePlanSuggestion.id, txn);
  }

  static async dismiss(
    input: ICarePlanSuggestionDismissArgs,
    txn: Transaction,
  ): Promise<CarePlanSuggestion> {
    const { carePlanSuggestionId, dismissedById, dismissedReason } = input;

    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(carePlanSuggestionId, {
        dismissedById,
        dismissedReason,
        dismissedAt: new Date().toISOString(),
      });
  }

  static async getPatientIdForResource(
    carePlanSuggestionId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn).findById(carePlanSuggestionId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
