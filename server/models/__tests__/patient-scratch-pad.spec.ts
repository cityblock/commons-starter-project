import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientScratchPad from '../patient-scratch-pad';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(
    { cityblockId: 12, homeClinicId: clinic.id, userId: user.id },
    txn,
  );

  return { user, patient };
}

describe('patient scratch pad model', () => {
  let txn = null as any;

  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a patient scratch pad', async () => {
    const { user, patient } = await setup(txn);

    const patientScratchPad = await PatientScratchPad.create(
      {
        userId: user.id,
        patientId: patient.id,
      },
      txn,
    );

    expect(patientScratchPad).toMatchObject({
      userId: user.id,
      patientId: patient.id,
      body: '',
    });
  });

  it('should error if trying to create a patient scratch pad for same user/patient combination', async () => {
    const { user, patient } = await setup(txn);

    await PatientScratchPad.create(
      {
        userId: user.id,
        patientId: patient.id,
      },
      txn,
    );

    try {
      await PatientScratchPad.create(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );
    } catch (err) {
      expect(err.constraint).toEqual('patient_scratch_pad_userid_patientid_unique');
    }
  });

  it('should find a patient scratch pad for given user and patient', async () => {
    const { user, patient } = await setup(txn);

    const patientScratchPad = await PatientScratchPad.create(
      {
        userId: user.id,
        patientId: patient.id,
      },
      txn,
    );

    const fetchedScratchPad = await PatientScratchPad.getForPatientAndUser(
      {
        userId: user.id,
        patientId: patient.id,
      },
      txn,
    );

    expect(fetchedScratchPad).toMatchObject({
      id: patientScratchPad.id,
      userId: user.id,
      patientId: patient.id,
      body: '',
    });
  });

  it('should return null if scratch pad does not exist for given user and patient', async () => {
    const fetchedScratchPad = await PatientScratchPad.getForPatientAndUser(
      {
        userId: uuid(),
        patientId: uuid(),
      },
      txn,
    );

    expect(fetchedScratchPad).toBeNull();
  });

  it('should edit body of patient scratch pad', async () => {
    const { user, patient } = await setup(txn);

    const patientScratchPad = await PatientScratchPad.create(
      {
        userId: user.id,
        patientId: patient.id,
      },
      txn,
    );

    const body = 'Seems worried about Night King';

    const updatedScratchPad = await PatientScratchPad.update(patientScratchPad.id, { body }, txn);

    expect(updatedScratchPad).toMatchObject({
      id: patientScratchPad.id,
      userId: user.id,
      patientId: patient.id,
      body,
    });
  });

  it('should get patient id for resource', async () => {
    const { user, patient } = await setup(txn);

    const patientScratchPad = await PatientScratchPad.create(
      {
        userId: user.id,
        patientId: patient.id,
      },
      txn,
    );

    const fetchedPatientId = await PatientScratchPad.getPatientIdForResource(
      patientScratchPad.id,
      txn,
    );

    expect(fetchedPatientId).toBe(patient.id);
  });
});
