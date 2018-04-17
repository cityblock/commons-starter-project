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
import { twilioCompleteCallHandler, twilioIncomingCallHandler } from '../phone-call-handler';

const expectedIncomingTwiml =
  '<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/twilio-complete-phone-call" method="POST" from="+11234567890"><Sim>DEBOGUS14990BOGUS580c2a54713dBOGUS</Sim></Dial></Response>';
const expectedCompleteTwiml = '<?xml version="1.0" encoding="UTF-8"?><Response/>';

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

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PhoneCall.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

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
      },
    });

    await twilioIncomingCallHandler(req, res);

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedIncomingTwiml);
  });

  it('handles a complete inbound phone call', async () => {
    const { user, patient } = await setup(txn);
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
      direction: 'toUser',
      duration: 11,
      callStatus: 'completed',
      twilioPayload: req.body,
    });

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedCompleteTwiml);
  });
});
