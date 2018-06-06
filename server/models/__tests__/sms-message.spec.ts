import { transaction, Transaction } from 'objection';
import { SmsMessageDirection, UserRole } from 'schema';

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

const userRole = 'admin' as UserRole;
const body = 'Winter is coming.';
const body2 = 'Winter is here.';
const twilioPayload = {
  To: '+17274221111',
  From: '+11234567777',
  MessageSid: 'bogusid',
};
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

  return { patient, phone, user, clinic };
}

describe('SMS model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(SmsMessage.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('should create sms and associate with patient if applicable', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: patient.id,
        direction: 'toUser' as SmsMessageDirection,
        body,
        twilioPayload,
        messageSid,
        mediaUrls: null,
      });
    });

    it('should create sms with media URLs', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const mediaUrl = 'www.letsgopikachu.com';
      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
          mediaUrls: [mediaUrl],
        },
        txn,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: patient.id,
        direction: 'toUser' as SmsMessageDirection,
        body,
        twilioPayload,
        mediaUrls: [mediaUrl],
      });
    });

    it('should eager load patient if specified', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
        true,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: patient.id,
        direction: 'toUser' as SmsMessageDirection,
        body,
        twilioPayload,
        patient: {
          patientInfo: {
            gender: patient.patientInfo.gender,
            canReceiveTexts: patient.patientInfo.canReceiveTexts,
          },
        },
      });
    });

    it('should create sms not associated with patient if applicable', async () => {
      const { phone, user } = await setup(txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: null,
        direction: 'toUser' as SmsMessageDirection,
        body,
        twilioPayload,
      });
    });

    it('should eager load no patient if specified', async () => {
      const { phone, user } = await setup(txn);

      const sms = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
        true,
      );

      expect(sms).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: null,
        direction: 'toUser' as SmsMessageDirection,
        body,
        twilioPayload,
        patient: null,
      });
    });

    it('should not create a phone call with invalid contact number', async () => {
      const { user } = await setup(txn);

      await expect(
        SmsMessage.create(
          {
            userId: user.id,
            contactNumber: '(123) 456-7890',
            direction: 'toUser' as SmsMessageDirection,
            body,
            twilioPayload,
            messageSid,
          },
          txn,
        ),
      ).rejects.toMatch('Phone number must be in +12345678901 format');
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
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone2.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid: 'DBfbe57a569adc67124a71a10f965BOGUS',
        },
        txn,
      );

      const sms2 = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone3.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body: body2,
          twilioPayload,
          messageSid: 'EFfbe57a569adc67124a71a10f965BOGUS',
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

  describe('getLatestForUserPatient', () => {
    it('returns latest SMS message between user and patient if one exists', async () => {
      const { patient, phone, user } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone('+12223334444'), txn);

      const phone3 = await Phone.create(createMockPhone('+13334445555'), txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone2.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid: 'DEfbe57a569adc67124a71a10f965BOGUS',
        },
        txn,
      );

      const sms2 = await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone3.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body: body2,
          twilioPayload,
          messageSid: 'EFfbe57a569adc67124a71a10f965BOGUS',
        },
        txn,
      );

      await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

      const message = await SmsMessage.getLatestForUserPatient(
        { userId: user.id, patientId: patient.id },
        txn,
      );

      expect(message).toMatchObject(sms2);
    });

    it('returns null if no messages between user and patient', async () => {
      const { patient, phone, user } = await setup(txn);

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          body,
          twilioPayload,
          messageSid,
        },
        txn,
      );

      const message = await SmsMessage.getLatestForUserPatient(
        { userId: user.id, patientId: patient.id },
        txn,
      );

      expect(message).toBeNull();
    });
  });
});
