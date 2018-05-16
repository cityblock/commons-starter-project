import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as addressCreateForPatient from '../../../app/graphql/queries/address-create-for-patient-mutation.graphql';
import * as addressCreate from '../../../app/graphql/queries/address-create-mutation.graphql';
import * as addressDeleteForPatient from '../../../app/graphql/queries/address-delete-for-patient-mutation.graphql';
import * as addressEditForPatient from '../../../app/graphql/queries/address-edit-mutation.graphql';

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

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - address',
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
  return { patient, user };
}

describe('address resolver', () => {
  let txn = null as any;
  const log = jest.fn();
  const logger = { log };
  const addressCreateMutation = print(addressCreate);
  const addressCreateForPatientMutation = print(addressCreateForPatient);
  const addressDeleteForPatientMutation = print(addressDeleteForPatient);
  const addressEditForPatientMutation = print(addressEditForPatient);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create address', async () => {
    it('should create address', async () => {
      const { user } = await setup(txn);

      const result = await graphql(
        schema,
        addressCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          street1: '600 Vanderbilt Ave',
          description: 'Some building',
        },
      );

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

  describe('create address for patient', async () => {
    it('should create address with patient and associate it with patient', async () => {
      const { patient, user } = await setup(txn);
      const result = await graphql(
        schema,
        addressCreateForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientId: patient.id,
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          street1: '600 Vanderbilt Ave',
          description: 'Some building',
        },
      );
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
      expect(patientAddress.length).toBe(2); // 1 address already from Patient#create
    });

    it('should create address with patient and make it primary for patient', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        addressCreateForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientId: patient.id,
          zip: '11238',
          state: 'NY',
          city: 'Brooklyn',
          street1: '600 Vanderbilt Ave',
          description: 'Some building',
          isPrimary: true,
        },
      );
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
      expect(patientAddress.length).toBe(2); // 1 address from Patient#create

      const editedInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(editedInfo.primaryAddressId).toBe(result.data!.addressCreateForPatient.id);
    });
  });

  describe('delete address', async () => {
    it('should delete address', async () => {
      const { patient, user } = await setup(txn);
      const createResult = await graphql(
        schema,
        addressCreateForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientId: patient.id,
          zip: '11238',
          description: 'Some address',
        },
      );
      const address = createResult.data!.addressCreateForPatient;

      const result = await graphql(
        schema,
        addressDeleteForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          addressId: address.id,
          patientId: patient.id,
        },
      );

      expect(cloneDeep(result.data!.addressDeleteForPatient)).toMatchObject({
        id: address.id,
        zip: address.zip,
        description: address.description,
      });
      expect(log).toBeCalled();
    });

    it('should delete primary address', async () => {
      const { patient, user } = await setup(txn);
      const createResult = await graphql(
        schema,
        addressCreateForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          patientId: patient.id,
          zip: '11238',
          description: 'Some address',
          isPrimary: true,
        },
      );
      const address = createResult.data!.addressCreateForPatient;

      const initialPatientInfo = await PatientInfo.get(patient.patientInfo.id, txn);
      expect(initialPatientInfo.primaryAddressId).toBe(address.id);

      const result = await graphql(
        schema,
        addressDeleteForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          addressId: address.id,
          patientId: patient.id,
          isPrimary: true,
        },
      );

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

  describe('edit address', async () => {
    it('should edit fields on address', async () => {
      const { patient, user } = await setup(txn);
      const address = await Address.create(createMockAddress(user.id), txn);

      const result = await graphql(
        schema,
        addressEditForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          txn,
        },
        {
          addressId: address.id,
          patientId: patient.id,
          zip: '11238',
          state: 'CT',
          city: 'Haverford',
          street1: '600 Vanderbilt Ave',
          description: 'Some building',
        },
      );
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
