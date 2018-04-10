import { transaction, Transaction } from 'objection';
import Db from '../../db';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import PatientPhone from '../patient-phone';
import Phone from '../phone';
import SmsMessage from '../sms-message';
import User from '../user';

const userRole = 'admin';
const body = 'Winter is coming.';
const body2 = 'Winter is here.';
const twilioMessageSid = 'SM7b34ed9b8c100cef235feb6130f12190';

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
  const phone = await Phone.create(createMockPhone(user.id), txn);

  return { patient, phone, user, clinic };
}

describe('SMS model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(SmsMessage.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create sms', async () => {
      const { phone, user } = await setup(txn);
      const sms = await SmsMessage.create(
        {
          userId: user.id,
          phoneId: phone.id,
          direction: 'inbound',
          body,
          mediaUrls: null,
          twilioMessageSid,
        },
        txn,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        phoneId: phone.id,
        direction: 'inbound',
        body,
        mediaUrls: null,
        twilioMessageSid,
      });
    });
  });

  describe('getForUserPatient', async () => {
    it('should get a list of all patient messages for given user and patient', async () => {
      const { patient, phone, user } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone(user.id), txn);

      const phone3 = await Phone.create(createMockPhone(user.id), txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          phoneId: phone.id,
          direction: 'inbound',
          body,
          mediaUrls: null,
          twilioMessageSid,
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          phoneId: phone2.id,
          direction: 'inbound',
          body,
          mediaUrls: null,
          twilioMessageSid,
        },
        txn,
      );

      const sms2 = await SmsMessage.create(
        {
          userId: user.id,
          phoneId: phone3.id,
          direction: 'inbound',
          body: body2,
          mediaUrls: null,
          twilioMessageSid,
        },
        txn,
      );

      const messages = await SmsMessage.getForUserPatient(
        { userId: user.id, patientId: patient.id },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(messages.total).toBe(2);
      expect(messages.results[0]).toMatchObject(sms2);
      expect(messages.results[1]).toMatchObject(sms);
    });
  });
});
