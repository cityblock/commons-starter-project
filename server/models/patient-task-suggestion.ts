import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import TaskTemplate from './task-template';
import User from './user';

export interface IPatientTaskSuggestionCreateArgs {
  patientId: string;
  taskTemplateId: string;
}

export interface IPatientTaskSuggestionCreateMultipleArgs {
  suggestions: IPatientTaskSuggestionCreateArgs[];
}

export interface IPatientTaskSuggestionDismissArgs {
  patientTaskSuggestionId: string;
  dismissedById: string;
  dismissedReason: string;
}

const EAGER_QUERY = '[patient, taskTemplate, acceptedBy, dismissedBy]';

/* tslint:disable:member-ordering */
export default class PatientTaskSuggestion extends BaseModel {
  patientId: string;
  patient: Patient;
  taskTemplateId?: string;
  taskTemplate?: TaskTemplate;
  acceptedById?: string;
  acceptedBy?: User;
  acceptedAt?: string;
  dismissedById?: string;
  dismissedBy?: User;
  dismissedReason?: string;
  dismissedAt?: string;

  static tableName = 'patient_task_suggestion';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      taskTemplateId: { type: 'string' },
      dismissedById: { type: 'string' },
      dismissedReason: { type: 'string' },
      dismissedAt: { type: 'string' },
      acceptedAt: { type: 'string' },
      acceptedById: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_task_suggestion.patientId',
        to: 'patient.id',
      },
    },
    taskTemplate: {
      relation: Model.HasOneRelation,
      modelClass: 'task-template',
      join: {
        from: 'patient_task_suggestion.taskTemplateId',
        to: 'task_template.id',
      },
    },
    acceptedBy: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_task_suggestion.acceptedById',
        to: 'user.id',
      },
    },
    dismissedBy: {
      relation: Model.HasOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_task_suggestion.dismissedById',
        to: 'user.id',
      },
    },
  };

  static async get(
    taskSuggestionId: string,
    txn?: Transaction,
  ): Promise<PatientTaskSuggestion | undefined> {
    const taskSuggestion = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(taskSuggestionId);

    if (!taskSuggestion) {
      return Promise.reject(`No such patientTaskSuggestion: ${taskSuggestionId}`);
    }
    return taskSuggestion;
  }

  static async create(
    input: IPatientTaskSuggestionCreateArgs,
    txn?: Transaction,
  ): Promise<PatientTaskSuggestion> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async createMultiple(
    input: IPatientTaskSuggestionCreateMultipleArgs,
    txn?: Transaction,
  ): Promise<PatientTaskSuggestion[]> {
    const { suggestions } = input;

    return await this.query(txn).insertGraphAndFetch(suggestions);
  }

  static async getForPatient(
    patientId: string,
    txn?: Transaction,
  ): Promise<PatientTaskSuggestion[]> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .where({
        dismissedAt: null,
        acceptedAt: null,
        patientId,
      })
      .orderBy('createdAt', 'asc');
  }

  static async accept(
    patientTaskSuggestionId: string,
    acceptedById: string,
    txn?: Transaction,
  ): Promise<PatientTaskSuggestion> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientTaskSuggestionId, {
        acceptedAt: new Date().toISOString(),
        acceptedById,
      });
  }

  static async dismiss(input: IPatientTaskSuggestionDismissArgs): Promise<PatientTaskSuggestion> {
    const { patientTaskSuggestionId, dismissedById, dismissedReason } = input;
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(patientTaskSuggestionId, {
        dismissedById,
        dismissedReason,
        dismissedAt: new Date().toISOString(),
      });
  }
}
/* tslint:enable:member-ordering */
