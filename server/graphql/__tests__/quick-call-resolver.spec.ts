import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import QuickCall from '../../models/quick-call';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('quick call resolver', () => {
  const userRole = 'admin';
  let user: User;
  let patient: Patient;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches a quick call', async () => {
    await transaction(QuickCall.knex(), async txn => {
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
      const mutation = `mutation {
          quickCallCreate(input:
            {
              userId: "${user.id}",
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
