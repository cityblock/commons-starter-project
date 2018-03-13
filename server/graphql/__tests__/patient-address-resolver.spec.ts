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
  address: Address;
  primaryAddress: Address;
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
  const primaryAddress = await Address.create({ zip: '11111', updatedById: user.id }, txn);
  await PatientAddress.create({ addressId: address.id, patientId: patient.id }, txn);
  await PatientAddress.create({ addressId: primaryAddress.id, patientId: patient.id }, txn);
  await PatientInfo.edit(
    { primaryAddressId: primaryAddress.id, updatedById: user.id },
    patient.patientInfo.id,
    txn,
  );

  return { patient, user, address, primaryAddress };
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

  describe('get all patient addresses', async () => {
    it('should get all patient addresses', async () => {
      await transaction(Address.knex(), async txn => {
        const { primaryAddress, address, patient, user } = await setup(txn);
        const query = `{
          patientAddresses(patientId: "${patient.id}") {
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

        expect(cloneDeep(result.data!.patientAddresses)).toHaveLength(2);
        expect(cloneDeep(result.data!.patientAddresses)).toContainEqual(
          expect.objectContaining({
            id: primaryAddress.id,
            zip: primaryAddress.zip,
            description: primaryAddress.description,
          }),
        );
        expect(cloneDeep(result.data!.patientAddresses)).toContainEqual(
          expect.objectContaining({
            id: address.id,
            zip: address.zip,
            description: address.description,
          }),
        );
        expect(log).toBeCalled();
      });
    });
  });
});
