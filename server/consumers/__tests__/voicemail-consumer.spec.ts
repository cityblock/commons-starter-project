import axios from 'axios';
import { format } from 'date-fns';
import { transaction, Transaction } from 'objection';
import { SmsMessageDirection, UserRole } from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import * as gcsHelpersRaw from '../../graphql/shared/gcs/helpers';
import Clinic from '../../models/clinic';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import PhoneCall from '../../models/phone-call';
import User from '../../models/user';
import Voicemail from '../../models/voicemail';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import {
  createVoicemail,
  deleteVoicemail,
  notifyUserOfVoicemail,
  uploadVoicemail,
  CITYBLOCK_VOICEMAIL,
  VOICEMAIL_DATE_FORMAT,
} from '../voicemail-consumer';

// allows mocking without type errors below
/* tslint:disable:prefer-const */
let gcsHelpers = gcsHelpersRaw as any;
/* tslint:enable:prefer-const */

const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';
const twilioPayload = {
  status: 'completed',
  duration: '11',
  createdAt: '2018-01-01 00:00:00',
  updatedAt: '2018-01-01 00:10:00',
};
const uploadUrl = 'www.gcs/winter/is/here';
const twilioUrl = 'www.twilio.com/winter/is/coming';
const audioFile = {
  data: 'dragonScreetch',
};

