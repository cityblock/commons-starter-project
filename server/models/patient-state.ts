import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';

export type CurrentState =
  | 'attributed'
  | 'assigned'
  | 'outreach'
  | 'consented'
  | 'enrolled'
  | 'disenrolled'
  | 'ineligible';

const CURRENT_STATE: CurrentState[] = [
  'attributed',
  'assigned',
  'outreach',
  'consented',
  'enrolled',
  'disenrolled',
  'ineligible',
];

interface IUpdatePatientState {
  patientId: string;
  updatedById: string;
  currentState: CurrentState;
}

/* tslint:disable:member-ordering */
export default class PatientState extends BaseModel {
  patientId: string;
  updatedById: string;
  currentState: CurrentState;

  static tableName = 'patient_state';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 },
      updatedById: { type: 'string', minLength: 1 },
      currentState: { type: 'string', enum: CURRENT_STATE },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'updatedById', 'currentState'],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_state.patientId',
        to: 'patient.id',
      },
    },
  };

  static async getForPatient(patientId: string, txn: Transaction): Promise<PatientState | null> {
    const patientState = await this.query(txn)
      .orderBy('createdAt', 'desc') // Just in case old ones have not been properly deleted
      .findOne({ patientId, deletedAt: null });

    if (!patientState) {
      return null;
    }

    return patientState;
  }

  static async updateForPatient(
    patientState: IUpdatePatientState,
    txn: Transaction,
  ): Promise<PatientState> {
    // Mark all old PatientState records as deleted
    await this.query(txn)
      .where({ patientId: patientState.patientId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    return this.query(txn).insertAndFetch({ ...patientState });
  }
}
/* tslint:enable:member-ordering */
