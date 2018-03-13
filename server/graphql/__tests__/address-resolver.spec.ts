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

  describe('create address', async () => {
    it('should create address', async () => {
      await transaction(Address.knex(), async txn => {
        const { user } = await setup(txn);
        const query = `mutation {
          addressCreate(input: {
            zip: "11238",
            state: "NY",
            city: "Brooklyn",
            street1: "600 Vanderbilt Ave",
            description: "Some building",
          }) {
            id, zip, state, city, street1, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.addressCreate)).toMatchObject({
          street1: '600 Vanderbilt Ave',
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          description: 'Some building',
        });
        expect(log).toBeCalled();
      });
    });
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
            street1: "600 Vanderbilt Ave",
            description: "Some building",
          }) {
            id, zip, state, city, street1, description
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
          street1: '600 Vanderbilt Ave',
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          description: 'Some building',
        });
        expect(log).toBeCalled();

        const patientAddress = await PatientAddress.getAll(patient.id, txn);
        expect(patientAddress).not.toBeNull();
        expect(patientAddress.length).toBe(1);
      });
    });

    it('should create address with patient and make it primary for patient', async () => {
      await transaction(Address.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const query = `mutation {
          addressCreateForPatient(input: {
            patientId: "${patient.id}",
            zip: "11238",
            state: "NY",
            city: "Brooklyn",
            street1: "600 Vanderbilt Ave",
            description: "Some building",
            isPrimary: true,
          }) {
            id, zip, state, city, street1, description
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
          street1: '600 Vanderbilt Ave',
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          description: 'Some building',
        });
        expect(log).toBeCalled();

        const patientAddress = await PatientAddress.getAll(patient.id, txn);
        expect(patientAddress).not.toBeNull();
        expect(patientAddress.length).toBe(1);

        const editedInfo = await PatientInfo.get(patient.patientInfo.id, txn);
        expect(editedInfo.primaryAddressId).toBe(result.data!.addressCreateForPatient.id);
      });
    });
  });

  describe('delete address', async () => {
    it('should delete address', async () => {
      await transaction(Address.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const createQuery = `mutation {
          addressCreateForPatient(input: {
            patientId: "${patient.id}",
            zip: "11238",
            description: "Some address",
          }) {
            id, zip, description
          }
        }`;

        const createResult = await graphql(schema, createQuery, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });
        const address = createResult.data!.addressCreateForPatient;

        const query = `mutation {
          addressDeleteForPatient(input: {
            addressId: "${address.id}",
            patientId: "${patient.id}",
          }) {
            id, zip, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.addressDeleteForPatient)).toMatchObject({
          id: address.id,
          zip: address.zip,
          description: address.description,
        });
        expect(log).toBeCalled();
      });
    });

    it('should delete primary address', async () => {
      await transaction(Address.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const createQuery = `mutation {
          addressCreateForPatient(input: {
            patientId: "${patient.id}",
            zip: "11238",
            description: "Some address",
            isPrimary: true,
          }) {
            id, zip, description
          }
        }`;

        const createResult = await graphql(schema, createQuery, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });
        const address = createResult.data!.addressCreateForPatient;

        const initialPatientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
        expect(initialPatientInfo.primaryAddressId).toBe(address.id);

        const query = `mutation {
          addressDeleteForPatient(input: {
            addressId: "${address.id}",
            patientId: "${patient.id}",
            isPrimary: true,
          }) {
            id, zip, description
          }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
        });

        expect(cloneDeep(result.data!.addressDeleteForPatient)).toMatchObject({
          id: address.id,
          zip: address.zip,
          description: address.description,
        });
        expect(log).toBeCalled();

        const patientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
        expect(patientInfo.primaryAddressId).toBeFalsy();
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
            street1: "600 Vanderbilt Ave",
            description: "Some building",
          }) {
            id, zip, state, city, street1, description
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
          street1: '600 Vanderbilt Ave',
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