interface ISetup {
  phoneCall: PhoneCall;
  user: User;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('The Wall', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

  const phoneCall = await PhoneCall.create(
    {
      userId: user.id,
      contactNumber: '+11234561111',
      direction: 'toUser' as SmsMessageDirection,
      duration: 11,
      callStatus: 'no-answer',
      twilioPayload,
      callSid,
    },
    txn,
  );

  return { phoneCall, user, phone };
}

describe('Voicemail Consumer', () => {
  let txn = null as any;
  let createMessage = null as any;
  let removeRecording = null as any;
  let exit = null as any;
  const jobId = uuid();

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Voicemail.knex());

    gcsHelpers.loadUserVoicemailUrl = jest.fn().mockReturnValue(uploadUrl);
    axios.get = jest.fn().mockReturnValue(audioFile);
    axios.put = jest.fn();
    createMessage = jest.fn();
    removeRecording = jest.fn();
    exit = jest.spyOn(process, 'exit');

    TwilioClient.get = jest.fn().mockReturnValue({
      messages: {
        create: createMessage,
      },
      recordings: (sid: string) => ({
        remove: removeRecording,
      }),
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('createVoicemail', () => {
    it('creates new voicemail', async () => {
      const { phoneCall, user } = await setup(txn);

      const recording = {
        callSid: phoneCall.callSid,
        duration: '11',
        dateCreated: new Date('2018-04-26T18:21:00.235Z'),
        dateUpdated: new Date('2018-04-26T18:27:00.235Z'),
      };

      const voicemail = await createVoicemail(recording as any, jobId, txn);

      expect(voicemail.phoneCallId).toBe(phoneCall.id);
      expect(voicemail.phoneCall.userId).toEqual(user.id);
      expect(voicemail.twilioCreatedAt).toEqual(new Date('2018-04-26T18:21:00.235Z'));
      expect(voicemail.twilioUpdatedAt).toEqual(new Date('2018-04-26T18:27:00.235Z'));
      expect(voicemail.jobId).toBe(jobId);
      expect(exit).not.toHaveBeenCalled();
    });

    it('throws an error if cannot create voicemail', async () => {
      const recording = {
        callSid: 'FAKESID',
        duration: '11',
        dateCreated: new Date('2018-04-26T18:21:00.235Z'),
        dateUpdated: new Date('2018-04-26T18:27:00.235Z'),
      };

      try {
        await createVoicemail(recording as any, jobId, txn);
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toBe('No such phone call with sid: FAKESID');
        expect(exit).not.toHaveBeenCalled();
      }
    });
  });

  describe('uploadVoicemail', () => {
    const userId = 'sansaStark';
    const voicemailId = 'ladyOfWinterfell';

    it('downloads file from Twilio and uploads it to GCS', async () => {
      await uploadVoicemail(twilioUrl, userId, voicemailId);

      expect(gcsHelpers.loadUserVoicemailUrl).toBeCalledWith(userId, voicemailId, 'write');
      expect(axios.get).toBeCalledWith(twilioUrl, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
      expect(axios.put).toBeCalledWith(uploadUrl, audioFile.data, {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
      expect(exit).not.toHaveBeenCalled();
    });

    it('throws an error if no signed url', async () => {
      gcsHelpers.loadUserVoicemailUrl = jest.fn().mockReturnValue(null);
      axios.get = jest.fn().mockReturnValue(audioFile);

      try {
        await uploadVoicemail(twilioUrl, userId, voicemailId);
        // ensures we aren't not capturing error
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toEqual(new Error('No signed url or audio file'));
      }
    });

    it('throws an error if no audio file', async () => {
      gcsHelpers.loadUserVoicemailUrl = jest.fn().mockReturnValue(uploadUrl);
      axios.get = jest.fn().mockReturnValue(null);

      try {
        await uploadVoicemail(twilioUrl, userId, voicemailId);
        // ensures we aren't not capturing error
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toEqual(new Error('No signed url or audio file'));
        expect(exit).not.toHaveBeenCalled();
      }
    });
  });

  describe('notifyUserOfVoicemail', () => {
    it('sends SMS notifying user of voicemail with no associated patient', async () => {
      const { phoneCall, user } = await setup(txn);
      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );

      const recording = {
        callSid: phoneCall.callSid,
        duration: '11',
        dateCreated: new Date('2018-04-26T18:21:00.235Z'),
        dateUpdated: new Date('2018-04-26T18:27:00.235Z'),
      };

      const voicemail = await createVoicemail(recording as any, jobId, txn);

      await notifyUserOfVoicemail(voicemail);

      const args = createMessage.mock.calls;

      expect(createMessage).toHaveBeenCalledTimes(2);
      expect(args[0][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: `+11234561111 left you a voicemail at ${format(
          voicemail.twilioCreatedAt,
          VOICEMAIL_DATE_FORMAT,
        )}. Click the following link to listen to the message.`,
      });
      expect(args[1][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: `http://localhost:3000/voicemails/${voicemail.id}`,
      });
      expect(exit).not.toHaveBeenCalled();
    });

    it('sends SMS notifying user of voicemail with associated patient', async () => {
      const { phone, user } = await setup(txn);
      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      await PhoneCall.create(
        {
          direction: 'toUser' as SmsMessageDirection,
          userId: user.id,
          contactNumber: phone.phoneNumber,
          twilioPayload: {},
          callSid: 'CAfbe57a569adc67124a71a1BOGUSBOGUS',
          callStatus: 'no-answer',
          duration: 0,
        },
        txn,
      );

      const recording = {
        callSid: 'CAfbe57a569adc67124a71a1BOGUSBOGUS',
        duration: '11',
        dateCreated: new Date('2018-04-26T18:21:00.235Z'),
        dateUpdated: new Date('2018-04-26T18:27:00.235Z'),
      };

      const voicemail = await createVoicemail(recording as any, jobId, txn);

      await notifyUserOfVoicemail(voicemail);

      const args = createMessage.mock.calls;

      expect(createMessage).toHaveBeenCalledTimes(2);
      expect(args[0][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: `Dan P. at +11234567890 left you a voicemail at ${format(
          voicemail.twilioCreatedAt,
          VOICEMAIL_DATE_FORMAT,
        )}. Click the following link to listen to the message.`,
      });
      expect(args[1][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: `http://localhost:3000/voicemails/${voicemail.id}`,
      });
      expect(exit).not.toHaveBeenCalled();
    });
  });

  describe('deleteVoicemail', () => {
    it('deletes a voicemail from Twilio', async () => {
      const sid = 'FAKE_SID';

      await deleteVoicemail(sid);

      expect(removeRecording).toBeCalled();
      expect(exit).not.toHaveBeenCalled();
    });
  });
});
