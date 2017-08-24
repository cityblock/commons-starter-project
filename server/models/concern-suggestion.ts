import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Answer from './answer';
import Concern from './concern';

export interface IConcernSuggestionEditableFields {
  concernId: string;
  answerId: string;
}

/* tslint:disable:member-ordering */
export default class ConcernSuggestion extends Model {
  id: string;
  concernId: string;
  concern: Concern;
  answerId: string;
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
  };

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async getForConcern(concernId: string): Promise<Answer[]> {
    const concernSuggestions = await this
      .query()
      .where('concernId', concernId)
      .andWhere('deletedAt', null)
      .eager('answer')
      .orderBy('createdAt', 'asc');
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.answer,
    );
  }

  static async getForAnswer(answerId: string): Promise<Concern[]> {
    const concernSuggestions = await this
      .query()
      .where('answerId', answerId)
      .andWhere('deletedAt', null)
      .orderBy('createdAt')
      .eager('concern') as any;
    return concernSuggestions.map(
      (concernSuggestion: ConcernSuggestion) => concernSuggestion.concern,
    );
  }

  static async getForPatient(patientId: string, riskAreaId?: string): Promise<Concern[]> {
    let concernSuggestions;

    if (riskAreaId) {
      concernSuggestions = await this
        .query()
        .eager('concern')
        .joinRelation('answer.question')
        .join('patient_answer', 'answer.id', 'patient_answer.answerId')
        .where('patient_answer.deletedAt', null)
        .andWhere('patient_answer.patientId', patientId)
        .andWhere('patient_answer.applicable', true)
        .andWhere('answer:question.riskAreaId', riskAreaId);
    } else {
      concernSuggestions = await this
        .query()
        .eager('concern')
        .joinRelation('answer')
        .join('patient_answer', 'answer.id', 'patient_answer.answerId')
        .where('patient_answer.deletedAt', null)
        .andWhere('patient_answer.patientId', patientId)
        .andWhere('patient_answer.applicable', true);
    }

    return concernSuggestions.map((suggestion: ConcernSuggestion) => suggestion.concern);
  }

  static async create(
    { concernId, answerId }: IConcernSuggestionEditableFields,
  ): Promise<Concern[]> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(ConcernSuggestion, async ConcernSuggestionWithTransaction => {
      const relations = await ConcernSuggestionWithTransaction
        .query()
        .where('concernId', concernId)
        .andWhere('answerId', answerId)
        .andWhere('deletedAt', null);

      if (relations.length < 1) {
        await ConcernSuggestionWithTransaction
          .query()
          .insert({ concernId, answerId });
      }
    });

    return await this.getForAnswer(answerId);
  }

  static async delete(
    { concernId, answerId }: IConcernSuggestionEditableFields,
  ): Promise<Concern[]> {
    await this.query()
      .where('concernId', concernId)
      .andWhere('answerId', answerId)
      .andWhere('deletedAt', null)
      .update({ deletedAt: new Date().toISOString() });
    return await this.getForAnswer(answerId);
  }

}
/* tslint:disable:member-ordering */
