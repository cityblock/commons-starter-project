import { transaction, Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import CarePlanSuggestion from './care-plan-suggestion';
import Concern from './concern';

export interface IConcernSuggestionEditableFields {
  concernId: string;
  answerId?: string | null;
  screeningToolScoreRangeId?: string | null;
}

/* tslint:disable:member-ordering */
export default class ConcernSuggestion extends Model {
  id: string;
  concernId: string;
  concern: Concern;
  answerId: string;
  screeningToolScoreRangeId: string;
  answer: Answer;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'concern_suggestion';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string' },
      screeningToolScoreRangeId: { type: 'string' },
      concernId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    concern: {
      relation: Model.HasOneRelation,
      modelClass: 'concern',
      join: {
        from: 'concern_suggestion.concernId',
        to: 'concern.id',
      },
    },
    answer: {
      relation: Model.HasOneRelation,
      modelClass: 'answer',
      join: {
        from: 'concern_suggestion.answerId',
        to: 'answer.id',
      },
    },
    screeningToolScoreRange: {
      relation: Model.HasOneRelation,
      modelClass: 'screening-tool-score-range',
      join: {
        from: 'concern_suggestion.screeningToolScoreRangeId',
        to: 'screening_tool_score_range.id',
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

  static async getForConcern(concernId: string): Promise<Answer[]> {
    const concernSuggestions = await this.query()
      .where('concernId', concernId)
      .andWhere('deletedAt', null)
      .eager('answer')
      .orderBy('createdAt', 'asc');
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.answer,
    );
  }

  static async getForAnswer(answerId: string): Promise<Concern[]> {
    const concernSuggestions = (await this.query()
      .where('answerId', answerId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('concern')) as any;
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.concern,
    );
  }

  static async getForScreeningToolScoreRange(
    screeningToolScoreRangeId: string,
  ): Promise<Concern[]> {
    const concernSuggestions = (await this.query()
      .where('screeningToolScoreRangeId', screeningToolScoreRangeId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('concern')) as any;
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.concern,
    );
  }

  static async getNewForPatient(patientId: string, txn?: Transaction): Promise<Concern[]> {
    const existingPatientCarePlanSuggestionsQuery = CarePlanSuggestion.query(txn)
      .where('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'concern')
      .select('concernId');

    const concernSuggestions = await this.query(txn)
      .eager('concern')
      .joinRelation('answer')
      .join('patient_answer', 'answer.id', 'patient_answer.answerId')
      .leftOuterJoin('patient_concern', 'concern_suggestion.concernId', 'patient_concern.concernId')
      .where('patient_answer.deletedAt', null)
      .andWhere('concern_suggestion.concernId', 'not in', existingPatientCarePlanSuggestionsQuery)
      .andWhere('patient_answer.patientId', patientId)
      .andWhere('patient_answer.applicable', true)
      .andWhere('patient_concern.id', null);

    return concernSuggestions.map((suggestion: ConcernSuggestion) => suggestion.concern);
  }

  static async create({
    concernId,
    answerId,
    screeningToolScoreRangeId,
  }: IConcernSuggestionEditableFields): Promise<Concern[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(ConcernSuggestion, async ConcernSuggestionWithTransaction => {
      const relations = await ConcernSuggestionWithTransaction.query().where({
        concernId,
        answerId: answerId || '',
        screeningToolScoreRangeId: screeningToolScoreRangeId || '',
        deletedAt: null,
      });

      if (relations.length < 1) {
        await ConcernSuggestionWithTransaction.query().insert({
          concernId,
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
    concernId,
    answerId,
    screeningToolScoreRangeId,
  }: IConcernSuggestionEditableFields): Promise<Concern[]> {
    await this.query()
      .where({
        concernId,
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
/* tslint:disable:member-ordering */
