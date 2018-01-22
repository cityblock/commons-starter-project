import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import PatientScreeningToolSubmission from './patient-screening-tool-submission';
import RiskArea from './risk-area';
import ScreeningToolScoreRange from './screening-tool-score-range';

interface IScreeningToolCreateFields {
  title: string;
  riskAreaId: string;
}

interface IScreeningToolEditableFields {
  title?: string;
  riskAreaId?: string;
  deletedAt?: string;
}

export const EAGER_QUERY =
  '[riskArea.[riskAreaGroup], screeningToolScoreRanges.[concernSuggestions, goalSuggestions.[taskTemplates]]]';

/* tslint:disable:member-ordering */
export default class ScreeningTool extends BaseModel {
  title: string;
  riskAreaId: string;
  riskArea: RiskArea;
  screeningToolScoreRanges: ScreeningToolScoreRange[];
  patientScreeningToolSubmissions: PatientScreeningToolSubmission[];

  static tableName = 'screening_tool';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      riskAreaId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
    },
    required: ['title', 'riskAreaId'],
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
    patientScreeningToolSubmissions: {
      relation: Model.HasManyRelation,
      modelClass: 'patient-screening-tool-submission',
      join: {
        from: 'patient_screening_tool_submission.screeningToolId',
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

  static async create(input: IScreeningToolCreateFields, txn: Transaction): Promise<ScreeningTool> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    screeningToolId: string,
    screeningTool: IScreeningToolEditableFields,
    txn: Transaction,
  ): Promise<ScreeningTool> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(screeningToolId, screeningTool);
  }

  static async get(screeningToolId: string, txn: Transaction): Promise<ScreeningTool> {
    const screeningTool = await this.query(txn)
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

  static async getForRiskArea(riskAreaId: string, txn: Transaction): Promise<ScreeningTool[]> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null, riskAreaId })
      .orderBy('createdAt', 'asc');
  }

  static async getAll(txn: Transaction): Promise<ScreeningTool[]> {
    return await this.query(txn)
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
      .where({ deletedAt: null })
      .orderBy('createdAt', 'asc');
  }

  static async delete(screeningToolId: string, txn: Transaction): Promise<ScreeningTool> {
    await this.query(txn)
      .where({ id: screeningToolId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
    const screeningTool = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(screeningToolId);
    if (!screeningTool) {
      return Promise.reject(`No such screeningTool: ${screeningToolId}`);
    }
    return screeningTool;
  }
}
/* tslint:enable:member-ordering */
