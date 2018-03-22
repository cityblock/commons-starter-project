import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import AdvancedDirectiveForm, {
  HEALTHCARE_PROXY_FORM_TITLE,
  MOLST_FORM_TITLE,
} from '../advanced-directive-form';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import ComputedPatientStatus, { IComputedStatus } from '../computed-patient-status';
import ConsentForm from '../consent-form';
import Patient from '../patient';
import PatientAdvancedDirectiveForm from '../patient-advanced-directive-form';
import PatientConsentForm from '../patient-consent-form';
import PatientContact from '../patient-contact';
import PatientDataFlag from '../patient-data-flag';
import PatientInfo from '../patient-info';
import PatientState from '../patient-state';
import ProgressNote from '../progress-note';
import ProgressNoteTemplate from '../progress-note-template';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
  progressNoteTemplate: ProgressNoteTemplate;
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'title',
    },
    txn,
  );
  return { clinic, user, patient, progressNoteTemplate };
}

describe('computed patient status model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets a computed patient status for a patient', async () => {
    const { patient } = await setup(txn);
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus).not.toBeNull();
  });

  it('updates and gets a computed patient status for a patient', async () => {
    const { patient, user } = await setup(txn);

    await PatientDataFlag.create(
      {
        userId: user.id,
        patientId: patient.id,
        fieldName: 'firstName',
      },
      txn,
    );

    const updatedComputedPatientStatus = await ComputedPatientStatus.updateForPatient(
      patient.id,
      user.id,
      txn,
    );
    expect(updatedComputedPatientStatus.isCoreIdentityVerified).toEqual(true);

    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );
    expect(refetchedComputedPatientStatus).toMatchObject(updatedComputedPatientStatus);
  });

  it('updates computed patient statuses for all patients', async () => {
    const { clinic, patient, user } = await setup(txn);
    const patient2 = await createPatient({ cityblockId: 456, homeClinicId: clinic.id }, txn);

    const computedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
    const computedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient2.id, txn);

    expect(computedPatientStatus1!.isCoreIdentityVerified).toEqual(false);
    expect(computedPatientStatus2!.isCoreIdentityVerified).toEqual(false);

    await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
    await CareTeam.create({ userId: user.id, patientId: patient2.id }, txn);
    await PatientDataFlag.create(
      {
        userId: user.id,
        patientId: patient.id,
        fieldName: 'firstName',
      },
      txn,
    );
    await Patient.edit(
      {
        coreIdentityVerifiedAt: new Date().toISOString(),
        coreIdentityVerifiedById: user.id,
      },
      patient2.id,
      txn,
    );

    await ComputedPatientStatus.updateForAllPatients(user.id, txn);

    const refetchedPatientStatus1 = await ComputedPatientStatus.getForPatient(patient.id, txn);
    const refetchedPatientStatus2 = await ComputedPatientStatus.getForPatient(patient2.id, txn);

    expect(refetchedPatientStatus1!.isCoreIdentityVerified).toEqual(true);
    expect(refetchedPatientStatus2!.isCoreIdentityVerified).toEqual(true);
  });

  it('updates patient state when updating status', async () => {
    const { patient, user, clinic, progressNoteTemplate } = await setup(txn);
    const patientState = await PatientState.getForPatient(patient.id, txn);

    expect(patientState!.currentState).toEqual('attributed');

    const outreachSpecialist = await User.create(
      {
        homeClinicId: clinic.id,
        firstName: 'First',
        lastName: 'Last',
        email: 'outreach@cityblock.com',
        userRole: 'outreachSpecialist',
      },
      txn,
    );
    await CareTeam.create({ userId: outreachSpecialist.id, patientId: patient.id }, txn);
    await ProgressNote.create(
      {
        userId: user.id,
        patientId: patient.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      },
      txn,
    );
    const consentForm = await ConsentForm.create('Cityblock', txn);
    await PatientConsentForm.create(
      {
        patientId: patient.id,
        userId: user.id,
        formId: consentForm.id,
        signedAt: '01/01/1999',
      },
      txn,
    );
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedPatientState = await PatientState.getForPatient(patient.id, txn);

    expect(refetchedPatientState!.currentState).toEqual('consented');
  });

  describe('getCurrentPatientState', () => {
    it('appropriately calculates the attributed state', async () => {
      const currentStatus: IComputedStatus = {
        isCoreIdentityVerified: false,
        isDemographicInfoUpdated: false,
        isEmergencyContactAdded: false,
        isAdvancedDirectivesAdded: false,
        isConsentSigned: false,
        isPhotoAddedOrDeclined: false,
        hasProgressNote: false,
        hasChp: false,
        hasOutreachSpecialist: false,
        hasPcp: false,
        isAssessed: false,
        isIneligible: false,
        isDisenrolled: false,
      };
      const currentState = ComputedPatientStatus.getCurrentPatientState(currentStatus, txn);

      expect(currentState).toEqual('attributed');
    });

    it('appropriately calculates the assigned state', async () => {
      const currentStatusWithOutreachSpecialist: IComputedStatus = {
        isCoreIdentityVerified: false,
        isDemographicInfoUpdated: false,
        isEmergencyContactAdded: false,
        isAdvancedDirectivesAdded: false,
        isConsentSigned: false,
        isPhotoAddedOrDeclined: false,
        hasProgressNote: false,
        hasChp: false,
        hasOutreachSpecialist: true,
        hasPcp: false,
        isAssessed: false,
        isIneligible: false,
        isDisenrolled: false,
      };
      const currentStatusWithChp: IComputedStatus = {
        isCoreIdentityVerified: false,
        isDemographicInfoUpdated: false,
        isEmergencyContactAdded: false,
        isAdvancedDirectivesAdded: false,
        isConsentSigned: false,
        isPhotoAddedOrDeclined: false,
        hasProgressNote: false,
        hasChp: true,
        hasOutreachSpecialist: false,
        hasPcp: false,
        isAssessed: false,
        isIneligible: false,
        isDisenrolled: false,
      };
      const outreachState = ComputedPatientStatus.getCurrentPatientState(
        currentStatusWithOutreachSpecialist,
        txn,
      );
      const chpState = ComputedPatientStatus.getCurrentPatientState(currentStatusWithChp, txn);

      expect(outreachState).toEqual('assigned');
      expect(chpState).toEqual('assigned');
    });

    it('appropriately calculates the outreach state', async () => {
      const currentStatus: IComputedStatus = {
        isCoreIdentityVerified: true,
        isDemographicInfoUpdated: true,
        isEmergencyContactAdded: true,
        isAdvancedDirectivesAdded: true,
        isConsentSigned: false,
        isPhotoAddedOrDeclined: false,
        hasProgressNote: true,
        hasChp: true,
        hasOutreachSpecialist: true,
        hasPcp: false,
        isAssessed: false,
        isIneligible: false,
        isDisenrolled: false,
      };
      const currentState = ComputedPatientStatus.getCurrentPatientState(currentStatus, txn);

      expect(currentState).toEqual('outreach');
    });

    it('appropriately calculates the consented state', async () => {
      const currentStatus: IComputedStatus = {
        isCoreIdentityVerified: true,
        isDemographicInfoUpdated: true,
        isEmergencyContactAdded: true,
        isAdvancedDirectivesAdded: true,
        isConsentSigned: true,
        isPhotoAddedOrDeclined: true,
        hasProgressNote: true,
        hasChp: true,
        hasOutreachSpecialist: true,
        hasPcp: false,
        isAssessed: true,
        isIneligible: false,
        isDisenrolled: false,
      };
      const currentState = ComputedPatientStatus.getCurrentPatientState(currentStatus, txn);

      expect(currentState).toEqual('consented');
    });

    it('appropriately calculates the enrolled state', async () => {
      const currentStatus: IComputedStatus = {
        isCoreIdentityVerified: true,
        isDemographicInfoUpdated: true,
        isEmergencyContactAdded: true,
        isAdvancedDirectivesAdded: true,
        isConsentSigned: true,
        isPhotoAddedOrDeclined: true,
        hasProgressNote: true,
        hasChp: true,
        hasOutreachSpecialist: true,
        hasPcp: true,
        isAssessed: true,
        isIneligible: false,
        isDisenrolled: false,
      };
      const currentState = ComputedPatientStatus.getCurrentPatientState(currentStatus, txn);

      expect(currentState).toEqual('enrolled');
    });
  });

  describe('coreIdentityVerified', () => {
    it('correctly calculates coreIdentityVerified when verified', async () => {
      const { user, patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isCoreIdentityVerified).toEqual(false);

      await Patient.edit(
        {
          coreIdentityVerifiedAt: new Date().toISOString(),
          coreIdentityVerifiedById: user.id,
        },
        patient.id,
        txn,
      );
      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isCoreIdentityVerified).toEqual(true);
    });

    it('correctly calculates isCoreIdentityVerified when flagged', async () => {
      const { user, patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isCoreIdentityVerified).toEqual(false);

      await PatientDataFlag.create(
        {
          userId: user.id,
          patientId: patient.id,
          fieldName: 'firstName',
        },
        txn,
      );
      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isCoreIdentityVerified).toEqual(true);
    });
  });

  it('correctly calculates isDemographicInfoUpdated', async () => {
    const { user, patient } = await setup(txn);
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.isDemographicInfoUpdated).toEqual(false);

    await PatientInfo.edit(
      {
        gender: 'nonbinary',
        updatedById: user.id,
      },
      patient.patientInfo.id,
      txn,
    );
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.isDemographicInfoUpdated).toEqual(true);
  });

  it('correctly calculates isConsentSigned', async () => {
    const { user, patient } = await setup(txn);
    const consentForm = await ConsentForm.create('Cityblock', txn);
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.isConsentSigned).toEqual(false);

    await PatientConsentForm.create(
      {
        patientId: patient.id,
        userId: user.id,
        formId: consentForm.id,
        signedAt: '01/01/1999',
      },
      txn,
    );

    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.isConsentSigned).toEqual(true);
  });

  it('correctly calculates isEmergencyContactAdded', async () => {
    const { user, patient } = await setup(txn);

    // Create a non-emergency contact
    await PatientContact.create(
      {
        patientId: patient.id,
        updatedById: user.id,
        relationToPatient: 'sibling',
        firstName: 'Aya',
        lastName: 'Stark',
        isEmergencyContact: false,
        isHealthcareProxy: false,
        canContact: true,
      },
      txn,
    );
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.isEmergencyContactAdded).toEqual(false);

    await PatientContact.create(
      {
        patientId: patient.id,
        updatedById: user.id,
        relationToPatient: 'sibling',
        firstName: 'Aya',
        lastName: 'Stark',
        isEmergencyContact: true,
        isHealthcareProxy: false,
        canContact: true,
      },
      txn,
    );
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.isEmergencyContactAdded).toEqual(true);
  });

  it('correctly calculates hasProgressNote', async () => {
    const { user, patient, progressNoteTemplate } = await setup(txn);
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.hasProgressNote).toEqual(false);

    await ProgressNote.create(
      {
        patientId: patient.id,
        userId: user.id,
        progressNoteTemplateId: progressNoteTemplate.id,
      },
      txn,
    );
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.hasProgressNote).toEqual(true);
  });

  it('correctly calculates hasChp', async () => {
    const { user, patient, clinic } = await setup(txn);
    await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
    const chpUser = await User.create(
      {
        email: 'chp@cityblock.com',
        firstName: 'First',
        lastName: 'Last',
        homeClinicId: clinic.id,
        userRole: 'communityHealthPartner',
      },
      txn,
    );
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.hasChp).toEqual(false);

    await CareTeam.create({ userId: chpUser.id, patientId: patient.id }, txn);
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.hasChp).toEqual(true);
  });

  it('correctly calculates hasOutreachSpecialist', async () => {
    const { user, patient, clinic } = await setup(txn);
    await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
    const outreachSpecialistUser = await User.create(
      {
        email: 'outreach@cityblock.com',
        firstName: 'First',
        lastName: 'Last',
        homeClinicId: clinic.id,
        userRole: 'outreachSpecialist',
      },
      txn,
    );
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.hasOutreachSpecialist).toEqual(false);

    await CareTeam.create({ userId: outreachSpecialistUser.id, patientId: patient.id }, txn);
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.hasOutreachSpecialist).toEqual(true);
  });

  it('correctly calculates hasPcp', async () => {
    const { user, patient, clinic } = await setup(txn);
    await CareTeam.create({ userId: user.id, patientId: patient.id }, txn);
    const pcpUser = await User.create(
      {
        email: 'pcp@cityblock.com',
        firstName: 'First',
        lastName: 'Last',
        homeClinicId: clinic.id,
        userRole: 'primaryCarePhysician',
      },
      txn,
    );
    const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

    expect(computedPatientStatus!.hasPcp).toEqual(false);

    await CareTeam.create({ userId: pcpUser.id, patientId: patient.id }, txn);
    await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
    const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
      patient.id,
      txn,
    );

    expect(refetchedComputedPatientStatus!.hasPcp).toEqual(true);
  });

  describe('isAdvancedDirectivesAdded', () => {
    it('correctly calculates when patient has none', async () => {
      const { user, patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isAdvancedDirectivesAdded).toEqual(false);

      await PatientInfo.edit(
        {
          updatedById: user.id,
          hasHealthcareProxy: false,
          hasMolst: false,
        },
        patient.patientInfo.id,
        txn,
      );

      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(true);
    });

    describe('when a patient has a MOLST', () => {
      it('correctly calculates when a patient has uploaded the form', async () => {
        const { user, patient } = await setup(txn);
        const molstForm = await AdvancedDirectiveForm.create(MOLST_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: false,
            hasMolst: true,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: molstForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(true);
      });

      it('correctly calculates when a patient has not uploaded the form yet', async () => {
        const { user, patient } = await setup(txn);
        await AdvancedDirectiveForm.create(MOLST_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: false,
            hasMolst: true,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);
      });
    });

    describe('when a patient has a healthcare proxy', () => {
      it('correctly calculates when a patient has added a proxy and no form', async () => {
        const { user, patient } = await setup(txn);
        await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: false,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientContact.create(
          {
            patientId: patient.id,
            updatedById: user.id,
            relationToPatient: 'sibling',
            firstName: 'Aya',
            lastName: 'Stark',
            isEmergencyContact: false,
            isHealthcareProxy: true,
            canContact: true,
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(false);
      });

      it('correctly calculates when a patient has uploaded form and not added proxy', async () => {
        const { user, patient } = await setup(txn);
        const hcpForm = await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: false,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: hcpForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(false);
      });

      it('correctly calculates when proxy is added and form is uploaded', async () => {
        const { user, patient } = await setup(txn);
        const hcpForm = await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: false,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: hcpForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );
        await PatientContact.create(
          {
            patientId: patient.id,
            updatedById: user.id,
            relationToPatient: 'sibling',
            firstName: 'Aya',
            lastName: 'Stark',
            isEmergencyContact: false,
            isHealthcareProxy: true,
            canContact: true,
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(true);
      });
    });

    describe('when a patient has a MOLST and a healthcare proxy', () => {
      it('correctly calculates when a patient has completed all components', async () => {
        const { user, patient } = await setup(txn);
        const hcpForm = await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        const molstForm = await AdvancedDirectiveForm.create(MOLST_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: true,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: molstForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );
        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: hcpForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );
        await PatientContact.create(
          {
            patientId: patient.id,
            updatedById: user.id,
            relationToPatient: 'sibling',
            firstName: 'Aya',
            lastName: 'Stark',
            isEmergencyContact: false,
            isHealthcareProxy: true,
            canContact: true,
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(true);
      });

      it('correctly calculates when a patient has not completed the MOLST', async () => {
        const { user, patient } = await setup(txn);
        const hcpForm = await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        await AdvancedDirectiveForm.create(MOLST_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: true,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: hcpForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );
        await PatientContact.create(
          {
            patientId: patient.id,
            updatedById: user.id,
            relationToPatient: 'sibling',
            firstName: 'Aya',
            lastName: 'Stark',
            isEmergencyContact: false,
            isHealthcareProxy: true,
            canContact: true,
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(false);
      });

      it('correctly calculates when a patient has completed no components', async () => {
        const { user, patient } = await setup(txn);
        await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        await AdvancedDirectiveForm.create(MOLST_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: true,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);
      });

      it('correctly calculates when a patient has not completed the HCP components', async () => {
        const { user, patient } = await setup(txn);
        await AdvancedDirectiveForm.create(HEALTHCARE_PROXY_FORM_TITLE, txn);
        const molstForm = await AdvancedDirectiveForm.create(MOLST_FORM_TITLE, txn);
        await PatientInfo.edit(
          {
            updatedById: user.id,
            hasHealthcareProxy: true,
            hasMolst: true,
          },
          patient.patientInfo.id,
          txn,
        );
        const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
          patient.id,
          user.id,
          txn,
        );

        expect(computedPatientStatus.isAdvancedDirectivesAdded).toEqual(false);

        await PatientAdvancedDirectiveForm.create(
          {
            userId: user.id,
            formId: molstForm.id,
            patientId: patient.id,
            signedAt: new Date().toISOString(),
          },
          txn,
        );

        await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
        const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
          patient.id,
          txn,
        );

        expect(refetchedComputedPatientStatus!.isAdvancedDirectivesAdded).toEqual(false);
      });
    });
  });

  describe('isPhotoAddedOrDeclined', () => {
    it('correctly calculates when the patient has declined to upload', async () => {
      const { user, patient } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isPhotoAddedOrDeclined).toEqual(false);

      await PatientInfo.edit(
        {
          updatedById: user.id,
          hasDeclinedPhotoUpload: true,
        },
        patient.patientInfo.id,
        txn,
      );
      await ComputedPatientStatus.updateForPatient(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isPhotoAddedOrDeclined).toEqual(true);
    });
  });

  /* TODO: Once possible, test isAssessed, isPhotoAddedOrDeclined (uploaded case), isIneligible,
   *       and isDisenrolled
   */
});
