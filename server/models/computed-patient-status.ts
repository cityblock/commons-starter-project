import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import PatientDataFlag from './patient-data-flag';
import User from './user';

interface IComputedStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
  isIneligible: boolean;
  isDisenrolled: boolean;
}

/* tslint:disable:member-ordering */
export default class ComputedPatientStatus extends BaseModel {
  patientId: string;
  patient: Patient;
  updatedById: string;
  updatedBy: User;
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
  isIneligible: boolean;
  isDisenrolled: boolean;

  static tableName = 'computed_patient_status';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 },
      updatedById: { type: 'string', minLength: 1 },
      isCoreIdentityVerified: { type: 'boolean' },
      isDemographicInfoUpdated: { type: 'boolean' },
      isEmergencyContactAdded: { type: 'boolean' },
      isAdvancedDirectivesAdded: { type: 'boolean' },
      isConsentSigned: { type: 'boolean' },
      isPhotoAddedOrDeclined: { type: 'boolean' },
      isIneligible: { type: 'boolean' },
      isDisenrolled: { type: 'boolean' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: [
      'patientId',
      'updatedById',
      'isCoreIdentityVerified',
      'isDemographicInfoUpdated',
      'isEmergencyContactAdded',
      'isAdvancedDirectivesAdded',
      'isConsentSigned',
      'isPhotoAddedOrDeclined',
      'isIneligible',
      'isDisenrolled',
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
    const patient = await Patient.get(patientId, txn);
    const { patientInfo } = patient;
    const patientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);

    const isCoreIdentityVerified =
      (!!patient.coreIdentityVerifiedAt && !!patient.coreIdentityVerifiedById) ||
      patientDataFlags.length > 0;
    const isDemographicInfoUpdated = !!patientInfo.updatedAt;
    const isEmergencyContactAdded = false;
    const isAdvancedDirectivesAdded = false;
    const isConsentSigned = false;
    const isPhotoAddedOrDeclined = false;
    const isIneligible = false;
    const isDisenrolled = false;

    return {
      isCoreIdentityVerified,
      isDemographicInfoUpdated,
      isEmergencyContactAdded,
      isAdvancedDirectivesAdded,
      isConsentSigned,
      isPhotoAddedOrDeclined,
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
    const currentStatus = await this.computeCurrentStatus(patientId, txn);

    // Finally, create and return a new record
    return this.query(txn).insertAndFetch({
      patientId,
      updatedById,
      ...currentStatus,
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
