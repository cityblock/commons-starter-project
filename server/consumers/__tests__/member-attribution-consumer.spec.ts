// TODO: Write a full integration test once final core data/demo data is available
import * as kue from 'kue';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import { processNewMemberAttributionMessage } from '../member-attribution-consumer';

const queue = kue.createQueue();

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'physician'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return {
    clinic,
    user,
    patient,
  };
}

describe('processing memberAttribution jobs', () => {
  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();

    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...

    await Db.release();
  });

  it('throws an error if data is missing', async () => {
    await transaction(Patient.knex(), async txn => {
      const data = {
        patientId: uuid(),
        cityblockId: 123,
      };

      await expect(processNewMemberAttributionMessage(data as any, txn)).rejects.toMatch(
        'Missing either patientId, homeClinicId, cityblockId, firstName, lastName, dateOfBirth, or jobId',
      );
    });
  });

  describe('with a new patient', () => {
    it('creates a new patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const patientId = uuid();
        const data = {
          patientId,
          cityblockId: 123,
          firstName: 'Bob',
          lastName: 'Smith',
          dateOfBirth: '01/01/1990',
          gender: 'male',
          language: 'en',
          jobId: 'jobId',
          homeClinicId: clinic.id,
        };
        await processNewMemberAttributionMessage(data as any, txn);

        const fetchedPatient = await Patient.get(patientId, txn);
        expect(fetchedPatient.patientInfo.gender).toEqual('male');
        expect(fetchedPatient.cityblockId).toEqual(123);
      });
    });
  });

  describe('with an existing patient', () => {
    it('updates an existing patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, clinic } = await setup(txn);
        expect(patient.lastName).toEqual('plant');
        const data = {
          patientId: patient.id,
          cityblockId: patient.cityblockId,
          firstName: patient.firstName,
          lastName: 'New Last Name',
          dateOfBirth: '01/01/1990',
          jobId: 'jobId',
          homeClinicId: clinic.id,
        };
        await processNewMemberAttributionMessage(data as any, txn);

        const fetchedPatient = await Patient.get(patient.id, txn);
        expect(fetchedPatient.lastName).toEqual('New Last Name');
      });
    });
  });
});
