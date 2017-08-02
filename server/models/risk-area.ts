import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Question from './question';

export interface IRiskAreaEditableFields {
  title: string;
  order: number;
}

/* tslint:disable:member-ordering */
// 360 Domain
export default class RiskArea extends Model {
  id: string;
  title: string;
  questions: Question[];
  order: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'risk_area';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      deletedAt: { type: 'string' },
      order: { type: 'integer' },
    },
  };

  static relationMappings: RelationMappings = {
    questions: {
      relation: Model.HasManyRelation,
      modelClass: 'question',
      join: {
        from: 'risk_area.id',
        to: 'question.riskAreaId',
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

  static async get(riskAreaId: string): Promise<RiskArea> {
    const riskArea = await this
      .query()
      .findById(riskAreaId);

    if (!riskArea) {
      return Promise.reject(`No such risk area: ${riskAreaId}`);
    }
    return riskArea;
  }

  static async getAll(): Promise<RiskArea[]> {
    return this.query().orderBy('order').where({ deletedAt: null });
  }

  static async create(input: IRiskAreaEditableFields) {
    return this.query().insertAndFetch(input);
  }

  static async edit(
    riskArea: Partial<IRiskAreaEditableFields>, riskAreaId: string,
  ): Promise<RiskArea> {
    return await this.query().updateAndFetchById(riskAreaId, riskArea);
  }

  static async delete(riskAreaId: string): Promise<RiskArea> {
    return await this.query().updateAndFetchById(riskAreaId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
