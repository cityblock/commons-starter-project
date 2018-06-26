import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import {
  createMockAddress,
  createMockClinic,
  createMockPatientExternalOrganization,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientDocument from '../patient-document';
import PatientExternalOrganization from '../patient-external-organization';
import User from '../user';

const userRole = 'Pharmacist' as UserRole;

interface ISetup {
  patient: Patient;
  user: User;
  patientExternalOrganization: PatientExternalOrganization;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const patientExternalOrganization = await PatientExternalOrganization.create(
    createMockPatientExternalOrganization(patient.id, 'Test Organization'),
    txn,
  );

  return { patient, patientExternalOrganization, user };
}

describe('patient external organization model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientExternalOrganization.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get', async () => {
    it('should get patient external organization by id', async () => {
      const { patientExternalOrganization } = await setup(txn);

      const result = await PatientExternalOrganization.get(patientExternalOrganization.id, txn);
      expect(result).toMatchObject(patientExternalOrganization);
    });

    it('should get patient contacts for the consent form', async () => {
      const { patient } = await setup(txn);
      const org = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization', {
          isConsentedForHiv: true,
          isConsentedForFamilyPlanning: true,
          isConsentedForGeneticTesting: true,
          isConsentedForMentalHealth: true,
        }),
        txn,
      );
      const org2 = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization 2', {
          isConsentedForHiv: true,
          isConsentedForFamilyPlanning: true,
          isConsentedForGeneticTesting: true,
          isConsentedForMentalHealth: true,
          isConsentedForStd: true,
          isConsentedForSubstanceUse: true,
        }),
        txn,
      );
      const orgDeleted = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, 'Test Organization Deleted', {
          isConsentedForHiv: true,
        }),
        txn,
      );
      await PatientExternalOrganization.delete(orgDeleted.id, txn);

      const results = await PatientExternalOrganization.getAllForConsents(patient.id, txn);
      expect(results).toHaveLength(2);

      delete org.address;
      expect(results).toContainEqual(expect.objectContaining(org));
      delete org2.address;
      expect(results).toContainEqual(expect.objectContaining(org2));
    });
  });

  describe('create', async () => {
    it('should create a patient external organization with minimal info', async () => {
      const { patient, patientExternalOrganization } = await setup(txn);

      expect(patientExternalOrganization).toMatchObject({
        address: null,
        consentDocumentId: null,
        patientId: patient.id,
        name: 'Test Organization',
        description: 'some organization description',
        phoneNumber: '+17778884455',
        faxNumber: '+12223338899',
        isConsentedForSubstanceUse: null,
        isConsentedForHiv: null,
        isConsentedForStd: null,
        isConsentedForGeneticTesting: null,
        isConsentedForFamilyPlanning: null,
        isConsentedForMentalHealth: null,
      });
    });

    it('should create a patient external organization with all extra fields', async () => {
      const { user, patient } = await setup(txn);
      const address = await Address.create(createMockAddress(user.id), txn);
      const consentDocument = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test_consent_doc.pdf',
        },
        txn,
      );
      const orgName = 'Special Organization';
      const patientExternalOrganization = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, orgName, {
          addressId: address.id,
          consentDocumentId: consentDocument.id,
          isConsentedForSubstanceUse: true,
          isConsentedForHiv: true,
          isConsentedForStd: false,
          isConsentedForGeneticTesting: true,
          isConsentedForFamilyPlanning: false,
          isConsentedForMentalHealth: false,
        }),
        txn,
      );

      expect(patientExternalOrganization).toMatchObject({
        address,
        patientId: patient.id,
        name: orgName,
        description: 'some organization description',
        phoneNumber: '+17778884455',
        faxNumber: '+12223338899',
        consentDocumentId: consentDocument.id,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: false,
        isConsentedForMentalHealth: false,
      });
    });

    it('should error for an invalid patient external organization', async () => {
      const { patient } = await setup(txn);
      const orgName = 'Special Organization';
      await expect(
        PatientExternalOrganization.create(
          {
            patientId: patient.id,
            name: orgName,
            phoneNumber: '64564',
          },
          txn,
        ),
      ).rejects.toMatch('Phone number must be in +12345678901 format');

      await expect(
        PatientExternalOrganization.create(
          {
            patientId: patient.id,
            name: orgName,
            faxNumber: '(617) 88 - 4364',
          },
          txn,
        ),
      ).rejects.toMatch('Phone number must be in +12345678901 format');

      await expect(
        PatientExternalOrganization.create(
          {
            patientId: patient.id,
            name: '',
          },
          txn,
        ),
      ).rejects.toMatchObject(new Error('name: should NOT be shorter than 1 characters'));
    });
  });

  describe('edit', async () => {
    it('should edit organization fields', async () => {
      const { patient, patientExternalOrganization, user } = await setup(txn);
      const name = 'Edited Name';
      const description = 'a description';
      const phoneNumber = '7879890033';
      const faxNumber = '2456667744';
      const address = await Address.create(createMockAddress(user.id), txn);
      const consentDocument = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test_consent_doc.pdf',
        },
        txn,
      );

      const result = await PatientExternalOrganization.edit(
        {
          name,
          description,
          phoneNumber,
          faxNumber,
          addressId: address.id,
          consentDocumentId: consentDocument.id,
          isConsentedForSubstanceUse: true,
          isConsentedForHiv: true,
          isConsentedForStd: false,
          isConsentedForGeneticTesting: false,
          isConsentedForFamilyPlanning: false,
          isConsentedForMentalHealth: true,
        },
        patientExternalOrganization.id,
        txn,
      );

      expect(result).toMatchObject({
        name,
        description,
        phoneNumber: `+1${phoneNumber}`,
        faxNumber: `+1${faxNumber}`,
        address,
        consentDocumentId: consentDocument.id,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: false,
        isConsentedForFamilyPlanning: false,
        isConsentedForMentalHealth: true,
      });
    });

    it('should null out nullable fields', async () => {
      const { user, patient } = await setup(txn);
      const address = await Address.create(createMockAddress(user.id), txn);
      const consentDocument = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test_consent_doc.pdf',
        },
        txn,
      );
      const orgName = 'Special Organization';
      const patientExternalOrganization = await PatientExternalOrganization.create(
        createMockPatientExternalOrganization(patient.id, orgName, {
          addressId: address.id,
          consentDocumentId: consentDocument.id,
          isConsentedForSubstanceUse: true,
          isConsentedForHiv: true,
          isConsentedForStd: false,
          isConsentedForGeneticTesting: true,
          isConsentedForFamilyPlanning: false,
          isConsentedForMentalHealth: false,
        }),
        txn,
      );

      const updatedOrganization = await PatientExternalOrganization.edit(
        {
          description: null,
          phoneNumber: null,
          faxNumber: null,
          addressId: null,
          consentDocumentId: null,
        },
        patientExternalOrganization.id,
        txn,
      );

      expect(updatedOrganization).toMatchObject({
        address: null,
        patientId: patient.id,
        name: orgName,
        description: null,
        phoneNumber: null,
        faxNumber: null,
        consentDocumentId: null,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: false,
        isConsentedForMentalHealth: false,
      });
    });

    it('should error for an invalid patient external organization', async () => {
      const { patientExternalOrganization } = await setup(txn);
      const orgName = 'Special Organization';
      await expect(
        PatientExternalOrganization.edit(
          {
            name: orgName,
            phoneNumber: '64564',
          },
          patientExternalOrganization.id,
          txn,
        ),
      ).rejects.toMatch('Phone number must be in +12345678901 format');

      await expect(
        PatientExternalOrganization.edit(
          {
            name: orgName,
            faxNumber: '(617) 88 - 4364',
          },
          patientExternalOrganization.id,
          txn,
        ),
      ).rejects.toMatch('Phone number must be in +12345678901 format');

      await expect(
        PatientExternalOrganization.edit(
          {
            name: '',
          },
          patientExternalOrganization.id,
          txn,
        ),
      ).rejects.toMatchObject(new Error('name: should NOT be shorter than 1 characters'));
    });
  });

  describe('delete', async () => {
    it('should delete patient external organization', async () => {
      const { patientExternalOrganization } = await setup(txn);
      const result = await PatientExternalOrganization.delete(patientExternalOrganization.id, txn);

      expect(result).toMatchObject({
        id: patientExternalOrganization.id,
        name: patientExternalOrganization.name,
        address: patientExternalOrganization.address,
      });
    });
  });

  it('gets patient id for a given organization', async () => {
    const { patient, patientExternalOrganization } = await setup(txn);
    const fetchedPatientId = await PatientExternalOrganization.getPatientIdForResource(
      patientExternalOrganization.id,
      txn,
    );

    expect(fetchedPatientId).toBe(patient.id);
  });
});
