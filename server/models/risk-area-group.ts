import { Model, RelationMappings } from 'objection';
import BaseModel from './base-model';

interface IRiskAreaGroupEditableFields {
  title: string;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

/* tslint:disable:member-ordering */
// 360 Domain
export default class RiskAreaGroup extends BaseModel {
  id: string;
  title: string;
  mediumRiskThreshold: number;
  highRiskThreshold: number;

  static tableName = 'risk_area_group';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
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
      .orderBy('createdAt', 'DESC')
      .where({ deletedAt: null });
  }

  static async create(input: IRiskAreaGroupEditableFields): Promise<RiskAreaGroup> {
    return this.query().insertAndFetch(input);
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
}
/* tslint:enable:member-ordering */
