import kue from 'kue';
import httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import { SmsMessageDirection, UserRole } from 'schema';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import PatientInfo from '../../../models/patient-info';
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
import {
  twilioCompleteCallHandler,
  twilioIncomingCallHandler,
  twilioOutgoingCallHandler,
} from '../phone-call-handler';

const queue = kue.createQueue();

const expectedIncomingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call" method="POST" timeout="20" ringTone="us"><Sim>DEBOGUS14990BOGUS580c2a54713dBOGUS</Sim></Dial></Response>';
const expectedOutgoingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call?outbound=true" method="POST" callerId="+11234567777" ringTone="us"><Number>+11234567890</Number></Dial></Response>';
const expectedCompleteTwiml = '<?xml version="1.0" encoding="UTF-8"?><Response/>';
const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';

const userRole = 'Pharmacist' as UserRole;

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

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(PhoneCall.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
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

    it('returns 500 if error with incoming phone call', async () => {
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      res.sendStatus = jest.fn();

      const req = httpMocks.createRequest({
        body: {
          To: '+11234567777',
          From: '+11234567890',
          Direction: 'inbound',
        },
      });

      await twilioIncomingCallHandler(req, res);

      expect(res.sendStatus).toBeCalledWith(500);
      expect(res.end).not.toBeCalled();
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

    it('returns 500 if error with outgoing phone call', async () => {
      const res = httpMocks.createResponse();
      res.locals = { existingTxn: txn };
      res.end = jest.fn();
      res.sendStatus = jest.fn();

      const req = httpMocks.createRequest({
        body: {
          To: '+11234567890',
          From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        },
      });

      await twilioOutgoingCallHandler(req, res);

      expect(res.sendStatus).toBeCalledWith(500);
      expect(res.end).not.toBeCalled();
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
        direction: 'toUser' as SmsMessageDirection,
        duration: 11,
        callStatus: 'completed',
        twilioPayload: req.body,
        callSid,
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
      await PatientInfo.edit(
        {
          canReceiveCalls: true,
          updatedById: user.id,
        },
        patient.patientInfo.id,
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
        direction: 'fromUser' as SmsMessageDirection,
        duration: 11,
        callStatus: 'completed',
        twilioPayload: req.body,
        callSid,
      });

      expect(res.end).toHaveBeenCalledTimes(1);
      expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);
      expect(queue.testMode.jobs.length).toBe(0);
    });
  });

  it('handles a complete outbound phone call not associated with past patient number', async () => {
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
        To: '+11234522222',
        From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        DialCallStatus: 'completed',
        DialCallDuration: '11',
        Direction: 'inbound',
        CallSid: callSid,
      },
      query: { outbound: true },
    });

    await twilioCompleteCallHandler(req, res);

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);

    expect(queue.testMode.jobs.length).toBe(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      userId: user.id,
      contactNumber: '+11234522222',
    });
  });

  it('simply returns 200 if pinging after voicemail left', async () => {
    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    res.sendStatus = jest.fn();

    const req = httpMocks.createRequest({
      body: {
        RecordingUrl: 'https://winter.is.coming.com',
        To: '+11234522222',
        From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        DialCallStatus: 'completed',
        DialCallDuration: '11',
        Direction: 'inbound',
        CallSid: callSid,
      },
      query: { outbound: true },
    });

    await twilioCompleteCallHandler(req, res);

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);
  });

  it('returns 500 if error handling completed call', async () => {
    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    res.sendStatus = jest.fn();

    const req = httpMocks.createRequest({
      body: {
        To: '+11234522222',
        From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        DialCallStatus: 'completed',
        DialCallDuration: '11',
        Direction: 'inbound',
        CallSid: callSid,
      },
      query: { outbound: true },
    });

    await twilioCompleteCallHandler(req, res);

    expect(res.sendStatus).toBeCalledWith(500);
    expect(res.end).not.toBeCalled();
  });
});
