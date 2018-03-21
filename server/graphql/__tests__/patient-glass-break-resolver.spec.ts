import { subHours } from 'date-fns';
import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientGlassBreak from '../../models/patient-glass-break';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const permissions = 'green';
const reason = 'Needed to defeat Night King';
const note = 'Winter is Coming';

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

describe('Patient Glass Break Resolver', () => {
  let txn = null as any;
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates a patient glass break', async () => {
    const { user, patient } = await setup(txn);

    const mutation = `mutation {
        patientGlassBreakCreate(input: {
          patientId: "${patient.id}"
          reason: "${reason}"
          note: "${note}"
        }) {
          id
          patientId
          userId
          reason
          note
        }
      }`;

    const result = await graphql(schema, mutation, null, {
      db,
      permissions,
      userId: user.id,
      txn,
    });

    expect(result.data!.patientGlassBreakCreate.id).toBeTruthy();
    expect(result.data!.patientGlassBreakCreate.patientId).toBe(patient.id);
    expect(result.data!.patientGlassBreakCreate.userId).toBe(user.id);
    expect(result.data!.patientGlassBreakCreate.reason).toBe(reason);
    expect(result.data!.patientGlassBreakCreate.note).toBe(note);
  });

  it('fetches patient glass breaks for current user session', async () => {
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

    const query = `{
        patientGlassBreaksForUser {
          id
          patientId
          userId
        }
      }`;

    const result = await graphql(schema, query, null, {
      db,
      permissions,
      userId: user.id,
      txn,
    });

    expect(result.data!.patientGlassBreaksForUser.length).toBe(2);

    const glassBreak1 = result.data!.patientGlassBreaksForUser.find(
      (glassBreak: PatientGlassBreak) => glassBreak.id === patientGlassBreak.id,
    );
    const glassBreak2 = result.data!.patientGlassBreaksForUser.find(
      (glassBreak: PatientGlassBreak) => glassBreak.id === otherPatientGlassBreak.id,
    );

    expect(glassBreak1).toMatchObject({
      id: patientGlassBreak.id,
      patientId: patient.id,
      userId: user.id,
    });

    expect(glassBreak2).toMatchObject({
      id: otherPatientGlassBreak.id,
      patientId: patient2.id,
      userId: user.id,
    });
  });

  it('resolves glass break check for patient on care team', async () => {
    const { user, patient } = await setup(txn);

    const query = `{
        patientGlassBreakCheck(patientId: "${patient.id}") {
          patientId
          isGlassBreakNotNeeded
        }
      }`;

    const result = await graphql(schema, query, null, {
      db,
      permissions,
      userId: user.id,
      txn,
    });

    expect(result.data!.patientGlassBreakCheck).toMatchObject({
      patientId: patient.id,
      isGlassBreakNotNeeded: true,
    });
  });

  it('resolves glass break check for patient not on care team', async () => {
    const { user, clinic } = await setup(txn);
    const patient2 = await createPatient({ cityblockId: 13, homeClinicId: clinic.id }, txn);

    const query = `{
        patientGlassBreakCheck(patientId: "${patient2.id}") {
          patientId
          isGlassBreakNotNeeded
        }
      }`;

    const result = await graphql(schema, query, null, {
      db,
      permissions,
      userId: user.id,
      txn,
    });

    expect(result.data!.patientGlassBreakCheck).toMatchObject({
      patientId: patient2.id,
      isGlassBreakNotNeeded: false,
    });
  });
});
