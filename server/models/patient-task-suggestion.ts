import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import TaskTemplate from './task-template';
import User from './user';

interface IPatientTaskSuggestionCreateArgs {
  patientId: string;
  taskTemplateId: string;
}

interface IPatientTaskSuggestionCreateMultipleArgs {
  suggestions: IPatientTaskSuggestionCreateArgs[];
}

interface IPatientTaskSuggestionDismissArgs {
  patientTaskSuggestionId: string;
  dismissedById: string;
  dismissedReason: string;
}

const EAGER_QUERY = '[patient.[patientInfo], taskTemplate, acceptedBy, dismissedBy]';

/* tslint:disable:member-ordering */
export default class PatientTaskSuggestion extends BaseModel {
  patientId: string;
  patient: Patient;
  taskTemplateId: string | null;
  taskTemplate: TaskTemplate | null;
  acceptedById: string | null;
  acceptedBy: User | null;
  acceptedAt: string | null;
  dismissedById: string | null;
  dismissedBy: User | null;
  dismissedReason: string | null;
  dismissedAt: string | null;

  static tableName = 'patient_task_suggestion';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      taskTemplateId: { type: 'string', minLength: 1 }, // cannot be blank
      dismissedById: { type: 'string' },
      dismissedReason: { type: 'string' },
      dismissedAt: { type: 'string' },
      acceptedAt: { type: 'string' },
      acceptedById: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['patientId', 'taskTemplateId'],
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
    txn: Transaction,
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
    txn: Transaction,
  ): Promise<PatientTaskSuggestion> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .insertAndFetch(input);
  }

  static async createMultiple(
    input: IPatientTaskSuggestionCreateMultipleArgs,
    txn: Transaction,
  ): Promise<PatientTaskSuggestion[]> {
    const { suggestions } = input;

    return this.query(txn).insertGraphAndFetch(suggestions);
  }

  static async getForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientTaskSuggestion[]> {
    return this.query(txn)
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
    txn: Transaction,
  ): Promise<PatientTaskSuggestion> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientTaskSuggestionId, {
        acceptedAt: new Date().toISOString(),
        acceptedById,
      });
  }

  static async dismiss(
    input: IPatientTaskSuggestionDismissArgs,
    txn: Transaction,
  ): Promise<PatientTaskSuggestion> {
    const { patientTaskSuggestionId, dismissedById, dismissedReason } = input;
    return this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(patientTaskSuggestionId, {
        dismissedById,
        dismissedReason,
        dismissedAt: new Date().toISOString(),
      });
  }
}
/* tslint:enable:member-ordering */
