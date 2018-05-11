import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { PatientRelationOptions, UserRole } from 'schema';

import Address from '../../models/address';
import Clinic from '../../models/clinic';
import ComputedPatientStatus from '../../models/computed-patient-status';
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

const userRole = 'physician' as UserRole;
const permissions = 'green';

interface ISetup {
  patient: Patient;
  user: User;
}

interface ISetupContact {
  patientContact: PatientContact;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { patient, user };
}

async function setupPatientContact(
  patientId: string,
  userId: string,
  txn: Transaction,
): Promise<ISetupContact> {
  const phone = await Phone.create(createMockPhone(), txn);
  const address = await Address.create(createMockAddress(userId), txn);
  const email = await Email.create(createMockEmail(userId), txn);

  const patientContact = await PatientContact.create(
    createMockPatientContact(patientId, userId, phone, { email, address }),
    txn,
  );

  await PatientContactPhone.create({ phoneId: phone.id, patientContactId: patientContact.id }, txn);
  await PatientContactEmail.create({ emailId: email.id, patientContactId: patientContact.id }, txn);
  await PatientContactAddress.create(
    { addressId: address.id, patientContactId: patientContact.id },
    txn,
  );

  return { patientContact, phone };
}

describe('patient info model', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('patient contact resolvers', async () => {
    it('gets all patient contact healthcare proxies for patient with id', async () => {
      const { user, patient } = await setup(txn);
      const phone = await Phone.create(createMockPhone(), txn);
      await PatientContact.create(createMockPatientContact(patient.id, user.id, phone), txn);
      const proxy = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone, { isHealthcareProxy: true }),
        txn,
      );

      const query = `{
          patientContactHealthcareProxies(patientId: "${patient.id}") {
            id, patientId, isHealthcareProxy
          }
        }`;

      const result = await graphql(schema, query, null, {
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

  describe('create', async () => {
    it('should create a patient contact with minimal info', async () => {
      const { patient, user } = await setup(txn);

      const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            phone: {
              phoneNumber: "+11112223344",
              type: mobile
            },
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            phone { id, phoneNumber },
            email { id, emailAddress },
            address { id, zip },
          }
        }`;

      const result = await graphql(schema, query, null, {
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
        phone: { phoneNumber: '+11112223344' },
        email: null,
        address: null,
      });
      expect(log).toBeCalled();

      const patientContactPhone = await PatientContactPhone.getForPatientContact(
        result.data!.patientContactCreate.id,
        txn,
      );
      expect(patientContactPhone).not.toBeNull();
      expect(patientContactPhone.length).toBe(1);
    });

    it('updates computed patient status when creating a contact', async () => {
      const { patient, user } = await setup(txn);
      const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );

      expect(computedPatientStatus.isEmergencyContactAdded).toEqual(false);

      const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            phone: {
              phoneNumber: "+11112223344",
              type: mobile
            },
            isEmergencyContact: true,
          }) {
            id
          }
        }`;
      await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      const updatedComputedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );

      expect(updatedComputedPatientStatus.isEmergencyContactAdded).toEqual(true);
    });

    it('should create a patient contact with all contact fields', async () => {
      const { patient, user } = await setup(txn);

      const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            phone: {
              phoneNumber: "+11112223344",
              type: mobile
            },
            email: {
              emailAddress: "test@email.com",
            },
            address: {
              zip: "11238",
            },
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            phone { id, phoneNumber },
            email { id, emailAddress },
            address { id, zip },
          }
        }`;

      const result = await graphql(schema, query, null, {
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
        phone: { phoneNumber: '+11112223344' },
        email: { emailAddress: 'test@email.com' },
        address: { zip: '11238' },
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

    it('should create a patient contact but not empty address or email', async () => {
      const { patient, user } = await setup(txn);

      const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            phone: {
              phoneNumber: "+11112223344",
              type: mobile
            },
            email: {
              emailAddress: "",
            },
            address: {
              zip: "",
            },
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            phone { id, phoneNumber },
            email { id, emailAddress },
            address { id, zip },
          }
        }`;

      const result = await graphql(schema, query, null, {
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
        phone: { phoneNumber: '+11112223344' },
        email: null,
        address: null,
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
      expect(patientContactAddress).toHaveLength(0);

      const patientContactEmail = await PatientContactEmail.getForPatientContact(
        result.data!.patientContactCreate.id,
        txn,
      );
      expect(patientContactEmail).not.toBeNull();
      expect(patientContactEmail).toHaveLength(0);
    });
  });

  describe('delete', async () => {
    it('should delete a patient contact and all associated models', async () => {
      const { patient, user } = await setup(txn);
      const { patientContact } = await setupPatientContact(patient.id, user.id, txn);

      const query = `mutation {
          patientContactDelete(input: {
            patientContactId: "${patientContact.id}",
          }) { deletedAt }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.patientContactDelete).deletedAt).not.toBeFalsy();
      expect(log).toBeCalled();

      const addresses = await PatientContactAddress.getForPatientContact(patientContact.id, txn);
      expect(addresses).toHaveLength(0);

      const emails = await PatientContactEmail.getForPatientContact(patientContact.id, txn);
      expect(emails).toHaveLength(0);

      const phones = await PatientContactPhone.getForPatientContact(patientContact.id, txn);
      expect(phones).toHaveLength(0);

      await expect(PatientContact.get(patientContact.id, txn)).rejects.toMatch(
        `No such patient contact: ${patientContact.id}`,
      );
    });
  });

  describe('edit', async () => {
    it('should edit patient contact and create email and address', async () => {
      const { patient, user } = await setup(txn);
      const phone = await Phone.create(createMockPhone(), txn);

      const patientContact = await PatientContact.create(
        createMockPatientContact(patient.id, user.id, phone),
        txn,
      );

      await PatientContactPhone.create(
        { phoneId: phone.id, patientContactId: patientContact.id },
        txn,
      );

      const query = `mutation {
          patientContactEdit(input: {
            patientContactId: "${patientContact.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            phone: {
              phoneNumber: "+10001112255",
              type: mobile
            },
            email: {
              emailAddress: "changed@email.com",
            },
            address: {
              zip: "02139",
              state: "MA",
            },
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            phone { id, phoneNumber },
            email { id, emailAddress },
            address { id, zip, state },
          }
        }`;

      const result = await graphql(schema, query, null, {
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
        phone: { id: phone.id, phoneNumber: '+10001112255' },
        email: { emailAddress: 'changed@email.com' },
        address: { zip: '02139', state: 'MA' },
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

    it('updates computed patient status when editing a contact', async () => {
      const { patient, user } = await setup(txn);
      const patientContact = await PatientContact.create(
        {
          patientId: patient.id,
          updatedById: user.id,
          relationToPatient: 'friend' as PatientRelationOptions,
          firstName: 'Person',
          lastName: 'Last',
          isEmergencyContact: true,
          isHealthcareProxy: false,
          canContact: true,
        },
        txn,
      );
      const computedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );

      expect(computedPatientStatus.isEmergencyContactAdded).toEqual(true);

      const query = `mutation {
          patientContactEdit(input: {
            patientContactId: "${patientContact.id}"
            isEmergencyContact: false,
          }) {
            id
          }
        }`;
      await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      const updatedComputedPatientStatus = await ComputedPatientStatus.updateForPatient(
        patient.id,
        user.id,
        txn,
      );

      expect(updatedComputedPatientStatus.isEmergencyContactAdded).toEqual(false);
    });

    it('should edit patient contact and update email and address', async () => {
      const { patient, user } = await setup(txn);
      const { patientContact, phone } = await setupPatientContact(patient.id, user.id, txn);

      const query = `mutation {
          patientContactEdit(input: {
            patientContactId: "${patientContact.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            phone: {
              phoneNumber: "+10001112255",
              type: mobile,
            },
            email: {
              emailAddress: "changed@email.com",
            },
            address: {
              zip: "02139",
              state: "MA",
            },
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            phone { id, phoneNumber },
            email { id, emailAddress },
            address { id, zip, state },
          }
        }`;

      const result = await graphql(schema, query, null, {
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
        phone: { id: phone.id, phoneNumber: '+10001112255' },
        email: { emailAddress: 'changed@email.com' },
        address: { zip: '02139', state: 'MA' },
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

    it('should edit patient contact and delete email and address', async () => {
      const { patient, user } = await setup(txn);
      const { patientContact, phone } = await setupPatientContact(patient.id, user.id, txn);

      const query = `mutation {
          patientContactEdit(input: {
            patientContactId: "${patientContact.id}",
            firstName: "Hermione",
            lastName: "Granger",
            relationToPatient: friend,
            canContact: true,
            isHealthcareProxy: true,
            isEmergencyContact: true,
            phone: {
              phoneNumber: "+10001112255",
            },
            email: {
              emailAddress: "",
            },
            address: {
              zip: "",
              state: "",
            },
          }) {
            id,
            patientId,
            firstName,
            lastName,
            relationToPatient,
            isHealthcareProxy,
            isEmergencyContact,
            canContact,
            phone { id, phoneNumber },
            email { id, emailAddress },
            address { id, zip, state },
          }
        }`;

      const result = await graphql(schema, query, null, {
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
        phone: { id: phone.id, phoneNumber: '+10001112255' },
        email: null,
        address: null,
      });
      expect(log).toBeCalled();

      const patientContactAddress = await PatientContactAddress.getForPatientContact(
        result.data!.patientContactEdit.id,
        txn,
      );
      expect(patientContactAddress).not.toBeNull();
      expect(patientContactAddress).toHaveLength(0);

      const patientContactEmail = await PatientContactEmail.getForPatientContact(
        result.data!.patientContactEdit.id,
        txn,
      );
      expect(patientContactEmail).not.toBeNull();
      expect(patientContactEmail).toHaveLength(0);
    });
  });
});
