import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import { notifyUserOfNoConsent, processNotifyNoConsent } from '../contact-no-consent-consumer';

const phoneNumber = '+17273334444';

interface ISetup {
  user: User;
  patient: Patient;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('Dragonstone', 123455), txn);
  const user = await User.create(createMockUser(11, clinic.id, 'admin' as UserRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
      firstName: 'Arya',
      lastName: 'Stark',
    },
    txn,
  );
  return { user, patient };
}

describe('Contact No Consent Consumer', () => {
  let txn = null as any;
  let createMessage = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Patient.knex());
    createMessage = jest.fn();

    TwilioClient.get = jest.fn().mockReturnValue({
      messages: {
        create: createMessage,
      },
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('processNotifyNoConsent', () => {
    it('notifies user of patient that did not consent to text', async () => {
      const { user, patient } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      await processNotifyNoConsent(
        {
          userId: user.id,
          patientId: patient.id,
          type: 'smsMessage',
        },
        txn,
      );

      expect(createMessage).toBeCalledWith({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Arya S. has not consented to being contacted via text message. Please refrain from texting this member in the future.',
      });
    });

    it('notifies user of patient that did not consent to call', async () => {
      const { user, patient } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      await processNotifyNoConsent(
        {
          userId: user.id,
          patientId: patient.id,
          type: 'phoneCall',
        },
        txn,
      );

      expect(createMessage).toBeCalledWith({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Arya S. has not consented to being contacted via phone call. Please refrain from calling this member in the future.',
      });
    });

    it('throws an error if user does not have phone registered', async () => {
      const { user, patient } = await setup(txn);

      try {
        await processNotifyNoConsent(
          {
            userId: user.id,
            patientId: patient.id,
            type: 'phoneCall',
          },
          txn,
        );

        // ensure we don't reach this
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err.message).toMatch(
          `User ${user.id} does not have phone number registered in Commons.`,
        );
      }
    });
  });

  describe('processNotifyNoConsent', () => {
    it('notifies user of patient that did not consent to text', async () => {
      const { user, patient } = await setup(txn);
      const updatedUser = await User.update(user.id, { phone: phoneNumber }, txn);

      await notifyUserOfNoConsent(updatedUser, patient, 'smsMessage');

      expect(createMessage).toBeCalledWith({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Arya S. has not consented to being contacted via text message. Please refrain from texting this member in the future.',
      });
    });

    it('notifies user of patient that did not consent to call', async () => {
      const { user, patient } = await setup(txn);
      const updatedUser = await User.update(user.id, { phone: phoneNumber }, txn);

      await notifyUserOfNoConsent(updatedUser, patient, 'phoneCall');

      expect(createMessage).toBeCalledWith({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Arya S. has not consented to being contacted via phone call. Please refrain from calling this member in the future.',
      });
    });
  });
});
