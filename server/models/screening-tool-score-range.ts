import { isNumber, omit } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import ScreeningTool from './screening-tool';

interface IScreeningToolScoreRangeCreateFields {
  screeningToolId: string;
  description: string;
  minimumScore: number;
  maximumScore: number;
}

interface IScreeningToolScoreRangeEditableFields {
  description?: string;
  screeningToolId?: string;
  minimumScore?: number;
  maximumScore?: number;
  deletedAt?: string;
}

export const EAGER_QUERY = '[screeningTool]';
export const RANGE_REGEX = /\[(\d+),(\d+)\)/;

/* tslint:disable:member-ordering */
export default class ScreeningToolScoreRange extends BaseModel {
  screeningToolId: string;
  screeningTool: ScreeningTool;
  description: string;
  range: string;

  static tableName = 'screening_tool_score_range';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      screeningToolId: { type: 'string' },
      description: { type: 'string' },
      range: { type: 'int4range' },
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
  ): Promise<ScreeningToolScoreRange> {
    const { minimumScore, maximumScore } = input;

    const range = `[${minimumScore}, ${maximumScore}]`;

    const filtered = {
      range,
      ...omit<IScreeningToolScoreRangeCreateFields, {}>(input, ['minimumScore', 'maximumScore']),
    };

    return await this.query()
      .eager(EAGER_QUERY)
      .insertAndFetch(filtered);
  }

  static async edit(
    screeningToolScoreRangeId: string,
    screeningToolScoreRange: IScreeningToolScoreRangeEditableFields,
  ): Promise<ScreeningToolScoreRange> {
    const { minimumScore, maximumScore } = screeningToolScoreRange;
    const editedMinimumScore = isNumber(minimumScore);
    const editedMaximumScore = isNumber(maximumScore);
    const fetchedScoreRange = await this.get(screeningToolScoreRangeId);
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

    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(screeningToolScoreRangeId, filtered);
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
    txn?: Transaction,
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
/* tslint:enable:member-ordering */
