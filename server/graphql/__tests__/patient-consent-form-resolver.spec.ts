import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import ConsentForm from '../../models/consent-form';
import Patient from '../../models/patient';
import PatientConsentForm from '../../models/patient-consent-form';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
  consentForm: ConsentForm;
  consentForm2: ConsentForm;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const consentForm = await ConsentForm.create('Cityblock', txn);
  const consentForm2 = await ConsentForm.create('HIPAA', txn);

  return {
    user,
    patient,
    consentForm,
    consentForm2,
  };
}

describe('patient consent form tests', () => {
  let txn = null as any;
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient consent forms for patient', () => {
    it('can fetch patient consent forms', async () => {
      const { patient, user, consentForm, consentForm2 } = await setup(txn);
      const patientConsentForm = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/01/1999',
        },
        txn,
      );
      const query = `{
          patientConsentFormsForPatient(patientId: "${patient.id}") {
            patientConsentFormId,
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
      const results = cloneDeep(result.data!.patientConsentFormsForPatient);
      const patientConsentFormIds = results.map((res: any) => res.patientConsentFormId);
      const consentFormIds = results.map((res: any) => res.formId);
      expect(results).toHaveLength(2);
      expect(consentFormIds).toContain(consentForm.id);
      expect(consentFormIds).toContain(consentForm2.id);
      expect(patientConsentFormIds).toContain(patientConsentForm.id);
      expect(patientConsentFormIds).toContain(null); // No form was created for consentForm2
    });
  });

  describe('patient consent form create', () => {
    it('creates a patient consent form', async () => {
      const { patient, user, consentForm } = await setup(txn);
      const patientConsentForms = await PatientConsentForm.getAllForPatient(patient.id, txn);
      expect(patientConsentForms).toHaveLength(0);
      const query = `mutation {
          patientConsentFormCreate(input: {
            patientId: "${patient.id}",
            formId: "${consentForm.id}",
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

      expect(cloneDeep(result.data!.patientConsentFormCreate)).toMatchObject({
        formId: consentForm.id,
      });
      const refetchedPatientConsentForms = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );
      expect(refetchedPatientConsentForms).toHaveLength(1);
    });
  });

  describe('patient consent form delete', () => {
    it('deletes a patient consent form', async () => {
      const { patient, user, consentForm } = await setup(txn);
      const patientConsentForm = await PatientConsentForm.create(
        {
          patientId: patient.id,
          userId: user.id,
          formId: consentForm.id,
          signedAt: '01/01/1999',
        },
        txn,
      );
      const patientConsentForms = await PatientConsentForm.getAllForPatient(patient.id, txn);
      expect(patientConsentForms).toHaveLength(1);
      const query = `mutation {
          patientConsentFormDelete(input: {
            patientConsentFormId: "${patientConsentForm.id}",
          }) {
            patientConsentFormId
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      expect(cloneDeep(result.data!.patientConsentFormDelete)).toMatchObject({
        patientConsentFormId: patientConsentForm.id,
      });
      const refetchedPatientConsentForms = await PatientConsentForm.getAllForPatient(
        patient.id,
        txn,
      );
      expect(refetchedPatientConsentForms).toHaveLength(0);
    });
  });
});
