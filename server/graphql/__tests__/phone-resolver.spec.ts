import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import { createMockPhone, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'physician';
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
        db,
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
        db,
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
        db,
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
    });
  });

  describe('delete phone', async () => {
    it('should delete phone', async () => {
      const { patient, user } = await setup(txn);
      const createQuery = `mutation {
          phoneCreateForPatient(input: {
            patientId: "${patient.id}",
            phoneNumber: "3332228899",
            description: "Some phone",
          }) {
            id, phoneNumber, description
          }
        }`;

      const createResult = await graphql(schema, createQuery, null, {
        db,
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
        db,
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
    });

    it('should delete primary phone', async () => {
      const { patient, user } = await setup(txn);
      const createQuery = `mutation {
          phoneCreateForPatient(input: {
            patientId: "${patient.id}",
            phoneNumber: "3332228899",
            description: "Some phone",
            isPrimary: true,
          }) {
            id, phoneNumber, description
          }
        }`;

      const createResult = await graphql(schema, createQuery, null, {
        db,
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
        db,
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
    });
  });

  describe('edit phone', async () => {
    it('should edit fields on phone', async () => {
      const { patient, user } = await setup(txn);
      const phone = await Phone.create(createMockPhone(user.id), txn);
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
        db,
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
    });
  });
});
