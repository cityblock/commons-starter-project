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
  return { patient, user };
}

describe('phone resolver', () => {
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

  describe('create phone for patient', async () => {
    it('should create phone with patient and associate it with patient', async () => {
      await transaction(Phone.knex(), async txn => {
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
          phoneNumber: '123-456-7890',
          type: 'home',
          description: 'moms home phone',
        });
        expect(log).toBeCalled();

        const patientPhone = await PatientPhone.getForPatient(patient.id, txn);
        expect(patientPhone).not.toBeNull();
        expect(patientPhone.length).toBe(1);
      });
    });

    it('should create phone with patient and make it primary for patient', async () => {
      await transaction(Phone.knex(), async txn => {
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
          phoneNumber: '111-111-1111',
          type: 'mobile',
          description: 'Some phone',
        });
        expect(log).toBeCalled();

        const patientPhone = await PatientPhone.getForPatient(patient.id, txn);
        expect(patientPhone).not.toBeNull();
        expect(patientPhone.length).toBe(1);

        const editedInfo = await PatientInfo.get(patient.patientInfo.id, txn);
        expect(editedInfo.primaryPhoneId).toBe(result.data!.phoneCreateForPatient.id);
      });
    });
  });

  describe('edit phone', async () => {
    it('should edit fields on phone', async () => {
      await transaction(Phone.knex(), async txn => {
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
          phoneNumber: '222-222-2222',
          description: 'Some phone',
        });
        expect(log).toBeCalled();
      });
    });
  });
});
