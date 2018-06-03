import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';

export interface IPatientSiuEventOptions {
  patientId: string;
  visitId: string;
  transmissionId: number;
  googleEventId: string;
  deletedAt?: string;
}

export interface IPatientSiuEventEditOptions {
  transmissionId: number;
  deletedAt?: string;
}

/* tslint:disable:member-ordering */
export default class PatientSiuEvent extends BaseModel {
  patientId!: string;
  visitId!: string;
  transmissionId!: number;
  googleEventId!: string;

  static tableName = 'patient_siu_event';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      visitId: { type: 'string' },
      transmissionId: { type: 'integer' },
      googleEventId: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['patientId', 'visitId', 'transmissionId', 'googleEventId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_siu_event.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async getByVisitId(visitId: string, txn: Transaction): Promise<PatientSiuEvent | null> {
    const siuEvent = await this.query(txn).findOne({ visitId, deletedAt: null });

    if (!siuEvent) {
      return null;
    }

    return siuEvent;
  }

  static async create(
    options: IPatientSiuEventOptions,
    txn: Transaction,
  ): Promise<PatientSiuEvent> {
    return this.query(txn).insert(options);
  }

  static async edit(
    id: string,
    options: IPatientSiuEventEditOptions,
    txn: Transaction,
  ): Promise<PatientSiuEvent> {
    return this.query(txn).patchAndFetchById(id, options);
  }

  static async editByVisitId(
    visitId: string,
    options: IPatientSiuEventEditOptions,
    txn: Transaction,
  ): Promise<PatientSiuEvent> {
    return this.query(txn)
      .where({ visitId, deletedAt: null })
      .patchAndFetch(options);
  }
}
/* tslint:enable:member-ordering */
