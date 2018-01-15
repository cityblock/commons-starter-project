import { transaction, Model, RelationMappings, Transaction } from 'objection';
import Answer from './answer';
import BaseModel from './base-model';
import CarePlanSuggestion from './care-plan-suggestion';
import GoalSuggestionTemplate from './goal-suggestion-template';
import ScreeningToolScoreRange from './screening-tool-score-range';

interface IGoalSuggestionEditableFields {
  goalSuggestionTemplateId: string;
  answerId?: string;
  screeningToolScoreRangeId?: string;
}

/* tslint:disable:member-ordering */
export default class GoalSuggestion extends BaseModel {
  goalSuggestionTemplateId: string;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  answerId: string;
  answer: Answer;
  screeningToolScoreRangeId: string;
  screeningToolScoreRange: ScreeningToolScoreRange;

  static tableName = 'goal_suggestion';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string' },
      screeningToolScoreRangeId: { type: 'string' },
      goalSuggestionTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
    },
    required: ['goalSuggestionTemplateId'],
    oneOf: [{ required: ['answerId'] }, { required: ['screeningToolScoreRangeId'] }],
  };

  static relationMappings: RelationMappings = {
    goalSuggestionTemplate: {
      relation: Model.HasOneRelation,
      modelClass: 'goal-suggestion-template',
      join: {
        from: 'goal_suggestion.goalSuggestionTemplateId',
        to: 'goal_suggestion_template.id',
      },
    },
    answer: {
      relation: Model.HasOneRelation,
      modelClass: 'answer',
      join: {
        from: 'goal_suggestion.answerId',
        to: 'answer.id',
      },
    },
    screeningToolScoreRange: {
      relation: Model.HasOneRelation,
      modelClass: 'screening-tool-score-range',
      join: {
        from: 'goal_suggestion.screeningToolScoreRangeId',
        to: 'screening_tool_score_range.id',
      },
    },
  };

  static async getForGoalSuggestion(
    goalSuggestionTemplateId: string,
    txn?: Transaction,
  ): Promise<Answer[]> {
    const goalSuggestionAnswers = await GoalSuggestion.query(txn)
      .where('goalSuggestionTemplateId', goalSuggestionTemplateId)
      .andWhere('deletedAt', null)
      .eager('answer')
      .orderBy('createdAt', 'asc');
    return goalSuggestionAnswers.map((goalSuggestion: GoalSuggestion) => goalSuggestion.answer);
  }

  static async getForAnswer(
    answerId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestionAnswers = (await GoalSuggestion.query(txn)
      .where('answerId', answerId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('goalSuggestionTemplate')) as any;
    return goalSuggestionAnswers.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getForScreeningToolScoreRange(
    screeningToolScoreRangeId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestionAnswers = (await GoalSuggestion.query(txn)
      .where('screeningToolScoreRangeId', screeningToolScoreRangeId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('goalSuggestionTemplate')) as any;
    return goalSuggestionAnswers.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewSuggestionsForRiskAreaAssessmentSubmission(
    patientId: string,
    riskAreaAssessmentSubmissionId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const existingPatientCarePlanSuggestionsQuery = CarePlanSuggestion.query(txn)
      .where('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'goal')
      .select('goalSuggestionTemplateId');

    const goalSuggestions = (await this.query(txn)
      .eager('goalSuggestionTemplate.[taskTemplates]')
      .joinRelation('answer')
      .join('patient_answer', 'answer.id', 'patient_answer.answerId')
      .leftOuterJoin(
        'patient_goal',
        'goal_suggestion.goalSuggestionTemplateId',
        'patient_goal.goalSuggestionTemplateId',
      )
      .where('patient_answer.riskAreaAssessmentSubmissionId', riskAreaAssessmentSubmissionId)
      .andWhere('patient_answer.deletedAt', null)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        existingPatientCarePlanSuggestionsQuery,
      )
      .andWhere('patient_answer.patientId', patientId)
      .andWhere('patient_answer.applicable', true)
      .andWhere('patient_goal.id', null)) as GoalSuggestion[];

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewSuggestionsForPatientScreeningToolSubmission(
    patientId: string,
    patientScreeningToolSubmissionId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const existingPatientCarePlanSuggestionsQuery = CarePlanSuggestion.query(txn)
      .where('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'goal')
      .select('goalSuggestionTemplateId');

    // TODO: make this work in a 'union' query. Can't get it to act properly right now though.
    const goalSuggestions = (await this.query(txn)
      .eager('goalSuggestionTemplate.[taskTemplates]')
      .joinRelation('screeningToolScoreRange')
      .join(
        'patient_screening_tool_submission',
        'screeningToolScoreRange.id',
        'patient_screening_tool_submission.screeningToolScoreRangeId',
      )
      .leftOuterJoin(
        'patient_goal',
        'goal_suggestion.goalSuggestionTemplateId',
        'patient_goal.goalSuggestionTemplateId',
      )
      .where('patient_screening_tool_submission.id', patientScreeningToolSubmissionId)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        existingPatientCarePlanSuggestionsQuery,
      )
      .andWhere('patient_goal.id', null)) as GoalSuggestion[];

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewSuggestionsForPatientAnswer(
    patientId: string,
    patientAnswerId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const existingPatientCarePlanSuggestionsQuery = CarePlanSuggestion.query(txn)
      .where('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'goal')
      .select('goalSuggestionTemplateId');

    const goalSuggestions = (await this.query(txn)
      .eager('goalSuggestionTemplate.[taskTemplates]')
      .joinRelation('answer')
      .join('patient_answer', 'answer.id', 'patient_answer.answerId')
      .leftOuterJoin(
        'patient_goal',
        'goal_suggestion.goalSuggestionTemplateId',
        'patient_goal.goalSuggestionTemplateId',
      )
      .where('patient_answer.id', patientAnswerId)
      .andWhere('patient_answer.deletedAt', null)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        existingPatientCarePlanSuggestionsQuery,
      )
      .andWhere('patient_answer.applicable', true)
      .andWhere('patient_goal.id', null)) as GoalSuggestion[];

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async create(
    input: IGoalSuggestionEditableFields,
    existingTxn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const { goalSuggestionTemplateId, answerId, screeningToolScoreRangeId } = input;

    return await transaction(GoalSuggestion.knex(), async txn => {
      const relations = await GoalSuggestion.query(existingTxn || txn).where({
        goalSuggestionTemplateId,
        answerId: answerId || null,
        screeningToolScoreRangeId: screeningToolScoreRangeId || null,
        deletedAt: null,
      });

      if (relations.length < 1) {
        await GoalSuggestion.query(existingTxn || txn).insert({
          goalSuggestionTemplateId,
          answerId,
          screeningToolScoreRangeId,
        });
      }

      if (answerId) {
        return await this.getForAnswer(answerId, existingTxn || txn);
      } else if (screeningToolScoreRangeId) {
        return await this.getForScreeningToolScoreRange(
          screeningToolScoreRangeId,
          existingTxn || txn,
        );
      } else {
        return [];
      }
    });
  }

  static async delete(
    {
      goalSuggestionTemplateId,
      answerId,
      screeningToolScoreRangeId,
    }: IGoalSuggestionEditableFields,
    txn?: Transaction,
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
      return await this.getForAnswer(answerId, txn);
    } else if (screeningToolScoreRangeId) {
      return await this.getForScreeningToolScoreRange(screeningToolScoreRangeId, txn);
    } else {
      return [];
    }
  }
}
/* tslint:enable:member-ordering */
