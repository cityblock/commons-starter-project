import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import CareTeam from './care-team';
import Patient from './patient';
import ProgressNote from './progress-note';
import User from './user';

interface IComputedStatus {
  hasCareTeamMember: boolean;
  hasProgressNote: boolean;
  coreIdVerified: boolean;
  consentsSigned: boolean;
  hasPcp: boolean;
  isIneligible: boolean;
  isDisenrolled: boolean;
}

/* tslint:disable:member-ordering */
export default class ComputedPatientStatus extends BaseModel {
  patientId: string;
  patient: Patient;
  updatedById: string;
  updatedBy: User;
  hasCareTeamMember: boolean;
  hasProgressNote: boolean;
  coreIdVerified: boolean;
  consentsSigned: boolean;
  hasPcp: boolean;
  isIneligible: boolean;
  isDisenrolled: boolean;

  static tableName = 'computed_patient_status';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 },
      updatedById: { type: 'string', minLength: 1 },
      hasCareTeamMember: { type: 'boolean' },
      hasProgressNote: { type: 'boolean' },
      coreIdVerified: { type: 'boolean' },
      consentsSigned: { type: 'boolean' },
      hasPcp: { type: 'boolean' },
      isIneligible: { type: 'boolean' },
      isDisenrolled: { type: 'boolean' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: [
      'patientId',
      'hasCareTeamMember',
      'coreIdVerified',
      'consentsSigned',
      'hasPcp',
      'isIneligible',
      'isDisenrolled',
      'updatedById',
    ],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'computed_patient_status.patientId',
        to: 'patient.id',
      },
    },

    updatedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'computed_patient_status.updatedById',
        to: 'user.id',
      },
    },
  };

  static async computeCurrentStatus(patientId: string, txn: Transaction): Promise<IComputedStatus> {
    // TODO: When possible, actually calculate all of these values
    const hasCareTeamMember = (await CareTeam.getCountForPatient(patientId, txn)) > 0;
    const hasProgressNote = (await ProgressNote.getCountForPatient(patientId, txn)) > 0;
    const coreIdVerified = false;
    const consentsSigned = false;
    const hasPcp = false;
    const isIneligible = false;
    const isDisenrolled = false;

    return {
      hasCareTeamMember,
      hasProgressNote,
      coreIdVerified,
      consentsSigned,
      hasPcp,
      isIneligible,
      isDisenrolled,
    };
  }

  static async getForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<ComputedPatientStatus | null> {
    const computedPatientStatus = await this.query(txn)
      .orderBy('createdAt', 'desc') // Just in case old ones have not been properly deleted
      .findOne({ patientId, deletedAt: null });

    if (!computedPatientStatus) {
      return null;
    }

    return computedPatientStatus;
  }

  static async updateForPatient(
    patientId: string,
    updatedById: string,
    txn: Transaction,
  ): Promise<ComputedPatientStatus> {
    // First, mark all old ComputedPatientStatus records as deleted
    await this.query(txn)
      .where({ patientId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    // Next, calculate all required datapoints
    const {
      hasCareTeamMember,
      hasProgressNote,
      coreIdVerified,
      consentsSigned,
      hasPcp,
      isIneligible,
      isDisenrolled,
    } = await this.computeCurrentStatus(patientId, txn);

    // Finally, create and return a new record
    return this.query(txn).insertAndFetch({
      patientId,
      updatedById,
      hasCareTeamMember,
      hasProgressNote,
      coreIdVerified,
      consentsSigned,
      hasPcp,
      isIneligible,
      isDisenrolled,
    });
  }

  /* NOTE: only use within Patient.create. This function is just for safety to ensure this is the
   *       place where we don't pass in an updatedById
   */
  static async createInitialComputedStatusForPatient(
    patientId: string,
    updatedById: string,
    txn: Transaction,
  ): Promise<ComputedPatientStatus> {
    // Just to be extra safe
    await this.query(txn)
      .where({ patientId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const {
      hasCareTeamMember,
      hasProgressNote,
      coreIdVerified,
      consentsSigned,
      hasPcp,
      isIneligible,
      isDisenrolled,
    } = await this.computeCurrentStatus(patientId, txn);

    return this.query(txn).insertAndFetch({
      patientId,
      hasCareTeamMember,
      hasProgressNote,
      coreIdVerified,
      consentsSigned,
      hasPcp,
      isIneligible,
      isDisenrolled,
      updatedById,
    });
  }

  static async updateForAllPatients(updatedById: string, txn: Transaction): Promise<number> {
    /* DANGER: This can potentially take a *really long time* to run, and affects every patient.
     *         Use at your own risk and only if absolutely necessary.
     */

    const patientIds = await Patient.getAllIds(txn);

    await Promise.all(
      patientIds.map(async patientId =>
        ComputedPatientStatus.updateForPatient(patientId, updatedById, txn),
      ),
    );

    return patientIds.length;
  }
}
/* tslint:enable:member-ordering */
