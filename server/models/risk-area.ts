import { last, values } from 'lodash';
import { Model, RelationMappings } from 'objection';
import { IRiskAreaStatistic, IRiskAreaSummary, IThreeSixtySummary } from 'schema';
import * as uuid from 'uuid/v4';
import PatientAnswer from './patient-answer';
import Question from './question';

export interface IRiskAreaEditableFields {
  title: string;
  order: number;
}

export interface IRiskScore {
  score: number;
  forceHighRisk: boolean;
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

  // TODO: Add cross-risk-score methods
  static async getSummaryForPatient(
    riskAreaId: string, patientId: string,
  ): Promise<IRiskAreaSummary> {
    const patientAnswers = await PatientAnswer.getForRiskArea(riskAreaId, patientId, 'answer');
    const summary: string[] = [];
    patientAnswers.forEach(patientAnswer => {
      if (patientAnswer.applicable) {
        const answer = patientAnswer.answer;
        if (answer.inSummary && answer.summaryText) {
          summary.push(answer.summaryText);
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
/* tslint:disable:member-ordering */
