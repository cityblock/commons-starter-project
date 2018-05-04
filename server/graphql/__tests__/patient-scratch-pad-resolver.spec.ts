import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientGlassBreak from '../../models/patient-glass-break';
import PatientScratchPad from '../../models/patient-scratch-pad';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin' as UserRole;
const body = 'Wants to be Queen of Seven Kingdoms';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 12, homeClinicId: clinic.id }, txn);

  return { user, patient };
}

describe('patient scratch pad resolver', () => {
  const permissions = 'green';
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

  describe('resolve patient scratch pad', () => {
    it('resolves scratch pad for given patient and user if one already exists', async () => {
      const { patient, user } = await setup(txn);

      const patientScratchPad = await PatientScratchPad.create(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );

      await PatientScratchPad.update(patientScratchPad.id, { body }, txn);

      const query = `{
          patientScratchPad(patientId: "${patient.id}") {
            id
            userId
            patientId
            body
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });

      expect(result.data!.patientScratchPad).toMatchObject({
        id: patientScratchPad.id,
        body,
        userId: user.id,
        patientId: patient.id,
      });
    });

    it('creates scratch pad for given patient and user if one does not exist', async () => {
      const { patient, user } = await setup(txn);

      const query = `{
          patientScratchPad(patientId: "${patient.id}") {
            id
            userId
            patientId
            body
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });

      expect(result.data!.patientScratchPad).toMatchObject({
        body: '',
        userId: user.id,
        patientId: patient.id,
      });
    });

    it('validates glass break id if one provided', async () => {
      const { patient, user } = await setup(txn);

      const patientScratchPad = await PatientScratchPad.create(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );

      await PatientScratchPad.update(patientScratchPad.id, { body }, txn);

      const glassBreak = await PatientGlassBreak.create(
        { userId: user.id, patientId: patient.id, reason: 'dunno', note: null },
        txn,
      );

      const query = `{
          patientScratchPad(patientId: "${patient.id}", glassBreakId: "${glassBreak.id}") {
            id
            userId
            patientId
            body
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions: 'blue',
        txn,
      });

      expect(result.data!.patientScratchPad).toMatchObject({
        id: patientScratchPad.id,
        body,
        userId: user.id,
        patientId: patient.id,
      });
    });

    it('invalides invalid glass break id', async () => {
      const { patient, user } = await setup(txn);

      const patientScratchPad = await PatientScratchPad.create(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );

      await PatientScratchPad.update(patientScratchPad.id, { body }, txn);

      const query = `{
          patientScratchPad(patientId: "${patient.id}", glassBreakId: "${uuid()}") {
            id
            userId
            patientId
            body
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions: 'blue',
        txn,
      });

      expect(result.errors![0].message).toBe(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    });
  });

  describe('edit patient scratch pad', () => {
    it('edits a patient scratch pad', async () => {
      const { patient, user } = await setup(txn);

      const patientScratchPad = await PatientScratchPad.create(
        {
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );

      const mutation = `mutation {
          patientScratchPadEdit(
            input: { patientScratchPadId: "${patientScratchPad.id}", body: "${body}"}
          ) {
            id
            patientId
            userId
            body
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(result.data!.patientScratchPadEdit).toMatchObject({
        id: patientScratchPad.id,
        body,
        userId: user.id,
        patientId: patient.id,
      });
    });
  });
});
