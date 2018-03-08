import { transaction, Transaction } from 'objection';
import Db from '../../db';
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
import Phone from '../phone';
import User from '../user';

const userRole = 'admin';

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
  const phone = await Phone.create(createMockPhone(user.id), txn);
  const patientContact = await PatientContact.create(
    createMockPatientContact(patient.id, user.id, phone.id),
    txn,
  );

  return { patient, patientContact, user, phone };
}

describe('patient info model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', async () => {
    it('should get patient contact by id', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { patientContact } = await setup(txn);

        const result = await PatientContact.get(patientContact.id, txn);
        expect(result).toMatchObject(patientContact);
      });
    });

    it('should get patient contacts that are health care proxies for a patient', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { user, patient, phone } = await setup(txn);
        const proxy = await PatientContact.create(
          createMockPatientContact(patient.id, user.id, phone.id, { isHealthcareProxy: true }),
          txn,
        );

        const result = await PatientContact.getHealthcareProxiesForPatient(patient.id, txn);
        expect(result[0]).toMatchObject(proxy);
      });
    });
  });

  describe('create', async () => {
    it('should create a patient contact with minimal info', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { phone, patient, patientContact } = await setup(txn);

        expect(patientContact).toMatchObject({
          primaryPhoneId: phone.id,
          patientId: patient.id,
          firstName: 'harry',
          lastName: 'potter',
          relationToPatient: 'wizarding tutor',
          isEmergencyContact: false,
          isHealthcareProxy: false,
          canContact: false,
          primaryEmailId: null,
          primaryAddressId: null,
          description: 'some contact description',
        });
      });
    });

    it('should create a patient contact with all contact fields', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { user, phone, patient } = await setup(txn);
        const address = await Address.create(createMockAddress(user.id), txn);
        const email = await Email.create(createMockEmail(user.id), txn);
        const patientContact = await PatientContact.create(
          createMockPatientContact(patient.id, user.id, phone.id, {
            primaryAddressId: address.id,
            primaryEmailId: email.id,
            isEmergencyContact: true,
            isHealthcareProxy: true,
            canContact: true,
          }),
          txn,
        );

        expect(patientContact).toMatchObject({
          primaryPhoneId: phone.id,
          primaryEmailId: email.id,
          primaryAddressId: address.id,
          patientId: patient.id,
          firstName: 'harry',
          lastName: 'potter',
          relationToPatient: 'wizarding tutor',
          isEmergencyContact: true,
          isHealthcareProxy: true,
          canContact: true,
          description: 'some contact description',
        });
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient info', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { patient, patientContact, user, phone } = await setup(txn);
        const result = await PatientContact.edit(
          {
            firstName: 'ron',
            lastName: 'weasley',
            relationToPatient: 'best bud',
            isEmergencyContact: true,
            isHealthcareProxy: true,
            canContact: true,
            description: 'some magical thing',
            updatedById: user.id,
          },
          patientContact.id,
          txn,
        );

        expect(result).toMatchObject({
          primaryPhone: {
            id: phone.id,
            phoneNumber: phone.phoneNumber,
          },
          patientId: patient.id,
          firstName: 'ron',
          lastName: 'weasley',
          relationToPatient: 'best bud',
          isEmergencyContact: true,
          isHealthcareProxy: true,
          canContact: true,
          primaryEmailId: null,
          primaryAddressId: null,
          description: 'some magical thing',
        });
      });
    });

    it('should add address to patient contact', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { patient, patientContact, user } = await setup(txn);
        const address = await Address.create(createMockAddress(user.id), txn);

        const result = await PatientContact.edit(
          {
            primaryAddressId: address.id,
            updatedById: user.id,
          },
          patientContact.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patientContact.id,
          primaryAddress: {
            street1: address.street1,
            zip: address.zip,
            state: address.state,
            city: address.city,
          },
        });
      });
    });

    it('should add email to patient contact', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { patient, patientContact, user } = await setup(txn);
        const email = await Email.create(createMockEmail(user.id), txn);

        const result = await PatientContact.edit(
          {
            primaryEmailId: email.id,
            updatedById: user.id,
          },
          patientContact.id,
          txn,
        );

        expect(result).toMatchObject({
          patientId: patient.id,
          id: patientContact.id,
          primaryEmail: {
            emailAddress: email.emailAddress,
            description: email.description,
            updatedById: user.id,
          },
        });
      });
    });
  });
});
