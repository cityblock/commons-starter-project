import * as kue from 'kue';
import * as httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions, SmsMessageDirection, UserRole } from 'schema';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import PatientDocument from '../../../models/patient-document';
import PatientPhone from '../../../models/patient-phone';
import Phone from '../../../models/phone';
import SmsMessage from '../../../models/sms-message';
import User from '../../../models/user';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../../spec-helpers';
import pubsub from '../../../subscriptions';
import { twilioIncomingSmsHandler, twilioOutgoingSmsHandler } from '../sms-message-handler';

const queue = kue.createQueue();

const expectedIncomingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Message to="sim:DEBOGUS14990BOGUS580c2a54713dBOGUS" from="+11234567890">Winter is coming.</Message></Response>';
const expectedOutgoingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Message to="+11234567890" from="+11234567777">Winter is here.</Message></Response>';
const expectedOutgoingTwiml2 =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Message to="+11234562222" from="+11234567777">Winter is here.</Message></Response>';
const userRole = 'admin' as UserRole;
const messageSid = 'CAfbe57a569adc67124a71a10f965BOGUS';

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

describe('SMS Message Handler', () => {
  let txn = null as any;

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(PatientPhone.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('handles an incoming SMS', async () => {
    const { user, patient } = await setup(txn);
    await User.update(
      user.id,
      { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
      txn,
    );
    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    pubsub.publish = jest.fn();
    const req = httpMocks.createRequest({
      body: {
        To: '+11234567777',
        From: '+11234567890',
        Body: 'Winter is coming.',
        MessageSid: messageSid,
      },
    });

    await twilioIncomingSmsHandler(req, res);

    const smsMessages = await SmsMessage.getForUserPatient(
      { userId: user.id, patientId: patient.id },
      { pageNumber: 0, pageSize: 5 },
      txn,
    );

    expect(smsMessages.total).toBe(1);
    expect(smsMessages.results[0]).toMatchObject({
      userId: user.id,
      patientId: patient.id,
      body: 'Winter is coming.',
      direction: 'toUser' as SmsMessageDirection,
      messageSid,
    });

    expect(pubsub.publish).toHaveBeenCalledTimes(1);
    expect(pubsub.publish).toHaveBeenCalledWith('smsMessageCreated', {
      smsMessageCreated: { node: smsMessages.results[0] },
      userId: user.id,
      patientId: patient.id,
    });

    expect(queue.testMode.jobs.length).toBe(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      userId: user.id,
      contactNumber: '+11234567890',
    });

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedIncomingTwiml);
  });

  it('does not enqueue after hours job if message not from patient', async () => {
    const { user } = await setup(txn);
    await User.update(
      user.id,
      { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
      txn,
    );
    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    pubsub.publish = jest.fn();
    const req = httpMocks.createRequest({
      body: {
        To: '+11234567777',
        From: '+11234562222',
        Body: 'Winter is here.',
        MessageSid: messageSid,
      },
    });

    await twilioIncomingSmsHandler(req, res);

    expect(queue.testMode.jobs.length).toBe(0);
  });

  it('handles an outgoing SMS', async () => {
    const { user, patient } = await setup(txn);
    await User.update(
      user.id,
      { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
      txn,
    );
    await PatientDocument.create(
      {
        patientId: patient.id,
        uploadedById: user.id,
        filename: '/lets/go/pikachu.png',
        documentType: 'textConsent' as DocumentTypeOptions,
      },
      txn,
    );

    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    pubsub.publish = jest.fn();
    const req = httpMocks.createRequest({
      body: {
        To: '+11234567890',
        From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        Body: 'Winter is here.',
        MessageSid: messageSid,
      },
    });

    await twilioOutgoingSmsHandler(req, res);

    const smsMessages = await SmsMessage.getForUserPatient(
      { userId: user.id, patientId: patient.id },
      { pageNumber: 0, pageSize: 5 },
      txn,
    );

    expect(smsMessages.total).toBe(1);
    expect(smsMessages.results[0]).toMatchObject({
      userId: user.id,
      patientId: patient.id,
      body: 'Winter is here.',
      direction: 'fromUser' as SmsMessageDirection,
      messageSid,
    });

    expect(pubsub.publish).toHaveBeenCalledTimes(1);

    const args = (pubsub.publish as any).mock.calls;

    expect(args[0][0]).toBe('smsMessageCreated');
    expect(args[0][1]).toMatchObject({
      smsMessageCreated: { node: smsMessages.results[0] },
      userId: user.id,
      patientId: patient.id,
    });

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedOutgoingTwiml);
    expect(queue.testMode.jobs.length).toBe(0);
  });

  it('handles an outgoing SMS with no patient consent', async () => {
    const { user, patient } = await setup(txn);
    await User.update(
      user.id,
      { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
      txn,
    );

    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    pubsub.publish = jest.fn();
    const req = httpMocks.createRequest({
      body: {
        To: '+11234567890',
        From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        Body: 'Winter is here.',
        MessageSid: messageSid,
      },
    });

    await twilioOutgoingSmsHandler(req, res);

    const smsMessages = await SmsMessage.getForUserPatient(
      { userId: user.id, patientId: patient.id },
      { pageNumber: 0, pageSize: 5 },
      txn,
    );

    expect(smsMessages.total).toBe(1);
    expect(smsMessages.results[0]).toMatchObject({
      userId: user.id,
      patientId: patient.id,
      body: 'Winter is here.',
      direction: 'fromUser' as SmsMessageDirection,
      messageSid,
    });

    expect(pubsub.publish).toHaveBeenCalledTimes(1);

    const args = (pubsub.publish as any).mock.calls;

    expect(args[0][0]).toBe('smsMessageCreated');
    expect(args[0][1]).toMatchObject({
      smsMessageCreated: { node: smsMessages.results[0] },
      userId: user.id,
      patientId: patient.id,
    });

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedOutgoingTwiml);

    expect(queue.testMode.jobs.length).toBe(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      userId: user.id,
      patientId: patient.id,
      type: 'smsMessage',
    });
  });

  it('handles an outgoing SMS not associated with patient', async () => {
    const { user } = await setup(txn);
    await User.update(
      user.id,
      { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
      txn,
    );
    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    pubsub.publish = jest.fn();
    const req = httpMocks.createRequest({
      body: {
        To: '+11234562222',
        From: 'sim:DEBOGUS14990BOGUS580c2a54713dBOGUS',
        Body: 'Winter is here.',
        MessageSid: messageSid,
      },
    });

    await twilioOutgoingSmsHandler(req, res);

    expect(pubsub.publish).toHaveBeenCalledTimes(1);

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedOutgoingTwiml2);
    expect(queue.testMode.jobs.length).toBe(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      userId: user.id,
      contactNumber: '+11234562222',
    });
  });
});
