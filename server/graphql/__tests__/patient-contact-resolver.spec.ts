import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Address from '../../models/address';
import Clinic from '../../models/clinic';
import Email from '../../models/email';
import Patient from '../../models/patient';
import PatientContact from '../../models/patient-contact';
import PatientContactAddress from '../../models/patient-contact-address';
import PatientContactEmail from '../../models/patient-contact-email';
import PatientContactPhone from '../../models/patient-contact-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import {
  createMockAddress,
  createMockClinic,
  createMockEmail,
  createMockPatientContact,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'physician';
const permissions = 'green';

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(user.id), txn);

  return { patient, user, phone };
}

describe('patient info model', () => {
  let db: Db;
  const log = jest.fn();
  const logger = { log };

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('patient contact resolvers', async () => {
    it('gets all patient contact healthcare proxies for patient with id', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { user, patient, phone } = await setup(txn);
        await PatientContact.create(createMockPatientContact(patient.id, user.id, phone.id), txn);
        const proxy = await PatientContact.create(
          createMockPatientContact(patient.id, user.id, phone.id, { isHealthcareProxy: true }),
          txn,
        );

        const query = `{
          patientContactHealthcareProxies(patientId: "${patient.id}") {
            id, patientId, isHealthcareProxy
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.patientContactHealthcareProxies[0])).toMatchObject({
          id: proxy.id,
          patientId: patient.id,
          isHealthcareProxy: true,
        });
        expect(log).toBeCalled();
      });
    });
  });

  describe('create', async () => {
    it('should create a patient contact with minimal info', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { phone, patient, user } = await setup(txn);

        const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: "friend",
            primaryPhoneId: "${phone.id}",
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            primaryPhone { id, phoneNumber },
            primaryEmail { id, emailAddress },
            primaryAddress { id, zip },
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.patientContactCreate)).toMatchObject({
          patientId: patient.id,
          firstName: 'Hermione',
          lastName: 'Granger',
          relationToPatient: 'friend',
          isHealthcareProxy: false,
          isEmergencyContact: false,
          canContact: false,
          primaryPhone: { id: phone.id, phoneNumber: phone.phoneNumber },
          primaryEmail: null,
          primaryAddress: null,
        });
        expect(log).toBeCalled();

        const patientContactPhone = await PatientContactPhone.getForPatientContact(
          result.data!.patientContactCreate.id,
          txn,
        );
        expect(patientContactPhone).not.toBeNull();
        expect(patientContactPhone.length).toBe(1);
      });
    });

    it('should create a patient contact with all contact fields', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { phone, patient, user } = await setup(txn);
        const address = await Address.create(createMockAddress(user.id), txn);
        const email = await Email.create(createMockEmail(user.id), txn);

        const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: "friend",
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            primaryPhoneId: "${phone.id}",
            primaryEmailId: "${email.id}",
            primaryAddressId: "${address.id}",
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            primaryPhone { id, phoneNumber },
            primaryEmail { id, emailAddress },
            primaryAddress { id, zip },
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.patientContactCreate)).toMatchObject({
          patientId: patient.id,
          firstName: 'Hermione',
          lastName: 'Granger',
          relationToPatient: 'friend',
          isHealthcareProxy: true,
          isEmergencyContact: true,
          canContact: true,
          primaryPhone: { id: phone.id, phoneNumber: phone.phoneNumber },
          primaryEmail: { id: email.id, emailAddress: email.emailAddress },
          primaryAddress: { id: address.id, zip: address.zip },
        });
        expect(log).toBeCalled();

        const patientContactPhone = await PatientContactPhone.getForPatientContact(
          result.data!.patientContactCreate.id,
          txn,
        );
        expect(patientContactPhone).not.toBeNull();
        expect(patientContactPhone.length).toBe(1);

        const patientContactAddress = await PatientContactAddress.getForPatientContact(
          result.data!.patientContactCreate.id,
          txn,
        );
        expect(patientContactAddress).not.toBeNull();
        expect(patientContactAddress).toHaveLength(1);

        const patientContactEmail = await PatientContactEmail.getForPatientContact(
          result.data!.patientContactCreate.id,
          txn,
        );
        expect(patientContactEmail).not.toBeNull();
        expect(patientContactEmail).toHaveLength(1);
      });
    });
  });

  describe('edit', async () => {
    it('should edit patient contact', async () => {
      await transaction(PatientContact.knex(), async txn => {
        const { patient, user, phone } = await setup(txn);
        const patientContact = await PatientContact.create(
          createMockPatientContact(patient.id, user.id, phone.id),
          txn,
        );
        const address = await Address.create(createMockAddress(user.id), txn);
        const email = await Email.create(createMockEmail(user.id), txn);

        const query = `mutation {
          patientContactEdit(input: {
            patientContactId: "${patientContact.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: "friend",
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            primaryEmailId: "${email.id}",
            primaryAddressId: "${address.id}",
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            primaryPhone { id, phoneNumber },
            primaryEmail { id, emailAddress },
            primaryAddress { id, zip },
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.patientContactEdit)).toMatchObject({
          patientId: patient.id,
          firstName: 'Hermione',
          lastName: 'Granger',
          relationToPatient: 'friend',
          isHealthcareProxy: true,
          isEmergencyContact: true,
          canContact: true,
          primaryPhone: { id: phone.id, phoneNumber: phone.phoneNumber },
          primaryEmail: { id: email.id, emailAddress: email.emailAddress },
          primaryAddress: { id: address.id, zip: address.zip },
        });
        expect(log).toBeCalled();

        const patientContactAddress = await PatientContactAddress.getForPatientContact(
          result.data!.patientContactEdit.id,
          txn,
        );
        expect(patientContactAddress).not.toBeNull();
        expect(patientContactAddress).toHaveLength(1);

        const patientContactEmail = await PatientContactEmail.getForPatientContact(
          result.data!.patientContactEdit.id,
          txn,
        );
        expect(patientContactEmail).not.toBeNull();
        expect(patientContactEmail).toHaveLength(1);
      });
    });
  });
});
