import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import RiskArea from './risk-area';

export interface IScreeningToolCreateFields {
  title: string;
  riskAreaId: string;
}

export interface IScreeningToolEditableFields {
  title?: string;
  riskAreaId?: string;
  deletedAt?: string;
}

/* tslint:disable:member-ordering */
export default class ScreeningTool extends Model {
  id: string;
  title: string;
  riskAreaId: string;
  riskArea: RiskArea;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'screening_tool';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      riskAreaId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    riskArea: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'risk-area',
      join: {
        from: 'screening_tool.riskAreaId',
        to: 'risk_area.id',
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

  static async create(input: IScreeningToolCreateFields): Promise<ScreeningTool> {
    return await this.query().insertAndFetch(input);
  }

  static async edit(
    screeningToolId: string,
    screeningTool: IScreeningToolEditableFields,
  ): Promise<ScreeningTool> {
    return await this.query().updateAndFetchById(screeningToolId, screeningTool);
  }

  static async get(screeningToolId: string): Promise<ScreeningTool> {
    const screeningTool = await this.query().findOne({ id: screeningToolId, deletedAt: null });

    if (!screeningTool) {
      return Promise.reject(`No such screening tool: ${screeningToolId}`);
    }

    return screeningTool;
  }

  static async getForRiskArea(riskAreaId: string): Promise<ScreeningTool[]> {
    return await this.query().where({ deletedAt: null, riskAreaId });
  }

  static async getAll(): Promise<ScreeningTool[]> {
    return await this.query().where({ deletedAt: null });
  }

  static async delete(screeningToolId: string): Promise<ScreeningTool> {
    return await this.query().updateAndFetchById(screeningToolId, {
      deletedAt: new Date().toISOString(),
    });
  }
}
/* tslint:disable:member-ordering */
