import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import RiskArea from './risk-area';

interface IRiskAreaGroupEditableFields {
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

/* tslint:disable:member-ordering */
// 360 Domain
export default class RiskAreaGroup extends BaseModel {
  title: string;
  shortTitle: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreas: RiskArea[];

  static tableName = 'risk_area_group';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      shortTitle: { type: 'string', minLength: 1, maxLength: 14 }, // at most 14 characters long
      order: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      mediumRiskThreshold: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      highRiskThreshold: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['title', 'shortTitle', 'order', 'mediumRiskThreshold', 'highRiskThreshold'],
  };

  static relationMappings: RelationMappings = {
    riskAreas: {
      relation: Model.HasManyRelation,
      modelClass: 'risk-area',
      join: {
        from: 'risk_area_group.id',
        to: 'risk_area.riskAreaGroupId',
      },
    },
  };

  static async get(riskAreaGroupId: string, txn: Transaction): Promise<RiskAreaGroup> {
    const riskAreaGroup = await this.query(txn).findOne({ id: riskAreaGroupId, deletedAt: null });

    if (!riskAreaGroup) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return riskAreaGroup;
  }

  static async getAll(txn: Transaction): Promise<RiskAreaGroup[]> {
    return this.query(txn)
      .orderBy('order')
      .where({ deletedAt: null });
  }

  static async create(
    input: IRiskAreaGroupEditableFields,
    txn: Transaction,
  ): Promise<RiskAreaGroup> {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    riskAreaGroup: Partial<IRiskAreaGroupEditableFields>,
    riskAreaGroupId: string,
    txn: Transaction,
  ): Promise<RiskAreaGroup> {
    const edited = await this.query(txn).patchAndFetchById(riskAreaGroupId, riskAreaGroup);

    if (!edited) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return edited;
  }

  static async delete(riskAreaGroupId: string, txn: Transaction): Promise<RiskAreaGroup> {
    await this.query(txn)
      .where({ id: riskAreaGroupId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(riskAreaGroupId);

    if (!deleted) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return deleted;
  }

  static async getForPatient(
    riskAreaGroupId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<RiskAreaGroup> {
    /* tslint:disable:max-line-length */
    const EAGER_QUERY =
      '[riskAreas.[questions.answers.patientAnswers, riskAreaAssessmentSubmissions, screeningTools.[patientScreeningToolSubmissions.[screeningToolScoreRange, patientAnswers.[answer]]]]]';
    /* tslint:enable:max-line-length */

    const riskAreaGroup = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('riskAreas', builder => {
        builder.where({ deletedAt: null });
      })
      .modifyEager('riskAreas.questions.answers.patientAnswers', builder => {
        builder.where({
          patientId,
          deletedAt: null,
          applicable: true,
        });
      })
      .modifyEager('riskAreas.questions', builder => {
        builder.orderBy('order');
      })
      .modifyEager('riskAreas.riskAreaAssessmentSubmissions', builder => {
        builder.where({ patientId, deletedAt: null }).orderBy('createdAt', 'asc');
      })
      .modifyEager('riskAreas.screeningTools.patientScreeningToolSubmissions', builder => {
        builder
          .where({ patientId, deletedAt: null })
          .whereNot({ scoredAt: null, score: null })
          .orderBy('scoredAt', 'desc')
          .limit(1);
      })
      .modifyEager(
        'riskAreas.screeningTools.patientScreeningToolSubmissions.patientAnswers',
        builder => {
          builder.where({ patientId, deletedAt: null, applicable: true });
        },
      )
      .findById(riskAreaGroupId);

    if (!riskAreaGroup) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }

    return riskAreaGroup;
  }
}
/* tslint:enable:member-ordering */
