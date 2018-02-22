import { subHours } from 'date-fns';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientGlassBreak from '../patient-glass-break';
import User from '../user';

const userRole = 'admin';
const reason = 'Other';
const note = 'New phone who dis';

interface ISetup {
  user: User;
  patient: Patient;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(
    { cityblockId: 12, homeClinicId: clinic.id, userId: user.id },
    txn,
  );

  return { user, patient, clinic };
}

describe('Patient Glass Break Model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a patient glass break', async () => {
    await transaction(PatientGlassBreak.knex(), async txn => {
      const { user, patient } = await setup(txn);

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason,
          note,
        },
        txn,
      );

      expect(patientGlassBreak).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        reason,
        note,
      });

      expect(await PatientGlassBreak.get(patientGlassBreak.id, txn)).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        reason,
        note,
      });
    });
  });

  it('throws an error if the patient glass break does not exist for given id', async () => {
    await transaction(PatientGlassBreak.knex(), async txn => {
      const fakeId = uuid();
      const error = `No such patient glass break: ${fakeId}`;
      await expect(PatientGlassBreak.get(fakeId, txn)).rejects.toMatch(error);
    });
  });

  it('validates a recent glass break', async () => {
    await transaction(PatientGlassBreak.knex(), async txn => {
      const { user, patient } = await setup(txn);

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason,
          note,
        },
        txn,
      );

      expect(
        await PatientGlassBreak.validateGlassBreak(patientGlassBreak.id, user.id, patient.id, txn),
      ).toBe(true);
    });
  });

  it('invalidates a glass break with a fake id', async () => {
    await transaction(PatientGlassBreak.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const fakeId = uuid();
      const error = `No such glass break: ${fakeId}`;
      await expect(
        PatientGlassBreak.validateGlassBreak(fakeId, user.id, patient.id, txn),
      ).rejects.toMatch(error);
    });
  });

  it('invalidates a glass break that was created too long ago', async () => {
    await transaction(PatientGlassBreak.knex(), async txn => {
      const { user, patient } = await setup(txn);

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason,
          note,
        },
        txn,
      );

      await PatientGlassBreak.query(txn)
        .where({ userId: user.id, patientId: patient.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const error = `Glass break ${patientGlassBreak.id} occurred too long ago`;

      await expect(
        PatientGlassBreak.validateGlassBreak(patientGlassBreak.id, user.id, patient.id, txn),
      ).rejects.toMatch(error);
    });
  });

  it('gets all patient glass breaks for the current user session', async () => {
    await transaction(PatientGlassBreak.knex(), async txn => {
      const { user, patient, clinic } = await setup(txn);
      const patient2 = await createPatient({ cityblockId: 13, homeClinicId: clinic.id }, txn);

      const patientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason,
          note,
        },
        txn,
      );
      const tooOldGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason,
          note,
        },
        txn,
      );
      const otherPatientGlassBreak = await PatientGlassBreak.create(
        {
          userId: user.id,
          patientId: patient2.id,
          reason,
          note,
        },
        txn,
      );

      await PatientGlassBreak.query(txn)
        .where({ id: tooOldGlassBreak.id })
        .patch({ createdAt: subHours(new Date(), 9).toISOString() });

      const glassBreaks = await PatientGlassBreak.getForCurrentUserSession(user.id, txn);

      expect(glassBreaks.length).toBe(2);

      expect(glassBreaks.find(glassBreak => glassBreak.id === patientGlassBreak.id)).toMatchObject({
        ...patientGlassBreak,
      });
      expect(
        glassBreaks.find(glassBreak => glassBreak.id === otherPatientGlassBreak.id),
      ).toMatchObject({
        ...otherPatientGlassBreak,
      });
    });
  });
});
