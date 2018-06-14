import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import SmsMessage from '../../models/sms-message';
import User from '../../models/user';
import UserHours from '../../models/user-hours';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import {
  chunk,
  isInDateRange,
  processAfterHoursCommunications,
  sendAfterHoursResponse,
} from '../after-hours-communications-consumer';

const messageSid = 'CAfbe57a569adc67124a71a10f965BOGUS';

interface ISetup {
  user: User;
  patient: Patient;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('The Wall', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

  const updatedUser = await User.update(
    user.id,
    { phone: '+11234567777', twilioSimId: 'DEBOGUS14990BOGUS580c2a54713dBOGUS' },
    txn,
  );

  return { user: updatedUser, patient, phone };
}

describe('After Hours Communications Consumer', () => {
  let txn = null as any;
  let createMessage = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());

    createMessage = jest.fn().mockReturnValue({ sid: messageSid });

    TwilioClient.get = jest.fn().mockReturnValue({
      messages: {
        create: createMessage,
      },
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('processAfterHoursCommunications', () => {
    it('sends SMS to patient if user not available in general', async () => {
      const { user, phone, patient } = await setup(txn);
      await User.update(user.id, { isAvailable: false }, txn);

      const date = new Date('2018-06-12T18:17:12.026Z');

      await processAfterHoursCommunications(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
        date,
      );

      expect(createMessage).toHaveBeenCalledTimes(1);
      expect(createMessage).toBeCalledWith({
        from: user.phone,
        to: phone.phoneNumber,
        body: user.awayMessage,
      });

      const smsMessages = await SmsMessage.getForUserPatient(
        {
          userId: user.id,
          patientId: patient.id,
        },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(smsMessages.total).toBe(1);
      expect(smsMessages.results[0]).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        direction: 'fromUser',
        body: user.awayMessage,
        messageSid,
      });
    });

    it('sends SMS to patient if user available but not working', async () => {
      const { user, phone, patient } = await setup(txn);

      const date = new Date('2018-06-10T18:18:12.026Z');

      await processAfterHoursCommunications(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
        date,
      );

      expect(createMessage).toHaveBeenCalledTimes(1);
      expect(createMessage).toBeCalledWith({
        from: user.phone,
        to: phone.phoneNumber,
        body: user.awayMessage,
      });

      const smsMessages = await SmsMessage.getForUserPatient(
        {
          userId: user.id,
          patientId: patient.id,
        },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(smsMessages.total).toBe(1);
      expect(smsMessages.results[0]).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        direction: 'fromUser',
        body: user.awayMessage,
        messageSid,
      });
    });

    it('does nothing if user currently working', async () => {
      const { user, phone } = await setup(txn);

      const date = new Date('2018-06-12T21:17:12.026Z');

      await processAfterHoursCommunications(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
        date,
      );

      expect(createMessage).not.toBeCalled();
    });

    it('handles daylight savings time', async () => {
      const { user, phone } = await setup(txn);

      const date = new Date('2018-06-12T16:07:12.026Z');

      await processAfterHoursCommunications(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
        date,
      );

      expect(createMessage).not.toBeCalled();
    })
  });

  describe('isInDateRange', () => {
    it('returns true if date in user hours range', async () => {
      const { user } = await setup(txn);
      const userHours = await UserHours.create(
        {
          userId: user.id,
          weekday: 0,
          startTime: 800,
          endTime: 1800,
        },
        txn,
      );

      const date = new Date('2017-12-31T01:00:00.000Z');
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // convert to local time zone

      expect(isInDateRange(userHours, date)).toBeTruthy();
    });

    it('returns false if date not in user hours range', async () => {
      const { user } = await setup(txn);
      const userHours = await UserHours.create(
        {
          userId: user.id,
          weekday: 0,
          startTime: 800,
          endTime: 1800,
        },
        txn,
      );

      const date = new Date('2017-12-31T23:30:00.000Z');

      expect(isInDateRange(userHours, date)).toBeFalsy();
    });
  });

  describe('sendAfterHoursResponse', () => {
    it('sends message to contact number', async () => {
      const { user, patient, phone } = await setup(txn);

      await sendAfterHoursResponse(user, phone.phoneNumber, txn);

      expect(createMessage).toHaveBeenCalledTimes(1);
      expect(createMessage).toBeCalledWith({
        from: user.phone,
        to: phone.phoneNumber,
        body: user.awayMessage,
      });

      const smsMessages = await SmsMessage.getForUserPatient(
        {
          userId: user.id,
          patientId: patient.id,
        },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(smsMessages.total).toBe(1);
      expect(smsMessages.results[0]).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        direction: 'fromUser',
        body: user.awayMessage,
        messageSid,
      });
    });
  });

  describe('chunk', () => {
    it('splits message into chunks', () => {
      const message =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages";
      const chunks = chunk(message);

      expect(chunks).toEqual([
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
        'unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic',
        'typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages',
      ]);
    });
  });
});
