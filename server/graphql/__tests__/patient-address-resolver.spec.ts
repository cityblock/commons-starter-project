import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';

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

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - patient address',
      departmentId: 1,
    },
    trx,
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
    trx,
  );
  const patient = await createPatient({ cityblockId: 1, homeClinicId }, trx);
  const address = await Address.create(createMockAddress(user.id), trx);
  const primaryAddress = await Address.create({ zip: '11111', updatedById: user.id }, trx);
  await PatientAddress.create({ addressId: address.id, patientId: patient.id }, trx);
  await PatientAddress.create({ addressId: primaryAddress.id, patientId: patient.id }, trx);
  await PatientInfo.edit(
    { primaryAddressId: primaryAddress.id, updatedById: user.id },
    patient.patientInfo.id,
    trx,
  );

  return { patient, user, address, primaryAddress };
}

describe('address resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get all patient addresses', async () => {
    it('should get all patient addresses', async () => {
      const { primaryAddress, address, patient, user } = await setup(txn);
      const query = `{
          patientAddresses(patientId: "${patient.id}") {
            id, zip, description
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        logger,
        testTransaction: txn,
      });

      expect(cloneDeep(result.data!.patientAddresses)).toHaveLength(3); // 1 address from Patient#create
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
