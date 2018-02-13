import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockPatient, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientDataFlag from '../patient-data-flag';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);

  return { user, patient };
}

describe('computed patient status model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a patient data flag', async () => {
    await transaction(PatientDataFlag.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const patientDataFlag = await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'firstName',
          suggestedValue: 'Bob',
        },
        txn,
      );
      const fetchedPatientDataFlag = await PatientDataFlag.get(patientDataFlag.id, txn);

      expect(fetchedPatientDataFlag).toMatchObject(patientDataFlag);
    });
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(PatientDataFlag.knex(), async txn => {
      const fakeId = uuid();
      await expect(PatientDataFlag.get(fakeId, txn)).rejects.toMatch(
        `No such patientDataFlag: ${fakeId}`,
      );
    });
  });

  it('gets all patient data flags for a patient', async () => {
    await transaction(PatientDataFlag.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const initialPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);

      expect(initialPatientDataFlags.length).toEqual(0);

      const patientDataFlag1 = await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'firstName',
          suggestedValue: 'Darth',
        },
        txn,
      );
      const patientDataFlag2 = await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'lastName',
          suggestedValue: 'Vader',
        },
        txn,
      );

      const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);
      const refetchedPatientDataFlagIds = refetchedPatientDataFlags.map(
        patientDataFlag => patientDataFlag.id,
      );

      expect(refetchedPatientDataFlags.length).toEqual(2);
      expect(refetchedPatientDataFlagIds).toContain(patientDataFlag1.id);
      expect(refetchedPatientDataFlagIds).toContain(patientDataFlag2.id);
    });
  });

  it('marks old duplicate patient data flags as deleted when creating a new one', async () => {
    await transaction(PatientDataFlag.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const patientDataFlag1 = await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'firstName',
          suggestedValue: 'Darth',
        },
        txn,
      );
      // Creating a second data flag for a different fieldName should not delete the first one
      await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'lastName',
          suggestedValue: 'Vader',
        },
        txn,
      );
      const fetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);

      expect(fetchedPatientDataFlags.length).toEqual(2);

      // Creating another data flag with the same fieldName should delete the original
      const patientDataFlag2 = await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'firstName',
          suggestedValue: 'Luke',
        },
        txn,
      );
      const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);
      const refetchedPatientDataFlagIds = refetchedPatientDataFlags.map(
        patientDataFlag => patientDataFlag.id,
      );

      expect(refetchedPatientDataFlags.length).toEqual(2);
      expect(refetchedPatientDataFlagIds).toContain(patientDataFlag2.id);
      expect(refetchedPatientDataFlagIds).not.toContain(patientDataFlag1.id);

      await expect(PatientDataFlag.get(patientDataFlag1.id, txn)).rejects.toMatch(
        `No such patientDataFlag: ${patientDataFlag1.id}`,
      );
    });
  });

  it('marks all patient data flags as deleted for a patient', async () => {
    await transaction(PatientDataFlag.knex(), async txn => {
      const { user, patient } = await setup(txn);
      await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'firstName',
          suggestedValue: 'Darth',
        },
        txn,
      );
      await PatientDataFlag.create(
        {
          patientId: patient.id,
          userId: user.id,
          fieldName: 'lastName',
          suggestedValue: 'Vader',
        },
        txn,
      );
      const patientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);

      expect(patientDataFlags.length).toEqual(2);

      await PatientDataFlag.deleteAllForPatient(patient.id, txn);
      const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patient.id, txn);

      expect(refetchedPatientDataFlags.length).toEqual(0);
    });
  });
});
