import { uniqBy } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import CarePlanSuggestion from './care-plan-suggestion';
import Concern from './concern';

interface IConcernSuggestionEditableFields {
  concernId: string;
  answerId?: string;
  screeningToolScoreRangeId?: string;
}

/* tslint:disable:member-ordering */
export default class ConcernSuggestion extends Model {
  id: string;
  createdAt: string;
  deletedAt: string;
  concernId: string;
  concern: Concern;
  answerId: string;
  screeningToolScoreRangeId: string;
  answer: Answer;

  static tableName = 'concern_suggestion';
  static hasPHI = false;

  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      answerId: { type: 'string' },
      screeningToolScoreRangeId: { type: 'string' },
      concernId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['concernId'],
    oneOf: [{ required: ['answerId'] }, { required: ['screeningToolScoreRangeId'] }],
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

  static async getForConcern(concernId: string, txn: Transaction): Promise<Answer[]> {
    const concernSuggestions = await this.query(txn)
      .where('concernId', concernId)
      .andWhere('deletedAt', null)
      .eager('answer')
      .orderBy('createdAt', 'asc');
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.answer,
    );
  }

  static async getForAnswer(answerId: string, txn: Transaction): Promise<Concern[]> {
    const concernSuggestions = (await this.query(txn)
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
    txn: Transaction,
  ): Promise<Concern[]> {
    const concernSuggestions = (await this.query(txn)
      .where('screeningToolScoreRangeId', screeningToolScoreRangeId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('concern')) as any;
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.concern,
    );
  }

  static async getNewSuggestionsForRiskAreaAssessmentSubmission(
    patientId: string,
    riskAreaAssessmentSubmissionId: string,
    txn: Transaction,
  ): Promise<Concern[]> {
    const concernSuggestions = (await this.getAnswerConcernSuggestionsQuery(patientId, txn).where(
      'patient_answer.riskAreaAssessmentSubmissionId',
      riskAreaAssessmentSubmissionId,
    )) as ConcernSuggestion[];

    return concernSuggestions.map((suggestion: ConcernSuggestion) => suggestion.concern);
  }

  static async getNewSuggestionsForPatientScreeningToolSubmission(
    patientId: string,
    patientScreeningToolSubmissionId: string,
    txn: Transaction,
  ): Promise<Concern[]> {
    const currentConcernSuggestionIdsQuery = CarePlanSuggestion.query(txn)
      .where('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'concern')
      .select('concernId');

    // concern suggestions based on answers
    const answerConcernSuggestions = (await this.getAnswerConcernSuggestionsQuery(
      patientId,
      txn,
    ).andWhere(
      'patient_answer.patientScreeningToolSubmissionId',
      patientScreeningToolSubmissionId,
    )) as ConcernSuggestion[];

    // concern suggestions based on score ranges
    const scoreRangeConcernSuggestions = (await this.query(txn)
      .eager('concern')
      .joinRelation('screeningToolScoreRange')
      .join(
        'patient_screening_tool_submission',
        'screeningToolScoreRange.id',
        'patient_screening_tool_submission.screeningToolScoreRangeId',
      )
      .leftOuterJoin('patient_concern', 'concern_suggestion.concernId', 'patient_concern.concernId')
      .where('patient_screening_tool_submission.id', patientScreeningToolSubmissionId)
      .andWhere('concern_suggestion.concernId', 'not in', currentConcernSuggestionIdsQuery)
      .andWhere('patient_concern.id', null)) as ConcernSuggestion[];

    const uniqueConcernSuggestions = uniqBy(
      answerConcernSuggestions.concat(scoreRangeConcernSuggestions),
      'concernId',
    );

    return uniqueConcernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.concern,
    );
  }

  static async getNewSuggestionsForPatientAnswer(
    patientId: string,
    patientAnswerId: string,
    txn: Transaction,
  ): Promise<Concern[]> {
    const concernSuggestions = (await this.getAnswerConcernSuggestionsQuery(
      patientId,
      txn,
    ).andWhere('patient_answer.id', patientAnswerId)) as ConcernSuggestion[];

    return concernSuggestions.map((suggestion: ConcernSuggestion) => suggestion.concern);
  }

  static async create(
    input: IConcernSuggestionEditableFields,
    txn: Transaction,
  ): Promise<Concern[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    const { concernId, answerId, screeningToolScoreRangeId } = input;
    const relations = await ConcernSuggestion.query(txn).where({
      concernId,
      answerId: answerId || null,
      screeningToolScoreRangeId: screeningToolScoreRangeId || null,
      deletedAt: null,
    });

    if (relations.length < 1) {
      await ConcernSuggestion.query(txn).insert({
        concernId,
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
    { concernId, answerId, screeningToolScoreRangeId }: IConcernSuggestionEditableFields,
    txn: Transaction,
  ): Promise<Concern[]> {
    await this.query(txn)
      .where({
        concernId,
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

  static getAnswerConcernSuggestionsQuery(patientId: string, txn: Transaction) {
    const currentConcernSuggestionIdsQuery = this.currentConcernSuggestionIdsQuery(patientId, txn);

    return this.query(txn)
      .eager('concern')
      .joinRelation('answer')
      .join('patient_answer', 'answer.id', 'patient_answer.answerId')
      .leftOuterJoin('patient_concern', 'concern_suggestion.concernId', 'patient_concern.concernId')
      .whereNotIn('concern_suggestion.concernId', currentConcernSuggestionIdsQuery)
      .andWhere('patient_answer.applicable', true)
      .andWhere('patient_concern.id', null);
  }

  static currentConcernSuggestionIdsQuery(patientId: string, txn: Transaction) {
    return CarePlanSuggestion.query(txn)
      .whereNotNull('concernId')
      .andWhere('patientId', patientId)
      .andWhere('dismissedAt', null)
      .andWhere('acceptedAt', null)
      .andWhere('suggestionType', 'concern')
      .select('concernId');
  }
}
/* tslint:enable:member-ordering */
