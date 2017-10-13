import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import ScreeningTool from './screening-tool';

export interface IScreeningToolScoreRangeCreateFields {
  screeningToolId: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
}

export interface IScreeningToolScoreRangeEditableFields {
  description?: string;
  screeningToolId?: string;
  minimumScore?: number;
  maximumScore?: number;
  deletedAt?: string;
}

export const EAGER_QUERY = '[screeningTool]';

/* tslint:disable:member-ordering */
export default class ScreeningToolScoreRange extends Model {
  id: string;
  screeningToolId: string;
  screeningTool: ScreeningTool;
  description: string;
  minimumScore: number;
  maximumScore: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'screening_tool_score_range';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      screeningToolId: { type: 'string' },
      description: { type: 'string' },
      minimumScore: { type: 'integer' },
      maximumScore: { type: 'integer' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    screeningTool: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'screening_tool_score_range.screeningToolId',
        to: 'screening_tool.id',
      },
    },
    concernSuggestions: {
      relation: Model.ManyToManyRelation,
      modelClass: 'concern',
      join: {
        from: 'screening_tool_score_range.id',
        through: {
          from: 'concern_suggestion.screeningToolScoreRangeId',
          to: 'concern_suggestion.concernId',
        },
        to: 'concern.id',
      },
    },
    goalSuggestions: {
      relation: Model.ManyToManyRelation,
      modelClass: 'goal-suggestion-template',
      join: {
        from: 'screening_tool_score_range.id',
        through: {
          from: 'goal_suggestion.screeningToolScoreRangeId',
          to: 'goal_suggestion.goalSuggestionTemplateId',
        },
        to: 'goal_suggestion_template.id',
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

  static async create(
    input: IScreeningToolScoreRangeCreateFields,
  ): Promise<ScreeningToolScoreRange> {
    return await this.query()
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    screeningToolScoreRangeId: string,
    screeningToolScoreRange: IScreeningToolScoreRangeEditableFields,
  ): Promise<ScreeningToolScoreRange> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(screeningToolScoreRangeId, screeningToolScoreRange);
  }

  static async get(screeningToolScoreRangeId: string): Promise<ScreeningToolScoreRange> {
    const screeningToolScoreRange = await this.query()
      .eager(EAGER_QUERY)
      .findOne({ id: screeningToolScoreRangeId, deletedAt: null });

    if (!screeningToolScoreRange) {
      return Promise.reject(`No such screening tool score range: ${screeningToolScoreRangeId}`);
    }

    return screeningToolScoreRange;
  }

  static async getForScreeningTool(screeningToolId: string): Promise<ScreeningToolScoreRange[]> {
    return await this.query()
      .eager(EAGER_QUERY)
      .where({ deletedAt: null, screeningToolId });
  }

  static async getByScoreForScreeningTool(
    score: number,
    screeningToolId: string,
  ): Promise<ScreeningToolScoreRange> {
    const screeningToolScoreRange = await this.query()
      .eager(EAGER_QUERY)
      .whereRaw('"minimumScore" <= ? and "maximumScore" >= ? and "screeningToolId" = ?', [
        score,
        score,
        screeningToolId,
      ])
      .findOne({ deletedAt: null });

    if (!screeningToolScoreRange) {
      return Promise.reject(
        /* tslint:disable:max-line-length */
        `No such screening tool score range for score: ${score} and screeningToolId: ${screeningToolId}`,
        /* tslint:enable:max-line-length */
      );
    }

    return screeningToolScoreRange;
  }

  static async getAll(): Promise<ScreeningToolScoreRange[]> {
    return await this.query()
      .eager(EAGER_QUERY)
      .where({ deletedAt: null });
  }

  static async delete(screeningToolScoreRangeId: string): Promise<ScreeningToolScoreRange> {
    await this.query()
      .where({ id: screeningToolScoreRangeId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const screeningToolScoreRange = await this.query().findById(screeningToolScoreRangeId);
    if (!screeningToolScoreRange) {
      return Promise.reject(`No such screeningToolScoreRange: ${screeningToolScoreRangeId}`);
    }
    return screeningToolScoreRange;
  }
}
/* tslint:disable:member-ordering */
