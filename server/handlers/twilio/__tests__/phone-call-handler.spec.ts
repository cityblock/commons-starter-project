import { format } from 'date-fns';
import * as httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import Db from '../../../db';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import PatientPhone from '../../../models/patient-phone';
import Phone from '../../../models/phone';
import PhoneCall from '../../../models/phone-call';
import User from '../../../models/user';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../../spec-helpers';
import TwilioClient from '../../../twilio-client';
import {
  notifyUserOfVoicemail,
  twilioCompleteCallHandler,
  twilioIncomingCallHandler,
  twilioOutgoingCallHandler,
  twilioVoicemailHandler,
  CITYBLOCK_VOICEMAIL,
  VOICEMAIL_DATE_FORMAT,
} from '../phone-call-handler';

const expectedIncomingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call" method="POST" timeout="20"><Sim>DEBOGUS14990BOGUS580c2a54713dBOGUS</Sim></Dial></Response>';
const expectedOutgoingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call?outbound=true" method="POST" callerId="+11234567777"><Number>+11234567890</Number></Dial></Response>';
const expectedCompleteTwiml = '<?xml version="1.0" encoding="UTF-8"?><Response/>';
const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';
const voicemailUrl = 'https://winter.is.here';

const userRole = 'admin';

interface ISetup {
  patient: Patient;
  user: User;
  phone: Phone;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

  return { patient, phone, user, clinic };
}

describe('Phone Call Handler', () => {
  let txn = null as any;
  let createMessage = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PhoneCall.knex());
    createMessage = jest.fn();

    TwilioClient.get = jest.fn().mockReturnValue({
      messages: {
        create: createMessage,
      },
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('twilioIncomingCallHandler', () => {
    it('handles an incoming phone call', async () => {
      const { user } = await setup(txn);
      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      const req = httpMocks.createRequest({
        body: {
          To: '+11234567777',
          From: '+11234567890',
          Direction: 'inbound',
        },
      });

      await twilioIncomingCallHandler(req, res);

      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith(expectedIncomingTwiml);
    });
  });

  describe('twilioOutgoingCallHandler', () => {
    it('handles an outgoing phone call', async () => {
      const { user } = await setup(txn);
      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      const req = httpMocks.createRequest({
        body: {
          To: '+11234567890',
          From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        },
      });

      await twilioOutgoingCallHandler(req, res);

      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith(expectedOutgoingTwiml);
    });
  });

  describe('twilioCompleteCallHandler', () => {
    it('handles a complete inbound phone call', async () => {
      const { user, patient, phone } = await setup(txn);
      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      const req = httpMocks.createRequest({
        body: {
          To: '+11234567777',
          From: '+11234567890',
          DialCallStatus: 'completed',
          DialCallDuration: '11',
          Direction: 'inbound',
          CallSid: callSid,
        },
      });

      await twilioCompleteCallHandler(req, res);

      const phoneCalls = await PhoneCall.getForUserPatient(
        { userId: user.id, patientId: patient.id },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(phoneCalls.total).toBe(1);
      expect(phoneCalls.results[0]).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        contactNumber: phone.phoneNumber,
        direction: 'toUser',
        duration: 11,
        callStatus: 'completed',
        twilioPayload: req.body,
        callSid,
        voicemailUrl: null,
        voicemailPayload: null,
      });

      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);
    });

    it('handles a complete outbound phone call', async () => {
      const { user, patient, phone } = await setup(txn);
      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      const req = httpMocks.createRequest({
        body: {
          To: '+11234567890',
          From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
          DialCallStatus: 'completed',
          DialCallDuration: '11',
          Direction: 'inbound',
          CallSid: callSid,
        },
        query: { outbound: true },
      });

      await twilioCompleteCallHandler(req, res);

      const phoneCalls = await PhoneCall.getForUserPatient(
        { userId: user.id, patientId: patient.id },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(phoneCalls.total).toBe(1);
      expect(phoneCalls.results[0]).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        contactNumber: phone.phoneNumber,
        direction: 'fromUser',
        duration: 11,
        callStatus: 'completed',
        twilioPayload: req.body,
        callSid,
        voicemailUrl: null,
        voicemailPayload: null,
      });

      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);
    });
  });

  describe('twilioVoicemailHandler', () => {
    it('handles a voicemail recording', async () => {
      const { user, patient, phone } = await setup(txn);

      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      await PhoneCall.create(
        {
          direction: 'toUser',
          userId: user.id,
          contactNumber: phone.phoneNumber,
          twilioPayload: {},
          callSid,
          callStatus: 'no-answer',
          duration: 0,
        },
        txn,
      );

      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      const req = httpMocks.createRequest({
        body: {
          RecordingUrl: voicemailUrl,
          CallSid: callSid,
        },
      });

      await twilioVoicemailHandler(req, res);

      const phoneCalls = await PhoneCall.getForUserPatient(
        { userId: user.id, patientId: patient.id },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(phoneCalls.total).toBe(1);
      expect(phoneCalls.results[0]).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        contactNumber: phone.phoneNumber,
        direction: 'toUser',
        duration: 0,
        callStatus: 'no-answer',
        twilioPayload: {},
        callSid,
        voicemailUrl,
        voicemailPayload: req.body,
      });

      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);
    });
  });

  describe('notifyUserOfVoicemail', () => {
    it('notifies user of patient voicemail', async () => {
      const { user, phone } = await setup(txn);

      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      const phoneCall = await PhoneCall.create(
        {
          direction: 'toUser',
          userId: user.id,
          contactNumber: phone.phoneNumber,
          twilioPayload: {},
          callSid,
          callStatus: 'no-answer',
          duration: 0,
        },
        txn,
      );

      const updatedPhoneCall = await PhoneCall.update(
        phoneCall.id,
        { voicemailUrl, voicemailPayload: {} },
        txn,
      );

      await notifyUserOfVoicemail(updatedPhoneCall);

      const args = createMessage.mock.calls;

      expect(createMessage).toHaveBeenCalledTimes(2);
      expect(args[0][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: `Dan P. at +11234567890 left you a voicemail at ${format(
          updatedPhoneCall.updatedAt,
          VOICEMAIL_DATE_FORMAT,
        )}`,
      });
      expect(args[1][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: voicemailUrl,
      });
    });

    it('notifies user of non-patient voicemail', async () => {
      const { user } = await setup(txn);

      await User.update(
        user.id,
        { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
        txn,
      );
      const phoneCall = await PhoneCall.create(
        {
          direction: 'toUser',
          userId: user.id,
          contactNumber: '+12223334444',
          twilioPayload: {},
          callSid,
          callStatus: 'no-answer',
          duration: 0,
        },
        txn,
      );

      const updatedPhoneCall = await PhoneCall.update(
        phoneCall.id,
        { voicemailUrl, voicemailPayload: {} },
        txn,
      );

      await notifyUserOfVoicemail(updatedPhoneCall);

      const args = createMessage.mock.calls;

      expect(createMessage).toHaveBeenCalledTimes(2);
      expect(args[0][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: `+12223334444 left you a voicemail at ${format(
          updatedPhoneCall.updatedAt,
          VOICEMAIL_DATE_FORMAT,
        )}`,
      });
      expect(args[1][0]).toMatchObject({
        from: CITYBLOCK_VOICEMAIL,
        to: '+11234567777',
        body: voicemailUrl,
      });
    });
  });
});
