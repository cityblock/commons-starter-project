import { graphql, print } from 'graphql';
import kue from 'kue';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { Gender, MaritalStatus, Transgender, UserRole } from 'schema';
import getPatientNeedToKnow from '../../../app/graphql/queries/get-patient-need-to-know.graphql';
import patientInfoEdit from '../../../app/graphql/queries/patient-info-edit-mutation.graphql';
import patientNeedToKnowEdit from '../../../app/graphql/queries/patient-need-to-know-edit-mutation.graphql';
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
  address: Address;
  user: User;
  homeClinicId: string;
}

const queue = kue.createQueue();

const userRole = 'physician' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const homeClinic = await HomeClinic.create(
    {
      name: 'cool clinic - patient info',
      departmentId: 2,
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

  const getPatientNeedToKnowQuery = print(getPatientNeedToKnow);
  const patientNeedToKnowEditMutation = print(patientNeedToKnowEdit);
  const patientInfoEditMutation = print(patientInfoEdit);

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

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  describe('patient info edit', () => {
    it('edits patient info', async () => {
      const { patient, address, user } = await setup(txn);

      const options = {
        patientInfoId: patient.patientInfo.id,
        transgender: 'yes' as Transgender,
        maritalStatus: 'widowed' as MaritalStatus,
        language: 'ch',
        isWhite: true,
        isBlack: false,
        isAmericanIndianAlaskan: false,
        isAsian: true,
        isHawaiianPacific: false,
        isOtherRace: true,
        isHispanic: true,
        raceFreeText: 'self identified race',
      };
      const result = await graphql(
        schema,
        patientInfoEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        options,
      );

      delete options.patientInfoId;
      expect(cloneDeep(result.data!.patientInfoEdit)).toMatchObject(options);
      expect(log).toBeCalled();

      const result2 = await graphql(
        schema,
        patientInfoEditMutation,
        null,
        {
          userId: user.id,
          permissions: 'red',
          logger,
          testTransaction: txn,
        },
        {
          patientInfoId: patient.patientInfo.id,
          gender: 'male' as Gender,
          language: 'ch',
          primaryAddressId: address.id,
        },
      );
      expect(result2.errors![0].message).toBe('red not able to edit patient');

      expect(queue.testMode.jobs.length).toBe(0);
    });

    it('edits patient nested contact info', async () => {
      const { patient, address, user } = await setup(txn);
      await PatientAddress.create({ patientId: patient.id, addressId: address.id }, txn);

      const result = await graphql(
        schema,
        patientInfoEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientInfoId: patient.patientInfo.id,
          primaryAddressId: address.id,
        },
      );
      expect(cloneDeep(result.data!.patientInfoEdit)).toMatchObject({
        id: patient.patientInfo.id,
        primaryAddress: {
          id: address.id,
          zip: '11201',
        },
      });
      expect(log).toBeCalled();
    });

    it('edits patient preferred name', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        patientInfoEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientInfoId: patient.patientInfo.id,
          preferredName: 'Queen',
        },
      );

      expect(cloneDeep(result.data!.patientInfoEdit)).toMatchObject({
        id: patient.patientInfo.id,
        preferredName: 'Queen',
      });
      expect(log).toBeCalled();

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        patientId: patient.id,
        prevPreferredName: null,
        type: 'editPreferredName',
      });
    });
  });

  describe('need to know', () => {
    it('resolves a patient needToKnow', async () => {
      const { patient, user } = await setup(txn);
      await PatientInfo.edit(
        { needToKnow: 'Test Scratch Pad', updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );

      const result = await graphql(
        schema,
        getPatientNeedToKnowQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { patientInfoId: patient.patientInfo.id },
      );

      expect(cloneDeep(result.data!.patientNeedToKnow)).toMatchObject({
        text: 'Test Scratch Pad',
      });
    });

    it('saves a patient needToKnow', async () => {
      const { patient, user } = await setup(txn);
      await PatientInfo.edit(
        { needToKnow: 'Unedited Scratch Pad', updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );
      const result = await graphql(
        schema,
        patientNeedToKnowEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        { patientInfoId: patient.patientInfo.id, text: 'Edited Scratch Pad' },
      );
      expect(cloneDeep(result.data!.patientNeedToKnowEdit)).toMatchObject({
        text: 'Edited Scratch Pad',
      });
    });
  });
});
