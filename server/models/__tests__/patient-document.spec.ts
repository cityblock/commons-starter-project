import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Patient from '../patient';
import PatientDocument from '../patient-document';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  patient: Patient;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
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

  return { patient, user };
}

describe('patient document model', () => {
  let txn = null as any;

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

  describe('creating a patient document', async () => {
    it('should create a patient document', async () => {
      const { patient, user } = await setup(txn);

      const document = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'hcp',
        },
        txn,
      );
      const refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDocuments.length).toEqual(1);
      expect(refetchedPatientDocuments[0]).toMatchObject(document);
    });

    it('updates the computed patient status', async () => {
      const { patient, user } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isConsentSigned).toEqual(false);

      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'random.txt',
          description: 'some random document',
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'random2.txt',
          description: 'some random document',
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'cityblockConsent',
        },
        txn,
      );

      let refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isConsentSigned).toEqual(false);

      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test2.txt',
          description: 'some file for consent',
          documentType: 'hipaaConsent',
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test3.txt',
          description: 'some file for consent',
          documentType: 'hieHealthixConsent',
        },
        txn,
      );

      refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(refetchedComputedPatientStatus!.isConsentSigned).toEqual(true);
    });
  });

  describe('deleting a patient document', () => {
    it('should delete a patient document', async () => {
      const { patient, user } = await setup(txn);
      const documents = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(documents.length).toEqual(0);

      const document = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'cityblockConsent',
        },
        txn,
      );

      let refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDocuments.length).toEqual(1);

      await PatientDocument.delete(document.id, user.id, txn);

      refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDocuments.length).toEqual(0);
    });

    it('updates the computed patient status', async () => {
      const { patient, user } = await setup(txn);
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test2.txt',
          description: 'some file for consent',
          documentType: 'hipaaConsent',
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test3.txt',
          description: 'some file for consent',
          documentType: 'hieHealthixConsent',
        },
        txn,
      );
      const consent = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'cityblockConsent',
        },
        txn,
      );
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isConsentSigned).toEqual(true);

      await PatientDocument.delete(consent.id, user.id, txn);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isConsentSigned).toEqual(false);
    });
  });
});
