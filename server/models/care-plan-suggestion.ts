import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Concern from './concern';
import GoalSuggestionTemplate from './goal-suggestion-template';
import Patient from './patient';
import PatientConcern from './patient-concern';
import PatientGoal from './patient-goal';
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
  '[patient, concern, goalSuggestionTemplate.[taskTemplates], acceptedBy, dismissedBy]';

/* tslint:disable:member-ordering */
export default class CarePlanSuggestion extends BaseModel {
  patientId: string;
  patient: Patient;
  suggestionType: SuggestionType;
  concernId?: string;
  concern?: Concern;
  goalSuggestionTemplateId?: string;
  goalSuggestionTemplate?: GoalSuggestionTemplate;
  acceptedById?: string;
  acceptedBy?: User;
  acceptedAt?: string;
  dismissedById?: string;
  dismissedBy?: User;
  dismissedReason?: string;
  dismissedAt?: string;
  patientScreeningToolSubmissionId?: string;
  computedFieldId?: string;

  static tableName = 'care_plan_suggestion';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      suggestionType: { type: 'string' },
      concernId: { type: 'string' },
      goalSuggestionTemplateId: { type: 'string' },
      dismissedById: { type: 'string' },
      dismissedReason: { type: 'string' },
      dismissedAt: { type: 'string' },
      acceptedAt: { type: 'string' },
      acceptedById: { type: 'string' },
      patientScreeningToolSubmissionId: { type: 'string' },
      riskAreaAssessmentSubmissionId: { type: 'string' },
      computedFieldId: { type: 'string' },
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
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'care_plan_suggestion.patientId',
        to: 'patient.id',
      },
    },
    concern: {
      relation: Model.HasOneRelation,
      modelClass: 'concern',
      join: {
        from: 'care_plan_suggestion.concernId',
        to: 'concern.id',
      },
    },
    goalSuggestionTemplate: {
      relation: Model.HasOneRelation,
      modelClass: 'goal-suggestion-template',
      join: {
        from: 'care_plan_suggestion.goalSuggestionTemplateId',
        to: 'goal_suggestion_template.id',
      },
    },
    acceptedBy: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'care_plan_suggestion.acceptedById',
        to: 'user.id',
      },
    },
    dismissedBy: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'care_plan_suggestion.dismissedById',
        to: 'user.id',
      },
    },
    patientScreeningToolSubmission: {
      relation: Model.HasOneRelation,
      modelClass: 'patient-screening-tool-submission',
      join: {
        from: 'care_plan_suggestion.patientScreeningToolSubmissionId',
        to: 'patient_screening_tool_submission.id',
      },
    },
  };

  static async get(
    carePlanSuggestionId: string,
    txn?: Transaction,
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
    txn?: Transaction,
  ): Promise<CarePlanSuggestion | undefined> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ patientId, concernId, acceptedAt: null, dismissedAt: null });
  }

  static async create(
    input: ICarePlanSuggestionCreateArgs,
    txn?: Transaction,
  ): Promise<CarePlanSuggestion> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async createMultiple(
    input: ICarePlanSuggestionCreateMultipleArgs,
    txn?: Transaction,
  ): Promise<CarePlanSuggestion[]> {
    const { suggestions } = input;
    return await this.query(txn).insertGraphAndFetch(suggestions);
  }

  static async getForPatient(patientId: string, txn?: Transaction): Promise<CarePlanSuggestion[]> {
    const existingPatientConcernIdsQuery = PatientConcern.query(txn)
      .where({ patientId, deletedAt: null })
      .select('concernId')
      .orderBy('createdAt', 'asc');

    const existingPatientGoalIdsQuery = PatientGoal.query(txn)
      .where({ patientId, deletedAt: null })
      .select('goalSuggestionTemplateId')
      .orderBy('createdAt', 'asc');

    return await this.query(txn)
      .eager(EAGER_QUERY)
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
      .whereNotIn('goalSuggestionTemplateId', existingPatientGoalIdsQuery)
      .orderBy('createdAt', 'asc');
  }

  static async accept(
    carePlanSuggestionId: string,
    acceptedById: string,
    txn?: Transaction,
  ): Promise<CarePlanSuggestion> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(carePlanSuggestionId, {
        acceptedAt: new Date().toISOString(),
        acceptedById,
      });
  }

  static async dismiss(
    input: ICarePlanSuggestionDismissArgs,
    txn?: Transaction,
  ): Promise<CarePlanSuggestion> {
    const { carePlanSuggestionId, dismissedById, dismissedReason } = input;

    return await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(carePlanSuggestionId, {
        dismissedById,
        dismissedReason,
        dismissedAt: new Date().toISOString(),
      });
  }
}
/* tslint:enable:member-ordering */
