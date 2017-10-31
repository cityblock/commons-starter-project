import { unionBy } from 'lodash';
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
      goalSuggestionTemplateId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  static async getForGoalSuggestion(goalSuggestionTemplateId: string): Promise<Answer[]> {
    const goalSuggestionAnswers = await GoalSuggestion.query()
      .where('goalSuggestionTemplateId', goalSuggestionTemplateId)
      .andWhere('deletedAt', null)
      .eager('answer')
      .orderBy('createdAt', 'asc');
    return goalSuggestionAnswers.map((goalSuggestion: GoalSuggestion) => goalSuggestion.answer);
  }

  static async getForAnswer(answerId: string): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestionAnswers = (await GoalSuggestion.query()
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
  ): Promise<GoalSuggestionTemplate[]> {
    const goalSuggestionAnswers = (await GoalSuggestion.query()
      .where('screeningToolScoreRangeId', screeningToolScoreRangeId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('goalSuggestionTemplate')) as any;
    return goalSuggestionAnswers.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async getNewForPatient(
    patientId: string,
    txn?: Transaction,
  ): Promise<GoalSuggestionTemplate[]> {
    const existingPatientCarePlanSuggestionsQuery = CarePlanSuggestion.query(txn)
      .where('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'goal')
      .select('goalSuggestionTemplateId');

    const answerGoalSuggestions = await this.query(txn)
      .eager('goalSuggestionTemplate.[taskTemplates]')
      .joinRelation('answer')
      .join('patient_answer', 'answer.id', 'patient_answer.answerId')
      .leftOuterJoin(
        'patient_goal',
        'goal_suggestion.goalSuggestionTemplateId',
        'patient_goal.goalSuggestionTemplateId',
      )
      .where('patient_answer.deletedAt', null)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        existingPatientCarePlanSuggestionsQuery,
      )
      .andWhere('patient_answer.patientId', patientId)
      .andWhere('patient_answer.applicable', true)
      .andWhere('patient_goal.id', null);

    // TODO: make this work in a 'union' query. Can't get it to act properly right now though.
    const screeningToolGoalSuggestions = await this.query(txn)
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
      .where('patient_screening_tool_submission.deletedAt', null)
      .andWhere(
        'goal_suggestion.goalSuggestionTemplateId',
        'not in',
        existingPatientCarePlanSuggestionsQuery,
      )
      .andWhere('patient_screening_tool_submission.patientId', patientId)
      .andWhere('patient_goal.id', null);

    const goalSuggestions = unionBy(
      answerGoalSuggestions,
      screeningToolGoalSuggestions,
      'goalSuggestionTemplateId',
    );

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async create({
    goalSuggestionTemplateId,
    answerId,
    screeningToolScoreRangeId,
  }: IGoalSuggestionEditableFields): Promise<GoalSuggestionTemplate[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(GoalSuggestion, async GoalSuggestionWithTransaction => {
      const relations = await GoalSuggestionWithTransaction.query().where({
        goalSuggestionTemplateId,
        answerId: answerId || '',
        screeningToolScoreRangeId: screeningToolScoreRangeId || '',
        deletedAt: null,
      });

      if (relations.length < 1) {
        await GoalSuggestionWithTransaction.query().insert({
          goalSuggestionTemplateId,
          answerId,
          screeningToolScoreRangeId,
        });
      }
    });

    if (answerId) {
      return await this.getForAnswer(answerId);
    } else if (screeningToolScoreRangeId) {
      return await this.getForScreeningToolScoreRange(screeningToolScoreRangeId);
    } else {
      return [];
    }
  }

  static async delete({
    goalSuggestionTemplateId,
    answerId,
    screeningToolScoreRangeId,
  }: IGoalSuggestionEditableFields): Promise<GoalSuggestionTemplate[]> {
    await this.query()
      .where({
        goalSuggestionTemplateId,
        answerId: answerId || null,
        screeningToolScoreRangeId: screeningToolScoreRangeId || null,
        deletedAt: null,
      })
      .update({ deletedAt: new Date().toISOString() });

    if (answerId) {
      return await this.getForAnswer(answerId);
    } else if (screeningToolScoreRangeId) {
      return await this.getForScreeningToolScoreRange(screeningToolScoreRangeId);
    } else {
      return [];
    }
  }
}
/* tslint:enable:member-ordering */
