import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Address from '../../models/address';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAddress from '../../models/patient-address';
import User from '../../models/user';
import { createMockAddress, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  address: Address;
  user: User;
  homeClinicId: string;
}

const userRole = 'physician';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - patient info',
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

  return { patient, address, user, homeClinicId };
}

describe('patient info resolver', () => {
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
  describe('patient info edit', () => {
    it('edits patient', async () => {
      const { patient, address, user } = await setup(txn);
      await PatientAddress.create({ patientId: patient.id, addressId: address.id }, txn);

      const query = `mutation {
          patientInfoEdit(input: {
            patientInfoId: "${patient.patientInfo.id}",
            gender: male,
            language: "ch",
            primaryAddressId: "${address.id}",
          }) {
            id, gender, language, primaryAddress { id, zip }
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        logger,
        txn,
      });
      expect(cloneDeep(result.data!.patientInfoEdit)).toMatchObject({
        id: patient.patientInfo.id,
        gender: 'male',
        language: 'ch',
        primaryAddress: {
          id: address.id,
          zip: '11201',
        },
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
