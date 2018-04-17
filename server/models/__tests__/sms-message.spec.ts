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
const twilioPayload = {
  To: '+17274221111',
  From: '+11234567777',
  MessageSid: 'bogusid',
};

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

  describe('create', () => {
    it('should create sms and associate with patient if applicable', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser',
          body,
          twilioPayload,
        },
        txn,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: patient.id,
        direction: 'toUser',
        body,
        twilioPayload,
      });
    });

    it('should create sms not associated with patient if applicable', async () => {
      const { phone, user } = await setup(txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser',
          body,
          twilioPayload,
        },
        txn,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: null,
        direction: 'toUser',
        body,
        twilioPayload,
      });
    });
  });

  describe('getForUserPatient', () => {
    it('should get a list of all patient messages for given user and patient', async () => {
      const { patient, phone, user } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone('+12223334444'), txn);

      const phone3 = await Phone.create(createMockPhone('+13334445555'), txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser',
          body,
          twilioPayload,
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone2.phoneNumber,
          direction: 'toUser',
          body,
          twilioPayload,
        },
        txn,
      );

      const sms2 = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone3.phoneNumber,
          direction: 'toUser',
          body: body2,
          twilioPayload,
        },
        txn,
      );

      await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

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
