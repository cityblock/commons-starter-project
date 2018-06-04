import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import SmsMessage from '../../models/sms-message';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import { deleteSmsMessage, processSmsMessage } from '../sms-message-consumer';

const messageSid = 'CAfbe57a569adc67124a71a10f965BOGUS';
const twilioSimId = 'BOGUS5f14990BOGUS580c2a54713dBOGUS';
const fullSimId = `sim:${twilioSimId}`;
const body = "Let's Go Pikachu!";

const userPhone = '+13452343456';

const timestamp = new Date();

interface ISetup {
  user: User;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('The Wall', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const patient = await createPatient(
    { cityblockId: 123, homeClinicId: clinic.id, userId: user.id },
    txn,
  );

  const phone = await Phone.create(createMockPhone(), txn);
  await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

  const updatedUser = await User.update(user.id, { twilioSimId, phone: userPhone }, txn);

  return { user: updatedUser, phone };
}

describe('SMS Message Consumer', () => {
  let txn = null as any;
  let removeMessage = null as any;

  beforeEach(async () => {
    txn = await transaction.start(SmsMessage.knex());
    removeMessage = jest.fn();

    TwilioClient.get = jest.fn().mockReturnValue({
      messages: (sid: string) => ({
        remove: removeMessage,
      }),
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('processSmsMessage', () => {
    it('handles case where SMS message already stored in DB', async () => {
      const { phone } = await setup(txn);

      const message = {
        sid: messageSid,
        to: fullSimId,
        from: phone.phoneNumber,
        dateCreated: timestamp,
        dateUpdated: timestamp,
        body,
        status: 'delivered',
      };

      await processSmsMessage(message, txn);

      expect(removeMessage).toBeCalled();
    });

    it('does nothing if message not delivered', async () => {
      const { phone } = await setup(txn);

      const message = {
        sid: messageSid,
        to: fullSimId,
        from: phone.phoneNumber,
        dateCreated: timestamp,
        dateUpdated: timestamp,
        body,
        status: 'sent',
      };

      await processSmsMessage(message, txn);

      expect(removeMessage).not.toBeCalled();
    });
  });

  describe('deleteSmsMessage', () => {
    it('makes a request to delete SMS message from Twilio', async () => {
      const sid = 'PIKACHU';

      await deleteSmsMessage(sid);

      expect(removeMessage).toBeCalled();
    });
  });
});
