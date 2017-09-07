import { transaction, Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import CarePlanSuggestion from './care-plan-suggestion';
import GoalSuggestionTemplate from './goal-suggestion-template';

export interface IGoalSuggestionEditableFields {
  goalSuggestionTemplateId: string;
  answerId: string;
}

/* tslint:disable:member-ordering */
export default class GoalSuggestion extends Model {
  id: string;
  goalSuggestionTemplateId: string;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  answerId: string;
  answer: Answer;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'goal_suggestion';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string' },
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
  };

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

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

    const goalSuggestions = await this.query(txn)
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

    return goalSuggestions.map(
      (goalSuggestion: GoalSuggestion) => goalSuggestion.goalSuggestionTemplate,
    );
  }

  static async create({
    goalSuggestionTemplateId,
    answerId,
  }: IGoalSuggestionEditableFields): Promise<GoalSuggestionTemplate[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(GoalSuggestion, async GoalSuggestionWithTransaction => {
      const relations = await GoalSuggestionWithTransaction.query()
        .where('goalSuggestionTemplateId', goalSuggestionTemplateId)
        .andWhere('answerId', answerId)
        .andWhere('deletedAt', null);

      if (relations.length < 1) {
        await GoalSuggestionWithTransaction.query().insert({ goalSuggestionTemplateId, answerId });
      }
    });

    return await this.getForAnswer(answerId);
  }

  static async delete({
    goalSuggestionTemplateId,
    answerId,
  }: IGoalSuggestionEditableFields): Promise<GoalSuggestionTemplate[]> {
    await this.query()
      .where('goalSuggestionTemplateId', goalSuggestionTemplateId)
      .andWhere('answerId', answerId)
      .andWhere('deletedAt', null)
      .update({ deletedAt: new Date().toISOString() });
    return await this.getForAnswer(answerId);
  }
}
/* tslint:disable:member-ordering */
