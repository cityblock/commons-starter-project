import { last, values } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { IRiskAreaStatistic, IRiskAreaSummary, IThreeSixtySummary } from 'schema';
import BaseModel from './base-model';
import PatientAnswer from './patient-answer';
import Question from './question';
import RiskAreaGroup from './risk-area-group';

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
  id: string;
  title: string;
  riskAreaGroupId: string;
  assessmentType: AssessmentType;
  riskAreaGroup: RiskAreaGroup;
  questions: Question[];
  order: number;
  mediumRiskThreshold: number;
  highRiskThreshold: number;

  static tableName = 'risk_area';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      assessmentType: { type: 'string', enum: ['manual', 'automated'] },
      riskAreaGroupId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      order: { type: 'integer' },
      mediumRiskThreshold: { type: 'integer', minimum: 1 },
      highRiskThreshold: { type: 'integer', minimum: 1 },
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
    riskAreaGroup: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'risk-area-group',
      join: {
        from: 'risk_area.riskAreaGroupId',
        to: 'risk_area_group.id',
      },
    },
  };

  static async get(riskAreaId: string): Promise<RiskArea> {
    const riskArea = await this.query()
      .eager(EAGER_QUERY)
      .findOne({ id: riskAreaId, deletedAt: null });

    if (!riskArea) {
      return Promise.reject(`No such risk area: ${riskAreaId}`);
    }
    return riskArea;
  }

  static async getAll(): Promise<RiskArea[]> {
    return this.query()
      .eager(EAGER_QUERY)
      .orderBy('order')
      .where({ deletedAt: null });
  }

  static async create(input: IRiskAreaEditableFields, txn?: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(
    riskArea: Partial<IRiskAreaEditableFields>,
    riskAreaId: string,
  ): Promise<RiskArea> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(riskAreaId, riskArea);
  }

  static async delete(riskAreaId: string): Promise<RiskArea> {
    await this.query()
      .where({ id: riskAreaId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const riskArea = await this.query()
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
  ): Promise<IRiskAreaSummary> {
    const patientAnswers = await PatientAnswer.getForRiskArea(riskAreaId, patientId, 'answer');
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

  static async getRiskScoreForPatient(riskAreaId: string, patientId: string): Promise<IRiskScore> {
    const patientAnswers = await PatientAnswer.getForRiskArea(riskAreaId, patientId, 'answer');
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

  static async getThreeSixtySummaryForPatient(patientId: string): Promise<IThreeSixtySummary> {
    const patientAnswers = await PatientAnswer.getAllForPatient(patientId);
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
