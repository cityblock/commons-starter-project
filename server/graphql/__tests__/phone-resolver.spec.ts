import { graphql } from 'graphql';
import * as kue from 'kue';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import { createMockPhone, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const queue = kue.createQueue();

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - phone',
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

describe('phone resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create phone', async () => {
    it('should create phone', async () => {
      const { user } = await setup(txn);
      const query = `mutation {
          phoneCreate(input: {
            phoneNumber: "123-456-7890",
            type: home,
            description: "moms home phone",
          }) {
            id, phoneNumber, type, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.phoneCreate)).toMatchObject({
        phoneNumber: '+11234567890',
        type: 'home',
        description: 'moms home phone',
      });
      expect(log).toBeCalled();
    });
  });

  describe('create phone for patient', async () => {
    it('should create phone with patient and associate it with patient', async () => {
      const { patient, user } = await setup(txn);
      const query = `mutation {
          phoneCreateForPatient(input: {
            patientId: "${patient.id}",
            phoneNumber: "123-456-7890",
            type: home,
            description: "moms home phone",
          }) {
            id, phoneNumber, type, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.phoneCreateForPatient)).toMatchObject({
        phoneNumber: '+11234567890',
        type: 'home',
        description: 'moms home phone',
      });
      expect(log).toBeCalled();

      const patientPhone = await PatientPhone.getAll(patient.id, txn);
      expect(patientPhone).not.toBeNull();
      expect(patientPhone.length).toBe(1);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'addPhoneNumber',
      });
    });

    it('should create phone with patient and make it primary for patient', async () => {
      const { patient, user } = await setup(txn);
      const query = `mutation {
          phoneCreateForPatient(input: {
            patientId: "${patient.id}",
            phoneNumber: "111-111-1111",
            type: mobile,
            description: "Some phone",
            isPrimary: true,
          }) {
            id, phoneNumber, type, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.phoneCreateForPatient)).toMatchObject({
        phoneNumber: '+11111111111',
        type: 'mobile',
        description: 'Some phone',
      });
      expect(log).toBeCalled();

      const patientPhone = await PatientPhone.getAll(patient.id, txn);
      expect(patientPhone).not.toBeNull();
      expect(patientPhone.length).toBe(1);

      const editedInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(editedInfo.primaryPhoneId).toBe(result.data!.phoneCreateForPatient.id);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'addPhoneNumber',
      });
    });
  });

  describe('delete phone', async () => {
    it('should delete phone', async () => {
      const { patient, user } = await setup(txn);
      const createQuery = `mutation {
          phoneCreateForPatient(input: {
            patientId: "${patient.id}",
            phoneNumber: "3332228899",
            type: mobile,
            description: "Some phone",
          }) {
            id, phoneNumber, description
          }
        }`;

      const createResult = await graphql(schema, createQuery, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      const phone = createResult.data!.phoneCreateForPatient;

      const query = `mutation {
          phoneDeleteForPatient(input: {
            phoneId: "${phone.id}",
            patientId: "${patient.id}",
          }) {
            id, phoneNumber, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.phoneDeleteForPatient)).toMatchObject({
        id: phone.id,
        phoneNumber: phone.phoneNumber,
        description: phone.description,
      });
      expect(log).toBeCalled();

      expect(queue.testMode.jobs.length).toBe(2);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'addPhoneNumber',
      });
      expect(queue.testMode.jobs[1].data).toMatchObject({
        patientId: patient.id,
        type: 'deletePhoneNumber',
      });
    });

    it('should delete primary phone', async () => {
      const { patient, user } = await setup(txn);
      const createQuery = `mutation {
          phoneCreateForPatient(input: {
            patientId: "${patient.id}",
            phoneNumber: "3332228899",
            type: mobile,
            description: "Some phone",
            isPrimary: true,
          }) {
            id, phoneNumber, description
          }
        }`;

      const createResult = await graphql(schema, createQuery, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      const phone = createResult.data!.phoneCreateForPatient;

      const initialPatientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(initialPatientInfo.primaryPhoneId).toBe(phone.id);

      const query = `mutation {
          phoneDeleteForPatient(input: {
            phoneId: "${phone.id}",
            patientId: "${patient.id}",
            isPrimary: true,
          }) {
            id, phoneNumber, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });

      expect(cloneDeep(result.data!.phoneDeleteForPatient)).toMatchObject({
        id: phone.id,
        phoneNumber: phone.phoneNumber,
        description: phone.description,
      });
      expect(log).toBeCalled();

      const patientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(patientInfo.primaryPhoneId).toBeFalsy();

      expect(queue.testMode.jobs.length).toBe(2);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'addPhoneNumber',
      });
      expect(queue.testMode.jobs[1].data).toMatchObject({
        patientId: patient.id,
        type: 'deletePhoneNumber',
      });
    });
  });

  describe('edit phone', async () => {
    it('should edit fields on phone', async () => {
      const { patient, user } = await setup(txn);
      const phone = await Phone.create(createMockPhone(), txn);
      const query = `mutation {
          phoneEdit(input: {
            phoneId: "${phone.id}",
            patientId: "${patient.id}",
            phoneNumber: "222-222-2222",
            description: "Some phone",
          }) {
            id, phoneNumber, type, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      expect(cloneDeep(result.data!.phoneEdit)).toMatchObject({
        phoneNumber: '+12222222222',
        description: 'Some phone',
      });
      expect(log).toBeCalled();

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        type: 'editPhoneNumber',
      });
    });
  });
});
