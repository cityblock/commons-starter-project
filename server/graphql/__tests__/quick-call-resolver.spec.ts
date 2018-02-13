import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import QuickCall from '../../models/quick-call';
import User from '../../models/user';
import { createMockClinic, createMockPatient, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
}

const userRole = 'admin';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);

  return {
    user,
    patient,
  };
}

describe('quick call resolver', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches a quick call', async () => {
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

      const query = `{
        quickCall(
          quickCallId: "${createdCall.id}"
        ) { id } }`;
      const result = await graphql(schema, query, null, { userRole, userId: user.id, txn });

      expect(cloneDeep(result.data!.quickCall)).toMatchObject({
        id: createdCall.id,
      });
    });
  });

  it('creates a quick call', async () => {
    await transaction(QuickCall.knex(), async txn => {
      const { user, patient } = await setup(txn);
      const mutation = `mutation {
          quickCallCreate(input:
            {
              patientId: "${patient.id}",
              reason: "Had to call the son",
              summary: "package is on the way",
              startTime: "${new Date().toISOString()}",
              direction: Outbound,
              callRecipient: "The son",
              wasSuccessful: true,
            }
          ) {
            id, progressNoteId
          }
        }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id, txn });
      expect(cloneDeep(result.data!.quickCallCreate.id)).not.toBeFalsy();
      expect(cloneDeep(result.data!.quickCallCreate.progressNoteId)).not.toBeFalsy();
    });
  });

  describe('quick calls', () => {
    it('returns quick calls for progress note', async () => {
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

        const query = `{
          quickCallsForProgressNote(
            progressNoteId: "${createdCall.progressNoteId}"
          ) { id } }`;
        const result = await graphql(schema, query, null, { userRole, userId: user.id, txn });
        expect(result.data!.quickCallsForProgressNote.length).toBe(2);
      });
    });
  });
});
