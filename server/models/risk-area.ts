import { last, values } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { IRiskAreaStatistic, IRiskAreaSummary, IThreeSixtySummary } from 'schema';
import BaseModel from './base-model';
import PatientAnswer from './patient-answer';
import Question from './question';
import RiskAreaAssessmentSubmission from './risk-area-assessment-submission';
import RiskAreaGroup from './risk-area-group';
import ScreeningTool from './screening-tool';

interface IRiskAreaEditableFields {
  title: string;
  riskAreaGroupId: string;
  assessmentType: AssessmentType;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
}

export interface IRiskScore {
  score: number;
  forceHighRisk: boolean;
}

export type AssessmentType = 'manual' | 'automated';

const EAGER_QUERY = '[riskAreaGroup]';

/* tslint:disable:member-ordering */
// 360 Domain
export default class RiskArea extends BaseModel {
  title: string;
  assessmentType: AssessmentType;
  riskAreaGroupId: string;
  riskAreaGroup: RiskAreaGroup;
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;
  questions: Question[];
  screeningTools: ScreeningTool[];
  riskAreaAssessmentSubmissions: RiskAreaAssessmentSubmission[];

  static tableName = 'risk_area';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 },
      assessmentType: { type: 'string', enum: ['manual', 'automated'] },
      riskAreaGroupId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      order: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      mediumRiskThreshold: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      highRiskThreshold: { type: 'integer', minimum: 1 }, // cannot be zero or negative
      createdAt: { type: 'string' },
    },
    required: [
      'title',
      'assessmentType',
      'riskAreaGroupId',
      'order',
      'mediumRiskThreshold',
      'highRiskThreshold',
    ],
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
    riskAreaGroup: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'risk-area-group',
      join: {
        from: 'risk_area.riskAreaGroupId',
        to: 'risk_area_group.id',
      },
    },
    riskAreaAssessmentSubmissions: {
      relation: Model.HasManyRelation,
      modelClass: 'risk-area-assessment-submission',
      join: {
        from: 'risk_area.id',
        to: 'risk_area_assessment_submission.riskAreaId',
      },
    },
    screeningTools: {
      relation: Model.HasManyRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'screening_tool.riskAreaId',
        to: 'risk_area.id',
      },
    },
  };

  static async get(riskAreaId: string, txn: Transaction): Promise<RiskArea> {
    const riskArea = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: riskAreaId, deletedAt: null });

    if (!riskArea) {
      return Promise.reject(`No such risk area: ${riskAreaId}`);
    }
    return riskArea;
  }

  static async getAll(txn: Transaction): Promise<RiskArea[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ deletedAt: null })
      .orderBy('order', 'asc')
      .orderBy('title', 'asc');
  }

  static async create(input: IRiskAreaEditableFields, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    riskArea: Partial<IRiskAreaEditableFields>,
    riskAreaId: string,
    txn: Transaction,
  ): Promise<RiskArea> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(riskAreaId, riskArea);
  }

  static async delete(riskAreaId: string, txn: Transaction): Promise<RiskArea> {
    await this.query(txn)
      .where({ id: riskAreaId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const riskArea = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(riskAreaId);
    if (!riskArea) {
      return Promise.reject(`No such riskArea: ${riskAreaId}`);
    }
    return riskArea;
  }

  // TODO: Add cross-risk-score methods
  static async getSummaryForPatient(
    riskAreaId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<IRiskAreaSummary> {
    const patientAnswers = await PatientAnswer.getForRiskArea(riskAreaId, patientId, txn);
    const summary: string[] = [];
    patientAnswers.forEach(patientAnswer => {
      if (patientAnswer.applicable) {
        const answer = patientAnswer.answer;
        if (answer.inSummary && answer.summaryText) {
          const { summaryText } = answer;
          const { answerValue } = patientAnswer;

          const injectedAnswerRegex = /\{answer\}/;
          const needsInjectedAnswer = injectedAnswerRegex.test(summaryText);

          if (needsInjectedAnswer) {
            summary.push(summaryText.replace(injectedAnswerRegex, answerValue));
          } else {
            summary.push(summaryText);
          }
        }
      }
    });

    const lastUpdatedAnswer = last(patientAnswers);
    const lastUpdated = lastUpdatedAnswer ? lastUpdatedAnswer.updatedAt : null;

    return { summary, started: !!patientAnswers.length, lastUpdated };
  }

  static async getRiskScoreForPatient(
    riskAreaId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<IRiskScore> {
    const patientAnswers = await PatientAnswer.getForRiskArea(riskAreaId, patientId, txn);
    let score: number = 0;
    let forceHighRisk: boolean = false;
    patientAnswers.forEach(patientAnswer => {
      if (patientAnswer.applicable) {
        const answer = patientAnswer.answer;
        if (answer.riskAdjustmentType === 'increment') {
          score++;
        } else if (answer.riskAdjustmentType === 'forceHighRisk') {
          forceHighRisk = true;
        }
      }
    });
    return {
      score,
      forceHighRisk,
    };
  }

  static async getThreeSixtySummaryForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<IThreeSixtySummary> {
    const patientAnswers = await PatientAnswer.getAllForPatient(patientId, txn);
    const knownRiskAreas: { [riskAreaId: string]: IRiskAreaStatistic } = {};

    patientAnswers.forEach(patientAnswer => {
      if (patientAnswer.applicable) {
        // TODO: update association here so that patientAnswer can just associate directly
        const riskArea = patientAnswer.answer.question.riskArea;
        const riskAreaStats = knownRiskAreas[riskArea.id] || {
          riskArea,
          summaryData: { summary: [], started: true, lastUpdated: null },
          scoreData: { score: 0, forceHighRisk: false },
        };

        const answer = patientAnswer.answer;

        if (answer.riskAdjustmentType === 'increment') {
          riskAreaStats.scoreData.score++;
        } else if (answer.riskAdjustmentType === 'forceHighRisk') {
          riskAreaStats.scoreData.forceHighRisk = true;
        }

        if (answer.inSummary && answer.summaryText) {
          riskAreaStats.summaryData.summary.push(answer.summaryText);
        }

        knownRiskAreas[riskArea.id] = riskAreaStats;
      }
    });

    return { riskAreas: values(knownRiskAreas) };
  }
}
/* tslint:enable:member-ordering */
