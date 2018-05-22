import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { QuickCallDirection, UserRole } from 'schema';

import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import QuickCall from '../../models/quick-call';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return {
    user,
    patient,
  };
}

describe('quick call resolver', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('fetches a quick call', async () => {
    const { user, patient } = await setup(txn);
    const createdCall = await QuickCall.create(
      {
        userId: user.id,
        patientId: patient.id,
        reason: 'Had to call the son',
        summary: 'package is on the way',
        startTime: new Date().toISOString(),
        direction: 'Outbound' as QuickCallDirection,
        callRecipient: 'The son',
        wasSuccessful: true,
      },
      txn,
    );

    const query = `{
        quickCall(
          quickCallId: "${createdCall.id}"
        ) { id } }`;
    const result = await graphql(schema, query, null, {
      permissions,
      userId: user.id,
      testTransaction: txn,
    });

    expect(cloneDeep(result.data!.quickCall)).toMatchObject({
      id: createdCall.id,
    });
  });

  it('creates a quick call', async () => {
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
    const result = await graphql(schema, mutation, null, {
      permissions,
      userId: user.id,
      testTransaction: txn,
    });
    expect(cloneDeep(result.data!.quickCallCreate.id)).not.toBeFalsy();
    expect(cloneDeep(result.data!.quickCallCreate.progressNoteId)).not.toBeFalsy();
  });

  describe('quick calls', () => {
    it('returns quick calls for progress note', async () => {
      const { user, patient } = await setup(txn);
      const createdCall = await QuickCall.create(
        {
          userId: user.id,
          patientId: patient.id,
          reason: 'Had to call the son',
          summary: 'package is on the way',
          startTime: new Date().toISOString(),
          direction: 'Outbound' as QuickCallDirection,
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
          direction: 'Outbound' as QuickCallDirection,
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
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(result.data!.quickCallsForProgressNote.length).toBe(2);
    });
  });
});
