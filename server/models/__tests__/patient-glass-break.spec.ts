import { subHours } from 'date-fns';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as uuid from 'uuid/v4';

import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientGlassBreak from '../patient-glass-break';
import User from '../user';

const userRole = 'admin' as UserRole;
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
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PatientGlassBreak.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should create and get a patient glass break', async () => {
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

  it('throws an error if the patient glass break does not exist for given id', async () => {
    const fakeId = uuid();
    const error = `No such patient glass break: ${fakeId}`;
    await expect(PatientGlassBreak.get(fakeId, txn)).rejects.toMatch(error);
  });

  it('validates a recent glass break', async () => {
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

  it('invalidates a glass break with a fake id', async () => {
    const { user, patient } = await setup(txn);
    const fakeId = uuid();
    const error = 'You must break the glass again to view this patient. Please refresh the page.';
    await expect(
      PatientGlassBreak.validateGlassBreak(fakeId, user.id, patient.id, txn),
    ).rejects.toMatch(error);
  });

  it('invalidates a glass break that was created too long ago', async () => {
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

    const error = 'You must break the glass again to view this patient. Please refresh the page.';

    await expect(
      PatientGlassBreak.validateGlassBreak(patientGlassBreak.id, user.id, patient.id, txn),
    ).rejects.toMatch(error);
  });

  it('gets all patient glass breaks for the current user session', async () => {
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

  it('gets all patient glass breaks for the current user and patient combination', async () => {
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
    await PatientGlassBreak.create(
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

    const glassBreaks = await PatientGlassBreak.getForCurrentUserPatientSession(
      user.id,
      patient.id,
      txn,
    );

    expect(glassBreaks.length).toBe(1);

    expect(glassBreaks[0]).toMatchObject({
      ...patientGlassBreak,
    });
  });
});
