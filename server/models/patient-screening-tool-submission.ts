import { Model, RelationMappings } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import RiskArea from './risk-area';
import ScreeningTool from './screening-tool';
import User from './user';

export interface IPatientScreeningToolSubmissionCreateFields {
  screeningToolId: string;
  patientId: string;
  userId: string;
  score: number;
}

export interface IPatientScreeningToolSubmissionEditableFields {
  screeningToolId?: string;
  patientId?: string;
  userId?: string;
  score?: number;
}

export const EAGER_QUERY = '[screeningTool, patient, user, riskArea]';

/* tslint:disable:member-ordering */
export default class PatientScreeningToolSubmission extends BaseModel {
  screeningToolId: string;
  screeningTool: ScreeningTool;
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  score: number;
  riskArea: RiskArea;

  static tableName = 'patient_screening_tool_submission';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      screeningToolId: { type: 'string' },
      patientId: { type: 'string' },
      userId: { type: 'string' },
      score: { type: 'integer' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    screeningTool: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'screening-tool',
      join: {
        from: 'patient_screening_tool_submission.screeningToolId',
        to: 'screening_tool.id',
      },
    },

    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_screening_tool_submission.patientId',
        to: 'patient.id',
      },
    },

    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_screening_tool_submission.userId',
        to: 'user.id',
      },
    },

    riskArea: {
      relation: Model.HasOneThroughRelation,
      modelClass: 'risk-area',
      join: {
        from: 'patient_screening_tool_submission.screeningToolId',
        through: {
          modelClass: 'screening-tool',
          from: 'screening_tool.id',
          to: 'screening_tool.riskAreaId',
        },
        to: 'risk_area.id',
      },
    },
  };

  static async create(
    input: IPatientScreeningToolSubmissionCreateFields,
  ): Promise<PatientScreeningToolSubmission> {
    return await this.query()
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async edit(
    patientScreeningToolSubmissionId: string,
    patientScreeningToolSubmission: IPatientScreeningToolSubmissionEditableFields,
  ): Promise<PatientScreeningToolSubmission> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientScreeningToolSubmissionId, patientScreeningToolSubmission);
  }

  static async get(
    patientScreeningToolSubmissionId: string,
  ): Promise<PatientScreeningToolSubmission> {
    const patientScreeningToolSubmission = await this.query()
      .eager(EAGER_QUERY)
      .findOne({ id: patientScreeningToolSubmissionId, deletedAt: null });

    if (!patientScreeningToolSubmission) {
      return Promise.reject(
        `No such patient screening tool submission: ${patientScreeningToolSubmissionId}`,
      );
    }

    return patientScreeningToolSubmission;
  }

  static async getForPatient(
    patientId: string,
    screeningToolId?: string,
  ): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns *all* submissions (including deleted ones)
    if (screeningToolId) {
      return await this.query()
        .eager(EAGER_QUERY)
        .where({ patientId, screeningToolId });
    }

    return await this.query()
      .eager(EAGER_QUERY)
      .where({ patientId });
  }

  static async getAll(): Promise<PatientScreeningToolSubmission[]> {
    // Note that this returns only current submissions (not deleted ones)
    return await this.query()
      .eager(EAGER_QUERY)
      .where({ deletedAt: null });
  }

  static async delete(
    patientScreeningToolSubmissionId: string,
  ): Promise<PatientScreeningToolSubmission> {
    await this.query()
      .where({ id: patientScreeningToolSubmissionId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const patientScreeningToolSubmission = await this.query().findById(
      patientScreeningToolSubmissionId,
    );
    if (!patientScreeningToolSubmission) {
      return Promise.reject(
        `No such patientScreeningToolSubmission: ${patientScreeningToolSubmissionId}`,
      );
    }
    return patientScreeningToolSubmission;
  }
}
/* tslint:disable:member-ordering */
