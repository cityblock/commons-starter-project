import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import Email from '../../models/email';
import Patient from '../../models/patient';
import PatientEmail from '../../models/patient-email';
import PatientInfo from '../../models/patient-info';
import User from '../../models/user';
import { createMockEmail, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - email',
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
  return { patient, user };
}

describe('email resolver', () => {
  const log = jest.fn();
  const logger = { log };
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

  describe('create email', async () => {
    it('should create email', async () => {
      const { user } = await setup(txn);
      const query = `mutation {
          emailCreate(input: {
            emailAddress: "patient@email.com",
            description: "Some email",
          }) {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.emailCreate)).toMatchObject({
        emailAddress: 'patient@email.com',
        description: 'Some email',
      });
      expect(log).toBeCalled();
    });
  });

  describe('create email for patient', async () => {
    it('should create email with patient and associate it with patient', async () => {
      const { patient, user } = await setup(txn);
      const query = `mutation {
          emailCreateForPatient(input: {
            patientId: "${patient.id}",
            emailAddress: "patient@email.com",
            description: "Some email",
          }) {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.emailCreateForPatient)).toMatchObject({
        emailAddress: 'patient@email.com',
        description: 'Some email',
      });
      expect(log).toBeCalled();

      const patientEmail = await PatientEmail.getAll(patient.id, txn);
      expect(patientEmail).not.toBeNull();
      expect(patientEmail.length).toBe(1);
    });

    it('should create email with patient and make it primary for patient', async () => {
      const { patient, user } = await setup(txn);
      const query = `mutation {
          emailCreateForPatient(input: {
            patientId: "${patient.id}",
            emailAddress: "patient@email.com",
            description: "Some email",
            isPrimary: true,
          }) {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.emailCreateForPatient)).toMatchObject({
        emailAddress: 'patient@email.com',
        description: 'Some email',
      });
      expect(log).toBeCalled();

      const patientEmail = await PatientEmail.getAll(patient.id, txn);
      expect(patientEmail).not.toBeNull();
      expect(patientEmail.length).toBe(1);

      const editedInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(editedInfo.primaryEmailId).toBe(result.data!.emailCreateForPatient.id);
    });
  });

  describe('delete email', async () => {
    it('should delete email', async () => {
      const { patient, user } = await setup(txn);
      const createQuery = `mutation {
          emailCreateForPatient(input: {
            patientId: "${patient.id}",
            emailAddress: "patient@email.com",
            description: "Some email",
          }) {
            id, emailAddress, description
          }
        }`;

      const createResult = await graphql(schema, createQuery, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      const email = createResult.data!.emailCreateForPatient;

      const query = `mutation {
          emailDeleteForPatient(input: {
            emailId: "${email.id}",
            patientId: "${patient.id}",
          }) {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.emailDeleteForPatient)).toMatchObject({
        id: email.id,
        emailAddress: email.emailAddress,
        description: email.description,
      });
      expect(log).toBeCalled();
    });

    it('should delete primary email', async () => {
      const { patient, user } = await setup(txn);
      const createQuery = `mutation {
          emailCreateForPatient(input: {
            patientId: "${patient.id}",
            emailAddress: "patient@email.com",
            description: "Some email",
            isPrimary: true,
          }) {
            id, emailAddress, description
          }
        }`;

      const createResult = await graphql(schema, createQuery, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      const email = createResult.data!.emailCreateForPatient;

      const initialPatientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(initialPatientInfo.primaryEmailId).toBe(email.id);

      const query = `mutation {
          emailDeleteForPatient(input: {
            emailId: "${email.id}",
            patientId: "${patient.id}",
            isPrimary: true,
          }) {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.emailDeleteForPatient)).toMatchObject({
        id: email.id,
        emailAddress: email.emailAddress,
        description: email.description,
      });
      expect(log).toBeCalled();

      const patientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(patientInfo.primaryEmailId).toBeFalsy();
    });
  });

  describe('edit email', async () => {
    it('should edit fields on email', async () => {
      const { patient, user } = await setup(txn);
      const email = await Email.create(createMockEmail(user.id), txn);
      const query = `mutation {
          emailEdit(input: {
            emailId: "${email.id}",
            patientId: "${patient.id}",
            emailAddress: "patient@email.com",
            description: "Some email",
          }) {
            id, emailAddress, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      expect(cloneDeep(result.data!.emailEdit)).toMatchObject({
        emailAddress: 'patient@email.com',
        description: 'Some email',
      });
      expect(log).toBeCalled();
    });
  });
});
