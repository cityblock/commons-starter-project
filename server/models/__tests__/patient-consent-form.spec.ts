import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import ConsentForm from '../consent-form';
import Patient from '../patient';
import PatientConsentForm from '../patient-consent-form';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  consentForm: ConsentForm;
  patient: Patient;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const consentForm = await ConsentForm.create('Cityblock', txn);
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  return { consentForm, patient, user };
}

describe('patient consent form model', () => {
  let txn = null as any;

  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('creating a patient consent form', async () => {
    it('should create a patient consent form', async () => {
      const { consentForm, patient, user } = await setup(txn);
      const patientConsentForms = await PatientConsentForm.getAllForPatient(patient.id, txn);

      expect(patientConsentForms.length).toEqual(0);

      const patientConsentForm = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/01/1999',
        },
        txn,
      );
      const refetchedPatientConsentForms = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );

      expect(refetchedPatientConsentForms.length).toEqual(1);
      expect(refetchedPatientConsentForms[0]).toMatchObject(patientConsentForm);
    });

    it('should delete any duplicate patient consent forms', async () => {
      const { consentForm, patient, user } = await setup(txn);
      const consentForm2 = await ConsentForm.create('HIPAA', txn);
      const patientConsentForms = await PatientConsentForm.getAllForPatient(patient.id, txn);

      expect(patientConsentForms.length).toEqual(0);

      const patientConsentForm1 = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/01/1999',
        },
        txn,
      );
      const patientConsentForm2 = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm2.id,
          signedAt: '01/01/1999',
        },
        txn,
      );
      const refetchedPatientConsentForms = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );
      const refetchedPatientConsentFormIds = refetchedPatientConsentForms.map(
        patientConsentForm => patientConsentForm.id,
      );

      expect(refetchedPatientConsentForms.length).toEqual(2);
      expect(refetchedPatientConsentFormIds).toContain(patientConsentForm1.id);
      expect(refetchedPatientConsentFormIds).toContain(patientConsentForm2.id);

      const patientConsentForm3 = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/02/1999',
        },
        txn,
      );
      const refetchedPatientConsentForms2 = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );
      const refetchedPatientConsentFormIds2 = refetchedPatientConsentForms2.map(
        patientConsentForm => patientConsentForm.id,
      );

      expect(refetchedPatientConsentForms2.length).toEqual(2);
      expect(refetchedPatientConsentFormIds2).toContain(patientConsentForm2.id);
      expect(refetchedPatientConsentFormIds2).toContain(patientConsentForm3.id);
      expect(refetchedPatientConsentFormIds2).not.toContain(patientConsentForm1.id);
    });

    it('updates the computed patient status', async () => {
      const { consentForm, patient, user } = await setup(txn);
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

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isConsentSigned).toEqual(true);
    });
  });

  describe('deleting a patient consent form', () => {
    it('should delete a patient consent form', async () => {
      const { consentForm, patient, user } = await setup(txn);
      const patientConsentForms = await PatientConsentForm.getAllForPatient(patient.id, txn);

      expect(patientConsentForms.length).toEqual(0);

      const patientConsentForm = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/01/1999',
        },
        txn,
      );

      const refetchedPatientConsentForms = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );

      expect(refetchedPatientConsentForms.length).toEqual(1);

      await PatientConsentForm.delete(patientConsentForm.id, user.id, txn);

      const refetchedPatientConsentForms2 = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );

      expect(refetchedPatientConsentForms2.length).toEqual(0);
    });

    it('updates the computed patient status', async () => {
      const { consentForm, patient, user } = await setup(txn);
      const patientConsentForm = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/01/1999',
        },
        txn,
      );
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isConsentSigned).toEqual(true);

      await PatientConsentForm.delete(patientConsentForm.id, user.id, txn);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isConsentSigned).toEqual(false);
    });
  });
});
