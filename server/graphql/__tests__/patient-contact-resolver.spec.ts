import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Address from '../../models/address';
import HomeClinic from '../../models/clinic';
import Email from '../../models/email';
import Patient from '../../models/patient';
import PatientContact from '../../models/patient-contact';
import Phone from '../../models/phone';
import User from '../../models/user';
import {
  createMockAddress,
  createMockEmail,
  createMockPatientContact,
  createMockPhone,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  address: Address;
  phone: Phone;
  email: Email;
  user: User;
  homeClinicId: string;
}

const userRole = 'physician';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic',
      departmentId: 1,
    },
    txn,
  );
  const homeClinicId = homeClinic.id;
  const user = await User.create(
    {
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      email: 'a@b.com',
      userRole,
      homeClinicId,
    },
    txn,
  );
  const patient = await createPatient({ cityblockId: 1, homeClinicId }, txn);
  const address = await Address.create(createMockAddress(user.id), txn);
  const phone = await Phone.create(createMockPhone(user.id), txn);
  const email = await Email.create(createMockEmail(user.id), txn);

  return { patient, address, phone, email, user, homeClinicId };
}

describe('patient contact resolver', () => {
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

  describe('patient contact create', () => {
    it('creates patient contact', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, phone, email, address, user } = await setup(txn);
        const patientContactFields = createMockPatientContact(patient.id, user.id, phone.id, {
          primaryEmailId: email.id,
          primaryAddressId: address.id,
        });

        const query = `mutation {
          patientContactCreate(input: {
            patientId: "${patient.id}",
            relationToPatient: "${patientContactFields.relationToPatient}",
            firstName: "${patientContactFields.firstName}",
            lastName: "${patientContactFields.lastName}",
            isEmergencyContact: ${patientContactFields.isEmergencyContact},
            isHealthcareProxy: ${patientContactFields.isHealthcareProxy},
            canContact: ${patientContactFields.canContact},
            description: "${patientContactFields.description}",
            primaryPhoneId: "${phone.id}",
            primaryEmailId: "${email.id}",
            primaryAddressId: "${address.id}",
          }) {
            id,
            patientId,
            relationToPatient,
            firstName,
            lastName,
            isEmergencyContact,
            isHealthcareProxy,
            canContact,
            description,
            primaryAddress { id, zip },
            primaryEmail { id, emailAddress },
            primaryPhone { id, phoneNumber },
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
          relationToPatient: patientContactFields.relationToPatient,
          firstName: patientContactFields.firstName,
          lastName: patientContactFields.lastName,
          isEmergencyContact: patientContactFields.isEmergencyContact,
          isHealthcareProxy: patientContactFields.isHealthcareProxy,
          canContact: patientContactFields.canContact,
          description: patientContactFields.description,
          primaryPhone: { id: phone.id, phoneNumber: phone.phoneNumber },
          primaryEmail: { id: email.id, emailAddress: email.emailAddress },
          primaryAddress: { id: address.id, zip: address.zip },
        });
        expect(log).toBeCalled();

        const result2 = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions: 'red',
          logger,
          txn,
        });
        expect(result2.errors![0].message).toBe('red not able to create patient');
      });
    });
  });

  describe('patient contact edit', () => {
    it('edits patient contact', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, phone, email, address, user } = await setup(txn);
        const patientContact = await PatientContact.create(
          createMockPatientContact(patient.id, user.id, phone.id),
          txn,
        );

        const query = `mutation {
          patientContactEdit(input: {
            patientContactId: "${patientContact.id}",
            relationToPatient: "father",
            firstName: "Albus",
            lastName: "Dumbledore",
            isEmergencyContact: true,
            isHealthcareProxy: true,
            canContact: true,
            description: "This is the best person to contact",
            primaryEmailId: "${email.id}",
            primaryAddressId: "${address.id}",
          }) {
            id,
            patientId,
            relationToPatient,
            firstName,
            lastName,
            isEmergencyContact,
            isHealthcareProxy,
            canContact,
            description,
            primaryAddress { id, zip },
            primaryEmail { id, emailAddress },
            primaryPhone { id, phoneNumber },
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
          id: patientContact.id,
          relationToPatient: 'father',
          firstName: 'Albus',
          lastName: 'Dumbledore',
          isEmergencyContact: true,
          isHealthcareProxy: true,
          canContact: true,
          description: 'This is the best person to contact',
          primaryPhone: { id: phone.id, phoneNumber: phone.phoneNumber },
          primaryEmail: { id: email.id, emailAddress: email.emailAddress },
          primaryAddress: { id: address.id, zip: address.zip },
        });
        expect(log).toBeCalled();

        const result2 = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions: 'red',
          logger,
          txn,
        });
        expect(result2.errors![0].message).toBe('red not able to edit patient');
      });
    });
  });
});
