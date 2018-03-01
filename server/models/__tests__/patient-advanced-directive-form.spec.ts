import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import AdvancedDirectiveForm from '../advanced-directive-form';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientAdvancedDirectiveForm from '../patient-advanced-directive-form';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  advancedDirectiveForm: AdvancedDirectiveForm;
  patient: Patient;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const advancedDirectiveForm = await AdvancedDirectiveForm.create('Cityblock', txn);
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

  return { advancedDirectiveForm, patient, user };
}

describe('patient advanced directive form model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('creating a patient advanced directive form', async () => {
    it('should create a patient advanced directive form', async () => {
      await transaction(PatientAdvancedDirectiveForm.knex(), async txn => {
        const { advancedDirectiveForm, patient, user } = await setup(txn);
        const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );

        expect(patientAdvancedDirectiveForms.length).toEqual(0);

        const patientAdvancedDirectiveForm = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm.id,
            signedAt: '01/01/1999',
          },
          txn,
        );
        const refetchedPatientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );

        expect(refetchedPatientAdvancedDirectiveForms.length).toEqual(1);
        expect(refetchedPatientAdvancedDirectiveForms[0]).toMatchObject(
          patientAdvancedDirectiveForm,
        );
      });
    });

    it('should delete any duplicate patient advanced directive forms', async () => {
      await transaction(PatientAdvancedDirectiveForm.knex(), async txn => {
        const { advancedDirectiveForm, patient, user } = await setup(txn);
        const advancedDirectiveForm2 = await AdvancedDirectiveForm.create('HIPAA', txn);
        const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );

        expect(patientAdvancedDirectiveForms.length).toEqual(0);

        const patientAdvancedDirectiveForm1 = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm.id,
            signedAt: '01/01/1999',
          },
          txn,
        );
        const patientAdvancedDirectiveForm2 = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm2.id,
            signedAt: '01/01/1999',
          },
          txn,
        );
        const refetchedPatientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );
        const refetchedPatientAdvancedDirectiveFormIds = refetchedPatientAdvancedDirectiveForms.map(
          patientAdvancedDirectiveForm => patientAdvancedDirectiveForm.id,
        );

        expect(refetchedPatientAdvancedDirectiveForms.length).toEqual(2);
        expect(refetchedPatientAdvancedDirectiveFormIds).toContain(
          patientAdvancedDirectiveForm1.id,
        );
        expect(refetchedPatientAdvancedDirectiveFormIds).toContain(
          patientAdvancedDirectiveForm2.id,
        );

        const patientAdvancedDirectiveForm3 = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm.id,
            signedAt: '01/02/1999',
          },
          txn,
        );
        const refetchedPatientAdvancedDirectiveForms2 = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );
        const refetchedPatientAdvancedDirectiveFormIds2 = refetchedPatientAdvancedDirectiveForms2.map(
          patientAdvancedDirectiveForm => patientAdvancedDirectiveForm.id,
        );

        expect(refetchedPatientAdvancedDirectiveForms2.length).toEqual(2);
        expect(refetchedPatientAdvancedDirectiveFormIds2).toContain(
          patientAdvancedDirectiveForm2.id,
        );
        expect(refetchedPatientAdvancedDirectiveFormIds2).toContain(
          patientAdvancedDirectiveForm3.id,
        );
        expect(refetchedPatientAdvancedDirectiveFormIds2).not.toContain(
          patientAdvancedDirectiveForm1.id,
        );
      });
    });
  });

  describe('deleting a patient advanced directive form', () => {
    it('should delete a patient advanced directive form', async () => {
      await transaction(PatientAdvancedDirectiveForm.knex(), async txn => {
        const { advancedDirectiveForm, patient, user } = await setup(txn);
        const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );

        expect(patientAdvancedDirectiveForms.length).toEqual(0);

        const patientAdvancedDirectiveForm = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm.id,
            signedAt: '01/01/1999',
          },
          txn,
        );

        const refetchedPatientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );

        expect(refetchedPatientAdvancedDirectiveForms.length).toEqual(1);

        await PatientAdvancedDirectiveForm.delete(patientAdvancedDirectiveForm.id, user.id, txn);

        const refetchedPatientAdvancedDirectiveForms2 = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );

        expect(refetchedPatientAdvancedDirectiveForms2.length).toEqual(0);
      });
    });
  });
});
