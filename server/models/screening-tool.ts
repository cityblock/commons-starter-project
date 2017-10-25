import { Model, RelationMappings } from 'objection';
import BaseModel from './base-model';
import RiskArea from './risk-area';
import ScreeningToolScoreRange from './screening-tool-score-range';

export interface IScreeningToolCreateFields {
  title: string;
  riskAreaId: string;
}

export interface IScreeningToolEditableFields {
  title?: string;
  riskAreaId?: string;
  deletedAt?: string;
}

/* tslint:disable:max-line-length */
export const EAGER_QUERY =
  '[riskArea, screeningToolScoreRanges.[concernSuggestions, goalSuggestions.[taskTemplates]]]';
/* tslint:enable:max-line-length */

/* tslint:disable:member-ordering */
export default class ScreeningTool extends BaseModel {
  title: string;
  riskAreaId: string;
  riskArea: RiskArea;
  screeningToolScoreRanges: ScreeningToolScoreRange[];

  static tableName = 'screening_tool';

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
    screeningToolScoreRanges: {
      relation: Model.HasManyRelation,
      modelClass: 'screening-tool-score-range',
      join: {
        from: 'screening_tool_score_range.screeningToolId',
        to: 'screening_tool.id',
      },
    },
  };

  static withFormattedScreeningToolScoreRanges(screeningTool: ScreeningTool) {
    return {
      ...screeningTool,
      screeningToolScoreRanges: screeningTool.screeningToolScoreRanges.map(scoreRange =>
        ScreeningToolScoreRange.withMinimumAndMaximumScore(scoreRange),
      ),
    };
  }

  static async create(input: IScreeningToolCreateFields): Promise<ScreeningTool> {
    return await this.query()
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    screeningToolId: string,
    screeningTool: IScreeningToolEditableFields,
  ): Promise<ScreeningTool> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(screeningToolId, screeningTool);
  }

  static async get(screeningToolId: string): Promise<ScreeningTool> {
    const screeningTool = await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('screeningToolScoreRanges', builder =>
        builder.where('screening_tool_score_range.deletedAt', null),
      )
      .modifyEager('screeningToolScoreRanges.concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('screeningToolScoreRanges.goalSuggestions', builder =>
        builder.where('goal_suggestion.deletedAt', null),
      )
      .findOne({ id: screeningToolId, deletedAt: null });

    if (!screeningTool) {
      return Promise.reject(`No such screening tool: ${screeningToolId}`);
    }

    return screeningTool;
  }

  static async getForRiskArea(riskAreaId: string): Promise<ScreeningTool[]> {
    return await this.query()
      .eager(EAGER_QUERY)
      .where({ deletedAt: null, riskAreaId });
  }

  static async getAll(): Promise<ScreeningTool[]> {
    return await this.query()
      .eager(EAGER_QUERY)
      .modifyEager('screeningToolScoreRanges', builder =>
        builder.where('screening_tool_score_range.deletedAt', null),
      )
      .modifyEager('screeningToolScoreRanges.concernSuggestions', builder =>
        builder.where('concern_suggestion.deletedAt', null),
      )
      .modifyEager('screeningToolScoreRanges.goalSuggestions', builder =>
        builder.where('goal_suggestion.deletedAt', null),
      )
      .where({ deletedAt: null });
  }

  static async delete(screeningToolId: string): Promise<ScreeningTool> {
    await this.query()
      .where({ id: screeningToolId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });
    const screeningTool = await this.query()
      .eager(EAGER_QUERY)
      .findById(screeningToolId);
    if (!screeningTool) {
      return Promise.reject(`No such screeningTool: ${screeningToolId}`);
    }
    return screeningTool;
  }
}
/* tslint:enable:member-ordering */
