import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import AdvancedDirectiveForm from '../../models/advanced-directive-form';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAdvancedDirectiveForm from '../../models/patient-advanced-directive-form';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
  advancedDirectiveForm: AdvancedDirectiveForm;
  advancedDirectiveForm2: AdvancedDirectiveForm;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const advancedDirectiveForm = await AdvancedDirectiveForm.create('MOLST', txn);
  const advancedDirectiveForm2 = await AdvancedDirectiveForm.create('THING', txn);

  return {
    user,
    patient,
    advancedDirectiveForm,
    advancedDirectiveForm2,
  };
}

describe('patient advanced directive form tests', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient advanced directive forms for patient', () => {
    it('can fetch patient advanced directive forms', async () => {
      await transaction(PatientAdvancedDirectiveForm.knex(), async txn => {
        const { patient, user, advancedDirectiveForm, advancedDirectiveForm2 } = await setup(txn);
        const patientAdvancedDirectiveForm = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm.id,
            signedAt: '01/01/1999',
          },
          txn,
        );
        const query = `{
          patientAdvancedDirectiveFormsForPatient(patientId: "${patient.id}") {
            patientAdvancedDirectiveFormId,
            formId,
            signedAt,
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        const results = cloneDeep(result.data!.patientAdvancedDirectiveFormsForPatient);
        const patientAdvancedDirectiveFormIds = results.map(
          (res: any) => res.patientAdvancedDirectiveFormId,
        );
        const advancedDirectiveFormIds = results.map((res: any) => res.formId);
        expect(results).toHaveLength(2);
        expect(advancedDirectiveFormIds).toContain(advancedDirectiveForm.id);
        expect(advancedDirectiveFormIds).toContain(advancedDirectiveForm2.id);
        expect(patientAdvancedDirectiveFormIds).toContain(patientAdvancedDirectiveForm.id);
        // No form was created for advancedDirectiveForm2
        expect(patientAdvancedDirectiveFormIds).toContain(null);
      });
    });
  });

  describe('patient advanced directive form create', () => {
    it('creates a patient advanced directive form', async () => {
      await transaction(PatientAdvancedDirectiveForm.knex(), async txn => {
        const { patient, user, advancedDirectiveForm } = await setup(txn);
        const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );
        expect(patientAdvancedDirectiveForms).toHaveLength(0);
        const query = `mutation {
          patientAdvancedDirectiveFormCreate(input: {
            patientId: "${patient.id}",
            formId: "${advancedDirectiveForm.id}",
            signedAt: "01/01/1999",
          }) {
            formId
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientAdvancedDirectiveFormCreate)).toMatchObject({
          formId: advancedDirectiveForm.id,
        });
        const refetchedPatientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );
        expect(refetchedPatientAdvancedDirectiveForms).toHaveLength(1);
      });
    });
  });

  describe('patient advanced directive form delete', () => {
    it('deletes a patient advanced directive form', async () => {
      await transaction(PatientAdvancedDirectiveForm.knex(), async txn => {
        const { patient, user, advancedDirectiveForm } = await setup(txn);
        const patientAdvancedDirectiveForm = await PatientAdvancedDirectiveForm.create(
          {
            patientId: patient.id,
            userId: user.id,
            formId: advancedDirectiveForm.id,
            signedAt: '01/01/1999',
          },
          txn,
        );
        const patientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );
        expect(patientAdvancedDirectiveForms).toHaveLength(1);
        const query = `mutation {
          patientAdvancedDirectiveFormDelete(input: {
            patientAdvancedDirectiveFormId: "${patientAdvancedDirectiveForm.id}",
          }) {
            patientAdvancedDirectiveFormId
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.patientAdvancedDirectiveFormDelete)).toMatchObject({
          patientAdvancedDirectiveFormId: patientAdvancedDirectiveForm.id,
        });
        const refetchedPatientAdvancedDirectiveForms = await PatientAdvancedDirectiveForm.getAllForPatient(
          patient.id,
          txn,
        );
        expect(refetchedPatientAdvancedDirectiveForms).toHaveLength(0);
      });
    });
  });
});
