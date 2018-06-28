import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions, UserRole } from 'schema';
import uuid from 'uuid/v4';

import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Patient from '../patient';
import PatientDocument, { CORE_CONSENT_TYPES, FULL_CONSENT_TYPES } from '../patient-document';
import User from '../user';

const userRole = 'Pharmacist' as UserRole;

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
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
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
          documentType: 'hcp' as DocumentTypeOptions,
        },
        txn,
      );
      const refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDocuments.length).toEqual(1);
      expect(refetchedPatientDocuments[0]).toMatchObject(document);
    });

    it('should create a patient document with supplied id', async () => {
      const { patient, user } = await setup(txn);

      const document = await PatientDocument.create(
        {
          id: uuid(),
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'hcp' as DocumentTypeOptions,
        },
        txn,
      );
      const refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDocuments.length).toEqual(1);
      expect(refetchedPatientDocuments[0]).toMatchObject(document);
    });

    it('should reject creating a patient document with non uuid', async () => {
      const { patient, user } = await setup(txn);

      await expect(
        PatientDocument.create(
          {
            id: 'something random',
            patientId: patient.id,
            uploadedById: user.id,
            filename: 'test.txt',
            description: 'some file for consent',
            documentType: 'hcp' as DocumentTypeOptions,
          },
          txn,
        ),
      ).rejects.toMatchObject(new Error('id: should match format "uuid"'));
    });

    it('updates the computed patient status', async () => {
      const { patient, user } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isCoreConsentSigned).toEqual(false);

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
          documentType: 'treatmentConsent' as DocumentTypeOptions,
        },
        txn,
      );

      let refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isCoreConsentSigned).toEqual(false);

      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test2.txt',
          description: 'some file for consent',
          documentType: 'phiSharingConsent' as DocumentTypeOptions,
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test3.txt',
          description: 'some file for consent',
          documentType: 'hieHealthixConsent' as DocumentTypeOptions,
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test4.txt',
          description: 'some file for consent',
          documentType: 'privacyPracticesNotice' as DocumentTypeOptions,
        },
        txn,
      );
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test5.txt',
          description: 'some file for consent',
          documentType: 'textConsent' as DocumentTypeOptions,
        },
        txn,
      );

      refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(refetchedComputedPatientStatus!.isCoreConsentSigned).toEqual(true);
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
          documentType: 'treatmentConsent' as DocumentTypeOptions,
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
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'treatmentConsent' as DocumentTypeOptions,
        },
        txn,
      );
      const consent = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test4.txt',
          description: 'some file for consent',
          documentType: 'privacyPracticesNotice' as DocumentTypeOptions,
        },
        txn,
      );
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isCoreConsentSigned).toEqual(true);

      await PatientDocument.delete(consent.id, user.id, txn);

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isCoreConsentSigned).toEqual(false);
    });
  });

  describe('getting a patient document', async () => {
    it('should get all patient documents', async () => {
      const { patient, user } = await setup(txn);

      const documents = await PatientDocument.getAllForPatient(patient.id, txn);
      expect(documents.length).toEqual(0);

      const document = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test.txt',
          description: 'some file for consent',
          documentType: 'hcp' as DocumentTypeOptions,
        },
        txn,
      );
      let refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDocuments.length).toEqual(1);
      expect(refetchedPatientDocuments[0]).toMatchObject(document);

      const document2 = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test2.txt',
        },
        txn,
      );

      refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);
      expect(refetchedPatientDocuments.length).toEqual(2);

      await PatientDocument.delete(document2.id, user.id, txn);
      refetchedPatientDocuments = await PatientDocument.getAllForPatient(patient.id, txn);
      expect(refetchedPatientDocuments.length).toEqual(1);
      expect(refetchedPatientDocuments[0]).toMatchObject(document);
    });
  });

  it('should get all consent documents for a patient', async () => {
    const { patient, user } = await setup(txn);

    const documents = await PatientDocument.getConsentsForPatient(
      patient.id,
      CORE_CONSENT_TYPES,
      txn,
    );
    expect(documents.length).toEqual(0);

    const document = await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test.txt',
        documentType: 'treatmentConsent' as DocumentTypeOptions,
      },
      txn,
    );

    let refetchedCorePatientDocuments = await PatientDocument.getConsentsForPatient(
      patient.id,
      CORE_CONSENT_TYPES,
      txn,
    );
    expect(refetchedCorePatientDocuments.length).toEqual(1);
    expect(refetchedCorePatientDocuments[0]).toMatchObject(document);

    let refetchedFullPatientDocuments = await PatientDocument.getConsentsForPatient(
      patient.id,
      FULL_CONSENT_TYPES,
      txn,
    );
    expect(refetchedFullPatientDocuments.length).toEqual(1);
    expect(refetchedFullPatientDocuments[0]).toMatchObject(document);

    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test2.txt',
        documentType: 'phiSharingConsent' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test3.txt',
        documentType: 'hieHealthixConsent' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test3.txt',
        documentType: 'privacyPracticesNotice' as DocumentTypeOptions,
      },
      txn,
    );

    // non consents
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test4.txt',
        documentType: 'hcp' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test5.txt',
      },
      txn,
    );

    refetchedCorePatientDocuments = await PatientDocument.getConsentsForPatient(
      patient.id,
      CORE_CONSENT_TYPES,
      txn,
    );
    expect(refetchedCorePatientDocuments.length).toEqual(2);

    refetchedFullPatientDocuments = await PatientDocument.getConsentsForPatient(
      patient.id,
      FULL_CONSENT_TYPES,
      txn,
    );
    expect(refetchedFullPatientDocuments.length).toEqual(4);
    expect(refetchedFullPatientDocuments[0]).toMatchObject(document);
  });

  it('should get all hcp documents for a patient', async () => {
    const { patient, user } = await setup(txn);

    const documents = await PatientDocument.getHCPsForPatient(patient.id, txn);
    expect(documents.length).toEqual(0);

    const document = await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test.txt',
        documentType: 'hcp' as DocumentTypeOptions,
      },
      txn,
    );
    let refetchedPatientDocuments = await PatientDocument.getHCPsForPatient(patient.id, txn);

    expect(refetchedPatientDocuments.length).toEqual(1);
    expect(refetchedPatientDocuments[0]).toMatchObject(document);

    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test2.txt',
        documentType: 'hcp' as DocumentTypeOptions,
      },
      txn,
    );
    const document2 = await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'toDelete.txt',
        documentType: 'hcp' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.delete(document2.id, user.id, txn);

    // non hcp
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test4.txt',
        documentType: 'treatmentConsent' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test5.txt',
      },
      txn,
    );

    refetchedPatientDocuments = await PatientDocument.getHCPsForPatient(patient.id, txn);
    expect(refetchedPatientDocuments.length).toEqual(2);
  });

  it('should get all molst documents for a patient', async () => {
    const { patient, user } = await setup(txn);

    const documents = await PatientDocument.getMOLSTForPatient(patient.id, txn);
    expect(documents.length).toEqual(0);

    const document = await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test.txt',
        documentType: 'molst' as DocumentTypeOptions,
      },
      txn,
    );
    let refetchedPatientDocuments = await PatientDocument.getMOLSTForPatient(patient.id, txn);

    expect(refetchedPatientDocuments.length).toEqual(1);
    expect(refetchedPatientDocuments[0]).toMatchObject(document);

    const document2 = await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'toDelete.txt',
        documentType: 'molst' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.delete(document2.id, user.id, txn);

    // non molst
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test4.txt',
        documentType: 'hcp' as DocumentTypeOptions,
      },
      txn,
    );
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: 'test5.txt',
      },
      txn,
    );

    refetchedPatientDocuments = await PatientDocument.getMOLSTForPatient(patient.id, txn);
    expect(refetchedPatientDocuments.length).toEqual(1);
  });
});
