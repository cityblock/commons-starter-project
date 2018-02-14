import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import QuickCall from '../quick-call';
import User from '../user';
const userRole = 'physician';

interface ISetup {
  user: User;
  patient: Patient;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  return { clinic, user, patient };
}

describe('quick call model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and retreives quick call', async () => {
    await transaction(QuickCall.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const createdCall = await QuickCall.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Had to call the son',
          summary: 'package is on the way',
          startTime: new Date().toISOString(),
          direction: 'Outbound',
          callRecipient: 'The son',
          wasSuccessful: true,
        },
        txn,
      );
      const foundCall = await QuickCall.get(createdCall.id, txn);

      expect(foundCall).not.toBeFalsy();
      expect(foundCall.id).not.toBeFalsy();
      expect(foundCall.createdAt).not.toBeFalsy();
    });
  });

  it('returns error message for nonexistent user', async () => {
    await transaction(QuickCall.knex(), async txn => {
      const fakeId = uuid();
      const error = `No such quick call: ${fakeId}`;
      await expect(QuickCall.get(fakeId, txn)).rejects.toMatch(error);
    });
  });

  it('retreives quick calls via progressNoteId', async () => {
    await transaction(QuickCall.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const createdCall = await QuickCall.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Had to call the son',
          summary: 'package is on the way',
          startTime: new Date().toISOString(),
          direction: 'Outbound',
          callRecipient: 'The son',
          wasSuccessful: true,
        },
        txn,
      );

      const createdCall2 = await QuickCall.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Had to call the son',
          summary: 'package is on the way',
          startTime: new Date().toISOString(),
          direction: 'Outbound',
          callRecipient: 'The son',
          wasSuccessful: true,
        },
        txn,
      );

      expect(createdCall.progressNoteId).toEqual(createdCall2.progressNoteId);

      const quickCalls = await QuickCall.getQuickCallsForProgressNote(
        createdCall.progressNoteId,
        txn,
      );

      expect(quickCalls.length).toBe(2);
      const foundIds = quickCalls.map(call => call.id);
      for (const call of [createdCall, createdCall2]) {
        expect(foundIds).toContain(call.id);
      }
    });
  });

  it('retreives associated patient id for a quick call', async () => {
    await transaction(QuickCall.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const createdCall = await QuickCall.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Had to call the son',
          summary: 'package is on the way',
          startTime: new Date().toISOString(),
          direction: 'Outbound',
          callRecipient: 'The son',
          wasSuccessful: true,
        },
        txn,
      );

      const fetchedPatientId = await QuickCall.getPatientIdForResource(createdCall.id, txn);

      expect(fetchedPatientId).toBe(patient.id);
    });
  });
});
