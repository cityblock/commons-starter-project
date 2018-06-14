import { transaction, Transaction } from 'objection';
import { PatientRelationOptions, UserRole } from 'schema';

import {
  createMockAddress,
  createMockClinic,
  createMockEmail,
  createMockPatientContact,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import Email from '../email';
import Patient from '../patient';
import PatientContact from '../patient-contact';
import PatientContactAddress from '../patient-contact-address';
import PatientContactEmail from '../patient-contact-email';
import PatientContactPhone from '../patient-contact-phone';
import PatientDocument from '../patient-document';
import Phone from '../phone';
import User from '../user';

const userRole = 'admin' as UserRole;

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
  patientContact: PatientContact;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  const patientContact = await PatientContact.create(
    createMockPatientContact(patient.id, user.id, phone),
    txn,
  );
  await PatientContactPhone.create({ phoneId: phone.id, patientContactId: patientContact.id }, txn);
  const fullPatientContact = await PatientContact.get(patientContact.id, txn);

  return { patient, patientContact: fullPatientContact, user, phone };
}

describe('patient info model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientContact.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get', async () => {
    it('should get patient contact by id', async () => {
      const { patientContact } = await setup(txn);

      const result = await PatientContact.get(patientContact.id, txn);
      expect(result).toMatchObject(patientContact);
    });

    it('should get patient contacts that are health care proxies for a patient', async () => {
      const { user, patient, phone } = await setup(txn);
      const proxy = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone, { isHealthcareProxy: true }),
        txn,
      );

      const result = await PatientContact.getHealthcareProxiesForPatient(patient.id, txn);
      expect(result[0]).toMatchObject(proxy);
    });

    it('should get patient contacts that are emergency contacts for a patient', async () => {
      const { user, patient, phone } = await setup(txn);
      const emergencyContact = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone, { isEmergencyContact: true }),
        txn,
      );

      const result = await PatientContact.getEmergencyContactsForPatient(patient.id, txn);
      expect(result[0]).toMatchObject(emergencyContact);
    });
  });

  describe('create', async () => {
    it('should create a patient contact with minimal info', async () => {
      const { phone, patient, patientContact } = await setup(txn);

      expect(patientContact).toMatchObject({
        phone,
        patientId: patient.id,
        firstName: 'harry',
        lastName: 'potter',
        relationToPatient: 'parent',
        isEmergencyContact: false,
        isHealthcareProxy: false,
        email: null,
        address: null,
        description: 'some contact description',
      });
    });

    it('should create a patient contact with all contact fields', async () => {
      const { user, phone, patient } = await setup(txn);
      const address = await Address.create(createMockAddress(user.id), txn);
      const email = await Email.create(createMockEmail(user.id), txn);
      const consentDocument = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test_consent_doc.pdf',
        },
        txn,
      );
      const patientContact = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone, {
          address,
          email,
          isEmergencyContact: true,
          isHealthcareProxy: true,
          consentDocumentId: consentDocument.id,
          isConsentedForSubstanceUse: true,
          isConsentedForHiv: true,
          isConsentedForStd: false,
          isConsentedForGeneticTesting: true,
          isConsentedForFamilyPlanning: false,
        }),
        txn,
      );

      await PatientContactPhone.create(
        { phoneId: phone.id, patientContactId: patientContact.id },
        txn,
      );
      await PatientContactEmail.create(
        { emailId: email.id, patientContactId: patientContact.id },
        txn,
      );
      await PatientContactAddress.create(
        { addressId: address.id, patientContactId: patientContact.id },
        txn,
      );

      expect(patientContact).toMatchObject({
        phone: null,
        email: null,
        address: null,
        patientId: patient.id,
        firstName: 'harry',
        lastName: 'potter',
        relationToPatient: 'parent',
        isEmergencyContact: true,
        isHealthcareProxy: true,
        description: 'some contact description',
        consentDocumentId: consentDocument.id,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: false,
      });

      const fullPatientContact = await PatientContact.get(patientContact.id, txn);

      expect(fullPatientContact).toMatchObject({
        phone,
        email,
        address,
        patientId: patient.id,
        firstName: 'harry',
        lastName: 'potter',
        relationToPatient: 'parent',
        isEmergencyContact: true,
        isHealthcareProxy: true,
        description: 'some contact description',
        consentDocumentId: consentDocument.id,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: false,
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient contact', async () => {
      const { patient, patientContact, user, phone } = await setup(txn);
      const consentDocument = await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: 'test_consent_doc.pdf',
        },
        txn,
      );

      const result = await PatientContact.edit(
        {
          firstName: 'ron',
          lastName: 'weasley',
          relationToPatient: 'friend' as PatientRelationOptions,
          isEmergencyContact: true,
          isHealthcareProxy: true,
          description: 'some magical thing',
          updatedById: user.id,
          consentDocumentId: consentDocument.id,
          isConsentedForSubstanceUse: true,
          isConsentedForHiv: true,
          isConsentedForStd: false,
          isConsentedForGeneticTesting: true,
          isConsentedForFamilyPlanning: false,
        },
        patientContact.id,
        txn,
      );

      expect(result).toMatchObject({
        phone,
        patientId: patient.id,
        firstName: 'ron',
        lastName: 'weasley',
        relationToPatient: 'friend',
        isEmergencyContact: true,
        isHealthcareProxy: true,
        email: null,
        address: null,
        description: 'some magical thing',
        consentDocumentId: consentDocument.id,
        isConsentedForSubstanceUse: true,
        isConsentedForHiv: true,
        isConsentedForStd: false,
        isConsentedForGeneticTesting: true,
        isConsentedForFamilyPlanning: false,
      });
    });
  });

  describe('delete', async () => {
    it('should delete patient contact', async () => {
      const { patient, user, patientContact } = await setup(txn);
      const result = await PatientContact.delete(patientContact.id, user.id, txn);

      expect(result).toMatchObject({
        patientId: patient.id,
        firstName: 'harry',
        lastName: 'potter',
        relationToPatient: 'parent',
        isEmergencyContact: false,
        isHealthcareProxy: false,
        description: 'some contact description',
      });
    });
  });
});
