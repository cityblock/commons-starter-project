import { transaction, Transaction } from 'objection';
import { SmsMessageDirection, UserRole } from 'schema';
import uuid from 'uuid/v4';

import { createMockClinic, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import PhoneCall from '../phone-call';
import User from '../user';
import Voicemail from '../voicemail';

const timestamp = new Date().toISOString();
const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';
const twilioPayload = {
  status: 'completed',
  duration: '11',
  createdAt: '2018-01-01 00:00:00',
  updatedAt: '2018-01-01 00:10:00',
};

interface ISetup {
  phoneCall: PhoneCall;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('The Wall', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const phoneCall = await PhoneCall.create(
    {
      userId: user.id,
      contactNumber: '+11234567890',
      direction: 'toUser' as SmsMessageDirection,
      duration: 11,
      callStatus: 'no-answer',
      twilioPayload,
      callSid,
      twilioCreatedAt: timestamp,
      twilioUpdatedAt: timestamp,
    },
    txn,
  );

  return { phoneCall, user };
}

describe('Voicemail Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Voicemail.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('should create a voicemail associated with a phone call', async () => {
      const { phoneCall, user } = await setup(txn);
      const jobId = uuid();

      const voicemail = await Voicemail.create(
        {
          phoneCallSid: phoneCall.callSid,
          duration: 11,
          twilioPayload,
          twilioCreatedAt: '2017-09-07T13:45:14.532Z',
          twilioUpdatedAt: '2017-09-07T13:48:00.000Z',
          jobId,
        },
        txn,
      );

      expect(voicemail).toMatchObject({
        phoneCallId: phoneCall.id,
        duration: 11,
        twilioPayload,
        twilioCreatedAt: new Date('2017-09-07T13:45:14.532Z'),
        twilioUpdatedAt: new Date('2017-09-07T13:48:00.000Z'),
        deletedAt: null,
        jobId,
        phoneCall: {
          id: phoneCall.id,
          userId: user.id,
          user,
          patient: null,
        },
      });
    });

    it('errors if trying to create a voicemail with no associated phone call', async () => {
      const fakeSid = 'CAfbe57a569adc67124a71a10f9NOTREAL';
      const jobId = uuid();

      await expect(
        Voicemail.create(
          {
            phoneCallSid: fakeSid,
            duration: 11,
            twilioPayload,
            twilioCreatedAt: '2017-09-07T13:45:14.532Z',
            twilioUpdatedAt: '2017-09-07T13:48:00.000Z',
            jobId,
          },
          txn,
        ),
      ).rejects.toMatch(`No such phone call with sid: ${fakeSid}`);
    });
  });
});
