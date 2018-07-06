import { Model, QueryBuilder, RelationMappings, Transaction } from 'objection';
import { CarePlanSuggestionType } from 'schema';
import BaseModel from './base-model';
import ComputedField from './computed-field';
import Concern from './concern';
import GoalSuggestionTemplate from './goal-suggestion-template';
import Patient from './patient';
import PatientConcern from './patient-concern';
import PatientScreeningToolSubmission from './patient-screening-tool-submission';
import RiskArea from './risk-area';
import RiskAreaAssessmentSubmission from './risk-area-assessment-submission';
import ScreeningTool from './screening-tool';
import User from './user';

export interface ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission {
  patientId: string;
  suggestionType: CarePlanSuggestionType;
  concernId?: string;
  goalSuggestionTemplateId?: string;
  patientScreeningToolSubmissionId: string;
  type: 'patientScreeningToolSubmission';
}

export interface ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission {
  patientId: string;
  suggestionType: CarePlanSuggestionType;
  concernId?: string;
  goalSuggestionTemplateId?: string;
  riskAreaAssessmentSubmissionId: string;
  type: 'riskAreaAssessmentSubmission';
}

export interface ICarePlanSuggestionCreateArgsForComputedFieldAnswer {
  patientId: string;
  suggestionType: CarePlanSuggestionType;
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

interface ICarePlanSuggestionAcceptGoalArgs {
  goalSuggestionTemplateId: string;
  patientId: string;
  acceptedById: string;
}

interface ICarePlanSuggestionAcceptConcernArgs {
  concernId: string;
  patientId: string;
  acceptedById: string;
}

export const EAGER_QUERY =
  '[patient.[patientInfo, patientState], concern, goalSuggestionTemplate.[taskTemplates], acceptedBy, dismissedBy]';

/* tslint:disable:member-ordering */
export default class CarePlanSuggestion extends BaseModel {
  patientId!: string;
  patient!: Patient;
  suggestionType!: CarePlanSuggestionType;
  concernId!: string | null;
  concern!: Concern | null;
  goalSuggestionTemplateId!: string | null;
  goalSuggestionTemplate!: GoalSuggestionTemplate | null;
  acceptedById!: string | null;
  acceptedBy!: User | null;
  acceptedAt!: string | null;
  dismissedById!: string | null;
  dismissedBy!: User | null;
  dismissedReason!: string | null;
  dismissedAt!: string | null;
  patientScreeningToolSubmissionId!: string | null;
  screeningTool!: ScreeningTool | null;
  riskAreaAssessmentSubmissionId!: string | null;
  riskArea!: RiskArea | null;
  computedFieldId!: string | null;
  computedField!: ComputedField | null;

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
      dismissedReason: { type: 'string', minLength: 1 },
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

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'care_plan_suggestion.patientId',
          to: 'patient.id',
        },
      },
      concern: {
        relation: Model.BelongsToOneRelation,
        modelClass: Concern,
        join: {
          from: 'care_plan_suggestion.concernId',
          to: 'concern.id',
        },
      },
      goalSuggestionTemplate: {
        relation: Model.BelongsToOneRelation,
        modelClass: GoalSuggestionTemplate,
        join: {
          from: 'care_plan_suggestion.goalSuggestionTemplateId',
          to: 'goal_suggestion_template.id',
        },
      },
      acceptedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'care_plan_suggestion.acceptedById',
          to: 'user.id',
        },
      },
      dismissedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'care_plan_suggestion.dismissedById',
          to: 'user.id',
        },
      },
      screeningTool: {
        relation: Model.HasOneThroughRelation,
        modelClass: ScreeningTool,
        join: {
          from: 'care_plan_suggestion.patientScreeningToolSubmissionId',
          through: {
            modelClass: PatientScreeningToolSubmission,
            from: 'patient_screening_tool_submission.id',
            to: 'patient_screening_tool_submission.screeningToolId',
          },
          to: 'screening_tool.id',
        },
      },
      riskArea: {
        relation: Model.HasOneThroughRelation,
        modelClass: RiskArea,
        join: {
          from: 'care_plan_suggestion.riskAreaAssessmentSubmissionId',
          through: {
            modelClass: RiskAreaAssessmentSubmission,
            from: 'risk_area_assessment_submission.id',
            to: 'risk_area_assessment_submission.riskAreaId',
          },
          to: 'risk_area.id',
        },
      },
      computedField: {
        relation: Model.BelongsToOneRelation,
        modelClass: ComputedField,
        join: {
          from: 'care_plan_suggestion.computedFieldId',
          to: 'computed_field.id',
        },
      },
    };
  }

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
  ): Promise<CarePlanSuggestion[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ patientId, concernId, acceptedAt: null, dismissedAt: null });
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

  static async getForPatient(
    queryBuilder: QueryBuilder<CarePlanSuggestion, CarePlanSuggestion[], CarePlanSuggestion[]>,
    patientId: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion[]> {
    // filter out patient concerns
    // unlike for goals, which come from goal suggesion templates, users can add concerns directly
    const existingPatientConcernIdsQuery = PatientConcern.query(txn)
      .where({ patientId, deletedAt: null })
      .select('concernId')
      .orderBy('createdAt', 'desc');

    return queryBuilder
      .where({ dismissedAt: null, acceptedAt: null, 'care_plan_suggestion.patientId': patientId })
      .where(builder => {
        builder
          .where('goalSuggestionTemplateId', null)
          .whereNotIn('concernId', existingPatientConcernIdsQuery)
          .orWhere('concernId', null);
      })
      .orderBy('createdAt', 'desc');
  }

  static async getFromRiskAreaAssessmentsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion[]> {
    const queryBuilder = this.query(txn)
      .eager(EAGER_QUERY)
      .mergeEager('riskArea')
      .whereNotNull('riskAreaAssessmentSubmissionId');

    return this.getForPatient(queryBuilder, patientId, txn);
  }

  static async getFromScreeningToolsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion[]> {
    const queryBuilder = this.query(txn)
      .eager(EAGER_QUERY)
      .mergeEager('screeningTool')
      .whereNotNull('patientScreeningToolSubmissionId');

    return this.getForPatient(queryBuilder, patientId, txn);
  }

  static async getFromComputedFieldsForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<CarePlanSuggestion[]> {
    const queryBuilder = this.query(txn)
      .eager(EAGER_QUERY)
      .mergeEager('computedField.[riskArea]')
      .innerJoinRelation('computedField.question')
      .whereNull('computedField:question.deletedAt')
      .whereNull('computedField.deletedAt') as any;

    return this.getForPatient(queryBuilder, patientId, txn);
  }

  // For concern suggestions, marks all not-accepted suggestions with that concern as accepted
  static async acceptForConcern(
    { concernId, patientId, acceptedById }: ICarePlanSuggestionAcceptConcernArgs,
    txn: Transaction,
  ): Promise<number> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({
        acceptedAt: null,
        dismissedAt: null,
        patientId,
        concernId,
      })
      .patch({
        acceptedAt: new Date().toISOString(),
        acceptedById,
      });
  }

  // For goal suggestions, marks all non-accepted suggests for that goal suggestion template as accepted
  static async acceptForGoal(
    { goalSuggestionTemplateId, patientId, acceptedById }: ICarePlanSuggestionAcceptGoalArgs,
    txn: Transaction,
  ): Promise<number> {
    return this.query(txn)
      .where({
        acceptedAt: null,
        dismissedAt: null,
        patientId,
        goalSuggestionTemplateId,
      })
      .patch({
        acceptedAt: new Date().toISOString(),
        acceptedById,
      });
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
