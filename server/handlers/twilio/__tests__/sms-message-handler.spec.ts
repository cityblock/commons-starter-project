import * as httpMocks from 'node-mocks-http';
import { transaction, Transaction } from 'objection';
import Db from '../../../db';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
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
import { twilioSmsHandler } from '../sms-message-handler';

const expectedTwiml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Message to=\"sim:DEBOGUS14990BOGUS580c2a54713dBOGUS\" from=\"+11234567890\">Winter is coming.</Message></Response>";
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

describe('SMS Message Handler', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PatientPhone.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('saves an incoming SMS', async () => {
    const { user, patient } = await setup(txn);
    await User.update(user.id, { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' }, txn);
    const res = httpMocks.createResponse();
    res.locals = { existingTxn: txn };
    res.end = jest.fn();
    const req = httpMocks.createRequest({
      body: {
        To: '+11234567777',
        From: '+11234567890',
        Body: 'Winter is coming.',
      },
    });

    await twilioSmsHandler(req, res);

    const smsMessages = await SmsMessage.getForUserPatient(
      { userId: user.id, patientId: patient.id },
      { pageNumber: 0, pageSize: 5 },
      txn);

    expect(smsMessages.total).toBe(1);
    expect(smsMessages.results[0]).toMatchObject({
      userId: user.id,
      patientId: patient.id,
      body: 'Winter is coming.',
    });

    expect(res.end).toHaveBeenCalledTimes(1);
    expect(res.end).toHaveBeenCalledWith(expectedTwiml);
  });
});
