import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Address from '../../models/address';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAddress from '../../models/patient-address';
import PatientInfo from '../../models/patient-info';
import User from '../../models/user';
import { createMockAddress, createPatient } from '../../spec-helpers';
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

describe('address resolver', () => {
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

  describe('create address for patient', async () => {
    it('should create address with patient and associate it with patient', async () => {
      await transaction(Address.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const query = `mutation {
          addressCreateForPatient(input: {
            patientId: "${patient.id}",
            zip: "11238",
            state: "NY",
            city: "Brooklyn",
            street: "600 Vanderbilt Ave",
            description: "Some building",
          }) {
            id, zip, state, city, street, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });
        expect(cloneDeep(result.data!.addressCreateForPatient)).toMatchObject({
          street: '600 Vanderbilt Ave',
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          description: 'Some building',
        });
        expect(log).toBeCalled();

        const patientAddress = await PatientAddress.getForPatient(patient.id, txn);
        expect(patientAddress).not.toBeNull();
        expect(patientAddress.length).toBe(1);
      });
    });

    it('should create address with patient and make it primary for patient', async () => {
      await transaction(Address.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const query = `mutation {
          addressCreatePrimaryForPatient(input: {
            patientInfoId: "${patient.patientInfo.id}",
            zip: "11238",
            state: "NY",
            city: "Brooklyn",
            street: "600 Vanderbilt Ave",
            description: "Some building",
          }) {
            id, zip, state, city, street, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });
        expect(cloneDeep(result.data!.addressCreatePrimaryForPatient)).toMatchObject({
          street: '600 Vanderbilt Ave',
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          description: 'Some building',
        });
        expect(log).toBeCalled();

        const patientAddress = await PatientAddress.getForPatient(patient.id, txn);
        expect(patientAddress).not.toBeNull();
        expect(patientAddress.length).toBe(1);

        const editedInfo = await PatientInfo.get(patient.patientInfo.id, txn);
        expect(editedInfo.primaryAddressId).toBe(result.data!.addressCreatePrimaryForPatient.id);
      });
    });
  });

  describe('edit address', async () => {
    it('should edit fields on address', async () => {
      await transaction(Address.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const address = await Address.create(createMockAddress(user.id), txn);
        const query = `mutation {
          addressEdit(input: {
            addressId: "${address.id}",
            patientId: "${patient.id}",
            zip: "11238",
            state: "CT",
            city: "Haverford",
            street: "600 Vanderbilt Ave",
            description: "Some building",
          }) {
            id, zip, state, city, street, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });
        expect(cloneDeep(result.data!.addressEdit)).toMatchObject({
          street: '600 Vanderbilt Ave',
          zip: '11238',
          state: 'CT',
          city: 'Haverford',
          description: 'Some building',
        });
        expect(log).toBeCalled();
      });
    });
  });
});
