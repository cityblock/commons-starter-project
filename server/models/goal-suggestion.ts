import { uniqBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import CarePlanSuggestion from './care-plan-suggestion';
import GoalSuggestionTemplate from './goal-suggestion-template';
import PatientGoal from './patient-goal';
import ScreeningToolScoreRange from './screening-tool-score-range';

interface IGoalSuggestionEditableFields {
  goalSuggestionTemplateId: string;
  answerId?: string;
  screeningToolScoreRangeId?: string;
}

const EAGER_QUERY = 'goalSuggestionTemplate.[taskTemplates]';

// NOTE: Does not extend base model since GoalSuggestions should never be updated
/* tslint:disable:member-ordering */
export default class GoalSuggestion extends Model {
  id!: string;
  createdAt!: string;
  deletedAt!: string;
  goalSuggestionTemplateId!: string;
  goalSuggestionTemplate!: GoalSuggestionTemplate;
  answerId!: string;
  answer!: Answer;
  screeningToolScoreRangeId!: string;
  screeningToolScoreRange!: ScreeningToolScoreRange;

  static tableName = 'goal_suggestion';
  static hasPHI = false;
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string' },
      screeningToolScoreRangeId: { type: 'string' },
      goalSuggestionTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['goalSuggestionTemplateId'],
    oneOf: [{ required: ['answerId'] }, { required: ['screeningToolScoreRangeId'] }],
  };

  static get relationMappings(): RelationMappings {
    return {
      goalSuggestionTemplate: {
        relation: Model.HasOneRelation,
        modelClass: GoalSuggestionTemplate,
        join: {
          from: 'goal_suggestion.goalSuggestionTemplateId',
          to: 'goal_suggestion_template.id',
        },
      },
      answer: {
        relation: Model.HasOneRelation,
        modelClass: Answer,
        join: {
          from: 'goal_suggestion.answerId',
          to: 'answer.id',
        },
      },
      screeningToolScoreRange: {
        relation: Model.HasOneRelation,
        modelClass: ScreeningToolScoreRange,
        join: {
          from: 'goal_suggestion.screeningToolScoreRangeId',
          to: 'screening_tool_score_range.id',
        },
      },
    };
  }

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  static async getForGoalSuggestion(
    goalSuggestionTemplateId: string,
    txn: Transaction,
  ): Promise<Answer[]> {
    const goalSuggestionAnswers = await GoalSuggestion.query(txn)
      .where('goalSuggestionTemplateId', goalSuggestionTemplateId)
      .andWhere('deletedAt', null)
      .eager('answer')
      .orderBy('createdAt', 'asc');
    return goalSuggestionAnswers.map((goalSuggestion: GoalSuggestion) => goalSuggestion.answer);
  }

  static async getForAnswer(answerId: string, txn: Transaction): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestionAnswers = (await GoalSuggestion.query(txn)
      .where('answerId', answerId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager(EAGER_QUERY)) as any;
    return goalSuggestionAnswers.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getForScreeningToolScoreRange(
    screeningToolScoreRangeId: string,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestionAnswers = (await GoalSuggestion.query(txn)
      .where('screeningToolScoreRangeId', screeningToolScoreRangeId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager(EAGER_QUERY)) as any;
    return goalSuggestionAnswers.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewSuggestionsForRiskAreaAssessmentSubmission(
    patientId: string,
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestions = (await this.getAnswerGoalSuggestionsQuery(patientId, txn).andWhere(
      'patient_answer.riskAreaAssessmentSubmissionId',
      riskAreaAssessmentSubmissionId,
    )) as GoalSuggestion[];

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewSuggestionsForPatientScreeningToolSubmission(
    patientId: string,
    patientScreeningToolSubmissionId: string,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const currentGoalSuggestionTemplateIdsQuery = this.currentGoalSuggestionTemplateIdsQuery(
      patientId,
      txn,
    );

    const currentPatientGoalTemplateIdsQuery = this.currentPatientGoalTemplateIdsQuery(
      patientId,
      txn,
    );

    // goal suggestions based on answers
    const answerGoalSuggestions = (await this.getAnswerGoalSuggestionsQuery(
      patientId,
      txn,
    ).andWhere(
      'patient_answer.patientScreeningToolSubmissionId',
      patientScreeningToolSubmissionId,
    )) as GoalSuggestion[];

    // goal suggestions based on score ranges
    const scoreRangeGoalSuggestions = (await this.query(txn)
      .eager(EAGER_QUERY)
      .joinRelation('screeningToolScoreRange')
      .join(
        'patient_screening_tool_submission',
        'screeningToolScoreRange.id',
        'patient_screening_tool_submission.screeningToolScoreRangeId',
      )
      .whereNotIn('goal_suggestion.goalSuggestionTemplateId', currentGoalSuggestionTemplateIdsQuery)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        currentPatientGoalTemplateIdsQuery,
      )
      .andWhere(
        'patient_screening_tool_submission.id',
        patientScreeningToolSubmissionId,
      )) as GoalSuggestion[];

    const uniqueGoalSuggestions = uniqBy(
      answerGoalSuggestions.concat(scoreRangeGoalSuggestions),
      'goalSuggestionTemplateId',
    );

    return uniqueGoalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewSuggestionsForPatientAnswer(
    patientId: string,
    patientAnswerId: string,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestions = (await this.getAnswerGoalSuggestionsQuery(patientId, txn).andWhere(
      'patient_answer.id',
      patientAnswerId,
    )) as GoalSuggestion[];

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async create(
    input: IGoalSuggestionEditableFields,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const { goalSuggestionTemplateId, answerId, screeningToolScoreRangeId } = input;

    const relations = await GoalSuggestion.query(txn).where({
      goalSuggestionTemplateId,
      answerId: answerId || null,
      screeningToolScoreRangeId: screeningToolScoreRangeId || null,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await GoalSuggestion.query(txn).insert({
        goalSuggestionTemplateId,
        answerId,
        screeningToolScoreRangeId,
      });
    }

    if (answerId) {
      return this.getForAnswer(answerId, txn);
    } else if (screeningToolScoreRangeId) {
      return this.getForScreeningToolScoreRange(screeningToolScoreRangeId, txn);
    } else {
      return [];
    }
  }

  static async delete(
    {
      goalSuggestionTemplateId,
      answerId,
      screeningToolScoreRangeId,
    }: IGoalSuggestionEditableFields,
    txn: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    await this.query(txn)
      .where({
        goalSuggestionTemplateId,
        answerId: answerId || null,
        screeningToolScoreRangeId: screeningToolScoreRangeId || null,
        deletedAt: null,
      })
      .patch({ deletedAt: new Date().toISOString() });

    if (answerId) {
      return this.getForAnswer(answerId, txn);
    } else if (screeningToolScoreRangeId) {
      return this.getForScreeningToolScoreRange(screeningToolScoreRangeId, txn);
    } else {
      return [];
    }
  }

  static getAnswerGoalSuggestionsQuery(patientId: string, txn: Transaction) {
    const currentGoalSuggestionTemplateIdsQuery = this.currentGoalSuggestionTemplateIdsQuery(
      patientId,
      txn,
    );
    const currentPatientGoalTemplateIdsQuery = this.currentPatientGoalTemplateIdsQuery(
      patientId,
      txn,
    );

    return this.query(txn)
      .eager('goalSuggestionTemplate.[taskTemplates]')
      .joinRelation('answer')
      .join('patient_answer', 'answer.id', 'patient_answer.answerId')
      .whereNotIn('goal_suggestion.goalSuggestionTemplateId', currentGoalSuggestionTemplateIdsQuery)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        currentPatientGoalTemplateIdsQuery,
      )
      .andWhere('patient_answer.deletedAt', null)
      .andWhere('patient_answer.patientId', patientId)
      .andWhere('patient_answer.applicable', true);
  }

  /**
   * Get goal suggestion template ids in care plan suggestions
   */
  static currentGoalSuggestionTemplateIdsQuery(patientId: string, txn: Transaction) {
    return CarePlanSuggestion.query(txn)
      .whereNotNull('goalSuggestionTemplateId') // should not be null but we need to be 100% sure
      .andWhere('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'goal')
      .select('goalSuggestionTemplateId');
  }

  /**
   * Get goal suggestion template ids in goals in the care plan
   */
  static currentPatientGoalTemplateIdsQuery(patientId: string, txn: Transaction) {
    return PatientGoal.query(txn)
      .whereNotNull('goalSuggestionTemplateId')
      .andWhere('patientId', patientId)
      .andWhere('deletedAt', null)
      .select('goalSuggestionTemplateId');
  }
}
/* tslint:enable:member-ordering */
