import { isNumber, omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Concern from './concern';
import GoalSuggestionTemplate from './goal-suggestion-template';
import ScreeningTool from './screening-tool';

interface IScreeningToolScoreRangeCreateFields {
  screeningToolId: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
  riskAdjustmentType?: RiskAdjustmentType;
}

interface IScreeningToolScoreRangeEditableFields {
  description?: string;
  screeningToolId?: string;
  minimumScore?: number;
  maximumScore?: number;
  deletedAt?: string;
  riskAdjustmentType?: RiskAdjustmentType;
}

type RiskAdjustmentType = 'inactive' | 'increment' | 'forceHighRisk';

export const EAGER_QUERY = '[screeningTool, concernSuggestions]';
export const RANGE_REGEX = /\[(\d+),(\d+)\)/;

/* tslint:disable:member-ordering */
export default class ScreeningToolScoreRange extends BaseModel {
  screeningToolId: string;
  screeningTool: ScreeningTool;
  description: string;
  range: string;
  minimumScore: number;
  maximumScore: number;
  riskAdjustmentType: RiskAdjustmentType;
  concernSuggestions: Concern[];
  goalSuggestions: GoalSuggestionTemplate[];

  static tableName = 'screening_tool_score_range';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      screeningToolId: { type: 'string', minLength: 1 }, // cannot be blank
      description: { type: 'string', minLength: 1 }, // cannot be blank
      range: { type: 'int4range' },
      riskAdjustmentType: { type: 'string', enum: ['inactive', 'increment', 'forceHighRisk'] },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['screeningToolId', 'description', 'range'],
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

  static withMinimumAndMaximumScore(screeningToolScoreRange: ScreeningToolScoreRange) {
    const rangeMatch = RANGE_REGEX.exec(screeningToolScoreRange.range);

    return {
      ...screeningToolScoreRange,
      minimumScore: parseInt(rangeMatch![1], 10),
      // Objection/Knex or Postgres is storing our inclusive ranges as exclusive of the top end
      // This corrects the max score
      maximumScore: parseInt(rangeMatch![2], 10) - 1,
    };
  }

  static async create(
    input: IScreeningToolScoreRangeCreateFields,
    txn: Transaction,
  ): Promise<ScreeningToolScoreRange> {
    const { minimumScore, maximumScore } = input;

    const range = `[${minimumScore}, ${maximumScore}]`;

    const filtered = {
      range,
      ...omit<IScreeningToolScoreRangeCreateFields>(input, ['minimumScore', 'maximumScore']),
    };

    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(filtered);
  }

  static async edit(
    screeningToolScoreRangeId: string,
    screeningToolScoreRange: IScreeningToolScoreRangeEditableFields,
    txn: Transaction,
  ): Promise<ScreeningToolScoreRange> {
    const { minimumScore, maximumScore } = screeningToolScoreRange;
    const editedMinimumScore = isNumber(minimumScore);
    const editedMaximumScore = isNumber(maximumScore);
    const fetchedScoreRange = await this.get(screeningToolScoreRangeId, txn);
    let filtered: any = screeningToolScoreRange;
    let range: string = '';

    // The easy case: both ends of the range are being updated
    if (editedMinimumScore && editedMaximumScore) {
      range = `[${minimumScore}, ${maximumScore}]`;

      filtered = {
        range,
        ...omit(screeningToolScoreRange, ['minimumScore', 'maximumScore']),
      };
      // The less easy case: one end of the range is being updated
    } else if ((editedMinimumScore || editedMaximumScore) && fetchedScoreRange) {
      // Fetch the record from the database to get the other end of the range
      const rangeMatch = RANGE_REGEX.exec(fetchedScoreRange.range);

      if (editedMinimumScore) {
        const maximumScoreMatch = parseInt(rangeMatch![2], 10) - 1;
        range = `[${minimumScore}, ${maximumScoreMatch}]`;
      } else if (editedMaximumScore) {
        const minimumScoreMatch = rangeMatch![1];
        range = `[${minimumScoreMatch}, ${maximumScore}]`;
      }

      filtered = {
        range,
        ...omit(screeningToolScoreRange, ['minimumScore', 'maximumScore']),
      };
    }

    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(screeningToolScoreRangeId, filtered);
  }

  static async get(
    screeningToolScoreRangeId: string,
    txn: Transaction,
  ): Promise<ScreeningToolScoreRange> {
    const screeningToolScoreRange = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: screeningToolScoreRangeId, deletedAt: null });

    if (!screeningToolScoreRange) {
      return Promise.reject(`No such screening tool score range: ${screeningToolScoreRangeId}`);
    }

    return screeningToolScoreRange;
  }

  static async getForScreeningTool(
    screeningToolId: string,
    txn: Transaction,
  ): Promise<ScreeningToolScoreRange[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null, screeningToolId });
  }

  static async getByScoreForScreeningTool(
    score: number,
    screeningToolId: string,
    txn: Transaction,
  ): Promise<ScreeningToolScoreRange | null> {
    const screeningToolScoreRange = await this.query(txn)
      .eager(EAGER_QUERY)
      // @> == 'contains element'
      .whereRaw('"range" @> ?::int4 and "screeningToolId" = ?', [score, screeningToolId])
      .findOne({ deletedAt: null });

    if (!screeningToolScoreRange) {
      return null;
    }

    return screeningToolScoreRange;
  }

  static async getAll(txn: Transaction): Promise<ScreeningToolScoreRange[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null });
  }

  static async delete(
    screeningToolScoreRangeId: string,
    txn: Transaction,
  ): Promise<ScreeningToolScoreRange> {
    await this.query(txn)
      .where({ id: screeningToolScoreRangeId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const screeningToolScoreRange = await this.query(txn).findById(screeningToolScoreRangeId);
    if (!screeningToolScoreRange) {
      return Promise.reject(`No such screeningToolScoreRange: ${screeningToolScoreRangeId}`);
    }
    return screeningToolScoreRange;
  }
}
/* tslint:enable:member-ordering */
