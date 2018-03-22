import { find } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import AdvancedDirectiveForm, {
  HEALTHCARE_PROXY_FORM_TITLE,
  MOLST_FORM_TITLE,
} from './advanced-directive-form';
import BaseModel from './base-model';
import CareTeam from './care-team';
import ConsentForm from './consent-form';
import Patient from './patient';
import PatientAdvancedDirectiveForm from './patient-advanced-directive-form';
import PatientConsentForm from './patient-consent-form';
import PatientContact from './patient-contact';
import PatientDataFlag from './patient-data-flag';
import PatientState, { CurrentState } from './patient-state';
import ProgressNote from './progress-note';
import User, { UserRole } from './user';

export interface IComputedStatus {
  isCoreIdentityVerified: boolean;
  isDemographicInfoUpdated: boolean;
  isEmergencyContactAdded: boolean;
  isAdvancedDirectivesAdded: boolean;
  isConsentSigned: boolean;
  isPhotoAddedOrDeclined: boolean;
  hasProgressNote: boolean;
  hasChp: boolean;
  hasOutreachSpecialist: boolean;
  hasPcp: boolean;
  isAssessed: boolean;
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
  hasProgressNote: boolean;
  hasChp: boolean;
  hasOutreachSpecialist: boolean;
  hasPcp: boolean;
  isAssessed: boolean;
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
      hasProgressNote: { type: 'boolean' },
      hasChp: { type: 'boolean' },
      hasOutreachSpecialist: { type: 'boolean' },
      hasPcp: { type: 'boolean' },
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
      'hasChp',
      'hasPcp',
      'hasOutreachSpecialist',
      'isAssessed',
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
    const patient = await Patient.get(patientId, txn);
    const { patientInfo } = patient;
    const { hasHealthcareProxy, hasMolst, hasDeclinedPhotoUpload, hasUploadedPhoto } = patientInfo;
    const patientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
    const patientEmergencyContacts = await PatientContact.getEmergencyContactsForPatient(
      patientId,
      txn,
    );
    const patientProgressNoteCount = await ProgressNote.getCountForPatient(patientId, txn);
    const patientCareTeam = await CareTeam.getForPatient(patientId, txn);

    const isCoreIdentityVerified =
      (!!patient.coreIdentityVerifiedAt && !!patient.coreIdentityVerifiedById) ||
      patientDataFlags.length > 0;
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
    const hasChp = this.isRoleOnCareTeam(patientCareTeam, 'communityHealthPartner');
    const hasOutreachSpecialist = this.isRoleOnCareTeam(patientCareTeam, 'outreachSpecialist');
    const hasPcp = this.isRoleOnCareTeam(patientCareTeam, 'primaryCarePhysician');
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
      hasChp,
      hasOutreachSpecialist,
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
    let isConsentSignedForPatient = true;
    const consentForms = await ConsentForm.getAll(txn);

    if (!consentForms.length) {
      return false;
    }

    const patientConsentForms = await PatientConsentForm.getAllForPatient(patientId, txn);

    consentForms.forEach(consentForm => {
      const patientConsentForm = find(patientConsentForms, ['formId', consentForm.id]);

      if (!patientConsentForm) {
        isConsentSignedForPatient = false;
      }
    });

    return isConsentSignedForPatient;
  }

  static async getAdvancedDirectivesStatus(
    patientId: string,
    hasHealthcareProxy: boolean,
    hasMolst: boolean,
    txn: Transaction,
  ): Promise<boolean> {
    if (hasHealthcareProxy === false && hasMolst === false) {
      return true;
    } else if (hasHealthcareProxy || hasMolst) {
      const advancedDirectiveForms = await AdvancedDirectiveForm.getAll(txn);
      const healthcareProxyForm = find(advancedDirectiveForms, [
        'title',
        HEALTHCARE_PROXY_FORM_TITLE,
      ]);
      const molstForm = find(advancedDirectiveForms, ['title', MOLST_FORM_TITLE]);
      const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
        patientId,
        txn,
      );

      if (hasHealthcareProxy && healthcareProxyForm) {
        const patientHealthcareProxies = await PatientContact.getHealthcareProxiesForPatient(
          patientId,
          txn,
        );
        const patientSignedHealthcareProxyForm = find(patientAdvancedDirectiveForms, [
          'formId',
          healthcareProxyForm.id,
        ]);

        if (!patientHealthcareProxies.length || !patientSignedHealthcareProxyForm) {
          return false;
        }
      }

      if (hasMolst && molstForm) {
        const patientSignedMolstForm = find(patientAdvancedDirectiveForms, [
          'formId',
          molstForm.id,
        ]);

        if (!patientSignedMolstForm) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
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

  static getCurrentPatientState(computedStatus: IComputedStatus, txn: Transaction): CurrentState {
    let currentStatus = 'attributed';
    const isAssigned = computedStatus.hasOutreachSpecialist || computedStatus.hasChp;
    const isInOutreach = isAssigned && computedStatus.hasProgressNote;
    const isConsented = isInOutreach && computedStatus.isConsentSigned;
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

    return currentStatus as CurrentState;
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
