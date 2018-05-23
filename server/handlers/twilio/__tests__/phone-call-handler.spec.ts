import * as kue from 'kue';
import * as httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import { SmsMessageDirection, UserRole } from 'schema';
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
import {
  twilioCompleteCallHandler,
  twilioIncomingCallHandler,
  twilioOutgoingCallHandler,
} from '../phone-call-handler';

const queue = kue.createQueue();

const expectedIncomingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call" method="POST" timeout="20"><Sim>DEBOGUS14990BOGUS580c2a54713dBOGUS</Sim></Dial></Response>';
const expectedOutgoingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call?outbound=true" method="POST" callerId="+11234567777"><Number>+11234567890</Number></Dial></Response>';
const expectedCompleteTwiml = '<?xml version="1.0" encoding="UTF-8"?><Response/>';
const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';

const userRole = 'admin' as UserRole;

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

  it('handles a complete outbound phone call', async () => {
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
});
