import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Patient from './patient';
import Task from './task';

export interface IPatientGoalEditableFields {
  title: string;
  patientId: string;
  goalSuggestionTemplateId?: string;
  patientConcernId?: string;
}

/* tslint:disable:member-ordering */
export default class PatientGoal extends Model {
  id: string;
  title: string;
  patient: Patient;
  patientId: string;
  goalSuggestionTemplateId?: string;
  patientConcernId?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'patient_goal';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      patientId: { type: 'string' },
      goalSuggestionTemplateId: { type: 'string' },
      patientConcernId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_goal.patientId',
        to: 'patient.id',
      },
    },
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: 'task',
      join: {
        from: 'patient_goal.id',
        to: 'task.patientGoalId',
      },
    },
    patientConcern: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient-concern',
      join: {
        from: 'patient_goal.patientConcernId',
        to: 'patient_concern.id',
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

  static async get(patientGoalId: string): Promise<PatientGoal | undefined> {
    const patientGoal = await this
      .query()
      .findById(patientGoalId);

    if (!patientGoal) {
      return Promise.reject(`No such patientGoal: ${patientGoalId}`);
    }
    return patientGoal;
  }

  static async create(input: IPatientGoalEditableFields) {
    return await this
      .query()
      .insertAndFetch(input);
  }

  static async update(
    patientGoalId: string, patientGoal: Partial<IPatientGoalEditableFields>,
  ): Promise<PatientGoal> {
    return await this
      .query()
      .updateAndFetchById(patientGoalId, patientGoal);
  }

  static async getForPatient(patientId: string): Promise<PatientGoal[]> {
    return await this.query()
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('createdAt', 'asc');
  }

  static async delete(patientGoalId: string): Promise<PatientGoal> {
    return await this.query()
      .updateAndFetchById(patientGoalId, {
        deletedAt: new Date().toISOString(),
      });
  }
}
/* tslint:disable:member-ordering */
