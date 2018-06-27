import { find, isNil } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { CurrentPatientState, UserRole } from 'schema';
import BaseModel from './base-model';
import CareTeam from './care-team';
import Patient from './patient';
import PatientContact from './patient-contact';
import PatientDataFlag from './patient-data-flag';
import PatientDocument, { CONSENT_TYPES } from './patient-document';
import PatientState from './patient-state';
import ProgressNote from './progress-note';
import User from './user';

export interface IComputedStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
  hasProgressNote: boolean;
  hasCareTeam: boolean;
  hasChp: boolean;
  hasPcp: boolean;
  isAssessed: boolean;
  isIneligible: boolean;
  isDisenrolled: boolean;
}

/* tslint:disable:member-ordering */
export default class ComputedPatientStatus extends BaseModel {
  patientId!: string;
  patient!: Patient;
  updatedById!: string;
  updatedBy!: User;
  isCoreIdentityVerified!: boolean;
  isDemographicInfoUpdated!: boolean;
  isEmergencyContactAdded!: boolean;
  isAdvancedDirectivesAdded!: boolean;
  isConsentSigned!: boolean;
  isPhotoAddedOrDeclined!: boolean;
  hasProgressNote!: boolean;
  hasCareTeam!: boolean;
  hasChp!: boolean;
  hasPcp!: boolean;
  isAssessed!: boolean;
  isIneligible!: boolean;
  isDisenrolled!: boolean;

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
      hasProgressNote: { type: 'boolean' },
      hasChp: { type: 'boolean' },
      hasPcp: { type: 'boolean' },
      hasCareTeam: { type: 'boolean' },
      isAssessed: { type: 'boolean' },
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
      'hasProgressNote',
      'hasCareTeam',
      'hasChp',
      'hasPcp',
      'isAssessed',
      'isIneligible',
      'isDisenrolled',
    ],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'computed_patient_status.patientId',
          to: 'patient.id',
        },
      },

      updatedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'computed_patient_status.updatedById',
          to: 'user.id',
        },
      },
    };
  }

  static async computeCurrentStatus(patientId: string, txn: Transaction): Promise<IComputedStatus> {
    const patient = await Patient.get(patientId, txn);
    const { patientInfo } = patient;
    const { hasHealthcareProxy, hasMolst, hasDeclinedPhotoUpload, hasUploadedPhoto } = patientInfo;
    const patientCoreIdentityDataFlags = await PatientDataFlag.getAllCoreIdentityForPatient(
      patientId,
      txn,
    );
    const patientEmergencyContacts = await PatientContact.getEmergencyContactsForPatient(
      patientId,
      txn,
    );
    const patientProgressNoteCount = await ProgressNote.getCountForPatient(patientId, txn);
    const patientCareTeam = await CareTeam.getForPatient(patientId, txn);

    const isCoreIdentityVerified =
      (!!patient.coreIdentityVerifiedAt && !!patient.coreIdentityVerifiedById) ||
      patientCoreIdentityDataFlags.length > 0;
    const isDemographicInfoUpdated = !!patientInfo.updatedAt;
    const isEmergencyContactAdded = !!patientEmergencyContacts.length;
    const isAdvancedDirectivesAdded = await this.getAdvancedDirectivesStatus(
      patientId,
      hasHealthcareProxy,
      hasMolst,
      txn,
    );
    const isConsentSigned = await this.isConsentSignedForPatient(patientId, txn);
    const hasProgressNote = patientProgressNoteCount > 0;
    const hasChp = this.isRoleOnCareTeam(patientCareTeam, 'Community_Health_Partner' as UserRole);

    const hasPcp = this.isRoleOnCareTeam(patientCareTeam, 'Primary_Care_Physician' as UserRole);
    const hasCareTeam = !!patientCareTeam.length;
    const isAssessed = false;
    const isPhotoAddedOrDeclined = hasUploadedPhoto || !!hasDeclinedPhotoUpload;
    const isIneligible = false;
    const isDisenrolled = false;

    return {
      isCoreIdentityVerified,
      isDemographicInfoUpdated,
      isEmergencyContactAdded,
      isAdvancedDirectivesAdded,
      isConsentSigned,
      isPhotoAddedOrDeclined,
      hasProgressNote,
      hasCareTeam,
      hasChp,
      hasPcp,
      isAssessed,
      isIneligible,
      isDisenrolled,
    };
  }

  static isRoleOnCareTeam(careTeam: User[], role: UserRole): boolean {
    const user = find(careTeam, ['userRole', role]);

    return !!user;
  }

  static async isConsentSignedForPatient(patientId: string, txn: Transaction): Promise<boolean> {
    let isConsented = true;
    const documents = await PatientDocument.getConsentsForPatient(patientId, txn);

    // ignore text consent for now
    if (!documents.length || documents.length < CONSENT_TYPES.length - 1) {
      return false;
    }

    CONSENT_TYPES.forEach(consentType => {
      const document = find(documents, ['documentType', consentType]);

      if (!document && consentType !== 'textConsent') {
        isConsented = false;
      }
    });

    return isConsented;
  }

  static async getAdvancedDirectivesStatus(
    patientId: string,
    hasHealthcareProxy: boolean,
    hasMolst: boolean,
    txn: Transaction,
  ): Promise<boolean> {
    if (hasHealthcareProxy === false && hasMolst === false) {
      return true;
    }
    if (isNil(hasHealthcareProxy) || isNil(hasMolst)) {
      return false;
    }

    if (hasHealthcareProxy) {
      const healthCareProxyDocuments = await PatientDocument.getHCPsForPatient(patientId, txn);

      if (!healthCareProxyDocuments.length) {
        return false;
      }
      const patientHealthcareProxies = await PatientContact.getHealthcareProxiesForPatient(
        patientId,
        txn,
      );
      if (patientHealthcareProxies.length < healthCareProxyDocuments.length) {
        return false;
      }
    }

    if (hasMolst) {
      const molstDocuments = await PatientDocument.getMOLSTForPatient(patientId, txn);

      if (!molstDocuments.length) {
        return false;
      }
    }

    return true;
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

  static getCurrentPatientState(
    computedStatus: IComputedStatus,
    txn: Transaction,
  ): CurrentPatientState {
    let currentStatus = 'attributed';
    const isAssigned = computedStatus.hasCareTeam;
    const isInOutreach = isAssigned && computedStatus.hasProgressNote;
    const isConsented =
      isInOutreach && computedStatus.isConsentSigned && computedStatus.isCoreIdentityVerified;
    const isEnrolled = isConsented && computedStatus.hasPcp;

    if (isEnrolled) {
      currentStatus = 'enrolled';
    } else if (isConsented) {
      currentStatus = 'consented';
    } else if (isInOutreach) {
      currentStatus = 'outreach';
    } else if (isAssigned) {
      currentStatus = 'assigned';
    }

    return currentStatus as CurrentPatientState;
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

    // Next, update the Patient State
    const currentState = this.getCurrentPatientState(currentStatus, txn);
    await PatientState.updateForPatient(
      {
        patientId,
        updatedById,
        currentState,
      },
      txn,
    );

    // Finally, create and return a new record
    return this.query(txn).insertAndFetch({
      patientId,
      updatedById,
      ...currentStatus,
    });
  }

  static async updateForMultiplePatients(
    patientIds: string[],
    updatedById: string,
    txn: Transaction,
  ): Promise<number> {
    await Promise.all(
      patientIds.map(async patientId =>
        ComputedPatientStatus.updateForPatient(patientId, updatedById, txn),
      ),
    );

    return patientIds.length;
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
