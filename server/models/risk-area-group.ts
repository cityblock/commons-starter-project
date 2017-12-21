import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import RiskArea from './risk-area';

interface IRiskAreaGroupEditableFields {
  title: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

/* tslint:disable:member-ordering */
// 360 Domain
export default class RiskAreaGroup extends BaseModel {
  id: string;
  title: string;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  riskAreas: RiskArea[];

  static tableName = 'risk_area_group';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      order: { type: 'integer', minimum: 1 },
      mediumRiskThreshold: { type: 'integer', minimum: 1 },
      highRiskThreshold: { type: 'integer', minimum: 1 },
      deletedAt: { type: 'string' },
    },
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

  static async get(riskAreaGroupId: string): Promise<RiskAreaGroup> {
    const riskAreaGroup = await this.query().findOne({ id: riskAreaGroupId, deletedAt: null });

    if (!riskAreaGroup) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return riskAreaGroup;
  }

  static async getAll(): Promise<RiskAreaGroup[]> {
    return this.query()
      .orderBy('order')
      .where({ deletedAt: null });
  }

  static async create(
    input: IRiskAreaGroupEditableFields,
    txn?: Transaction,
  ): Promise<RiskAreaGroup> {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    riskAreaGroup: Partial<IRiskAreaGroupEditableFields>,
    riskAreaGroupId: string,
  ): Promise<RiskAreaGroup> {
    const edited = await this.query().updateAndFetchById(riskAreaGroupId, riskAreaGroup);

    if (!edited) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return edited;
  }

  static async delete(riskAreaGroupId: string): Promise<RiskAreaGroup> {
    await this.query()
      .where({ id: riskAreaGroupId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const deleted = await this.query().findById(riskAreaGroupId);

    if (!deleted) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return deleted;
  }

  static async getForPatient(
    riskAreaGroupId: string,
    patientId: string,
    txn?: Transaction,
  ): Promise<RiskAreaGroup> {
    const EAGER_QUERY = '[riskAreas.questions.answers.patientAnswers]';

    const riskAreaGroup = await this.query(txn)
      .eager(EAGER_QUERY)
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
      .findById(riskAreaGroupId);

    if (!riskAreaGroup) {
      return Promise.reject(`No such risk area group: ${riskAreaGroupId}`);
    }
    return riskAreaGroup;
  }
}
/* tslint:enable:member-ordering */