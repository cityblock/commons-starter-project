import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';

import {
  createMockAddress,
  createMockClinic,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientAddress from '../patient-address';
import User from '../user';

const userRole = 'Pharmacist' as UserRole;

interface ISetup {
  patient: Patient;
  user: User;
  address: Address;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const address = await Address.create(createMockAddress(user.id), txn);

  return { patient, address, user, clinic };
}

describe('patient address model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientAddress.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', async () => {
    it('should create patient to address join', async () => {
      const { patient, address } = await setup(txn);
      const patientAddress = await PatientAddress.create(
        {
          patientId: patient.id,
          addressId: address.id,
        },
        txn,
      );

      expect(patientAddress.length).toBe(2); // One from Patient#create
      expect(patientAddress[1]).toMatchObject({
        street1: '55 Washington St',
        zip: '11201',
        state: 'NY',
        city: 'Brooklyn',
        description: 'Office',
      });
    });
  });

  describe('delete', async () => {
    it('should mark patient address relationship as deleted', async () => {
      const { patient, address } = await setup(txn);
      const patientAddress = await PatientAddress.create(
        {
          patientId: patient.id,
          addressId: address.id,
        },
        txn,
      );

      expect(patientAddress.length).toBe(2); // One from Patient#create
      expect(patientAddress[1]).toMatchObject({
        street1: '55 Washington St',
        zip: '11201',
        state: 'NY',
        city: 'Brooklyn',
        description: 'Office',
      });

      const remainingAddresses = await PatientAddress.delete(
        {
          patientId: patient.id,
          addressId: address.id,
        },
        txn,
      );
      expect(remainingAddresses.length).toBe(1); // One from Patient#create
    });
  });

  describe('get for patient', async () => {
    it('should get all non deleted addresses for a patient', async () => {
      const { patient, address, user, clinic } = await setup(txn);
      await PatientAddress.create({ patientId: patient.id, addressId: address.id }, txn);

      // second address for the same patient
      const address2 = await Address.create(
        { zip: '11201', street1: '50 Main St', updatedById: user.id },
        txn,
      );
      await PatientAddress.create({ patientId: patient.id, addressId: address2.id }, txn);

      // third address for the same patient that gets deleted
      const address3 = await Address.create(
        { zip: '11301', street1: '52 Main St', updatedById: user.id },
        txn,
      );
      await PatientAddress.create({ patientId: patient.id, addressId: address3.id }, txn);
      await PatientAddress.delete({ patientId: patient.id, addressId: address3.id }, txn);

      // address for another patient
      const patient2 = await createPatient({ cityblockId: 124, homeClinicId: clinic.id }, txn);
      const address4 = await Address.create(
        { zip: '11401', street1: '54 Main St', updatedById: user.id },
        txn,
      );
      await PatientAddress.create({ patientId: patient2.id, addressId: address4.id }, txn);

      const addresses = await PatientAddress.getAll(patient.id, txn);
      expect(addresses.length).toBe(3); // One from Patient#create
      expect(addresses[1]).toMatchObject({
        street1: '55 Washington St',
        zip: '11201',
        state: 'NY',
        city: 'Brooklyn',
        description: 'Office',
      });
      expect(addresses[2]).toMatchObject({ zip: '11201', street1: '50 Main St' });
    });
  });
});
