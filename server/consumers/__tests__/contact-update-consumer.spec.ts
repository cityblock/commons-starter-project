import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import {
  getActionCopy,
  getNoticeCopy,
  notifyUserOfContactEdit,
  processPatientContactEdit,
} from '../contact-update-consumer';

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
      firstName: 'Jon',
      lastName: 'Snow',
    },
    txn,
  );

  return { user, patient };
}

describe('Contact Update Consumer', () => {
  let txn = null as any;
  let createMessage = null as any;
  const phone = '+17273334444';

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

  describe('processPatientContactEdit', () => {
    it('notifies care team of contact updates', async () => {
      const { user, patient } = await setup(txn);
      await User.update(user.id, { phone }, txn);

      await processPatientContactEdit(
        {
          patientId: patient.id,
          type: 'editPhoneNumber',
        },
        txn,
      );

      expect(createMessage).toHaveBeenCalledTimes(2);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phone,
        body: 'An existing contact for Jon S. has been updated in Commons.',
      });
      expect(args[1][0]).toMatchObject({
        from: '+17273415787',
        to: phone,
        body:
          'Please delete the Jon S. contact and download updated contacts here: http://localhost:3000/contacts',
      });
    });
  });

  describe('notifyUserOfContactEdit', () => {
    const noticeCopy = 'noticeCopy';
    const actionCopy = 'actionCopy';

    it('sends messages notifying user of contact change', async () => {
      const { user } = await setup(txn);
      const updatedUser = await User.update(user.id, { phone }, txn);

      await notifyUserOfContactEdit(updatedUser, noticeCopy, actionCopy);

      expect(createMessage).toHaveBeenCalledTimes(2);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phone,
        body: noticeCopy,
      });
      expect(args[1][0]).toMatchObject({
        from: '+17273415787',
        to: phone,
        body: actionCopy,
      });
    });

    it('throws an error if user does nto have phone number', async () => {
      const { user } = await setup(txn);

      try {
        await notifyUserOfContactEdit(user, noticeCopy, actionCopy);

        // ensure error actually thrown
        expect(true).toBeFalsy();
      } catch (err) {
        expect(err).toEqual(
          new Error(`User ${user.id} does not have phone number registered in Commons.`),
        );
      }
    });
  });

  describe('getNoticeCopy', () => {
    it('gets notice copy for added phone number', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, 'addPhoneNumber');

      expect(noticeCopy).toBe('A new contact for Jon S. has been added to Commons.');
    });

    it('gets notice copy for edited phone number', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, 'editPhoneNumber');

      expect(noticeCopy).toBe('An existing contact for Jon S. has been updated in Commons.');
    });

    it('gets notice copy for deleted phone number', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, 'deletePhoneNumber');

      expect(noticeCopy).toBe('An existing contact for Jon S. has been deleted in Commons.');
    });
  });

  describe('getActionCopy', () => {
    it('gets action copy for added phone number', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'addPhoneNumber');

      expect(actionCopy).toBe('Please download it here: http://localhost:3000/contacts');
    });

    it('gets action copy for edited phone number', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'editPhoneNumber');

      expect(actionCopy).toBe(
        'Please delete the Jon S. contact and download updated contacts here: http://localhost:3000/contacts',
      );
    });

    it('gets action copy for deleted phone number', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'deletePhoneNumber');

      expect(actionCopy).toBe(
        'Please delete the Jon S. contact and download updated contacts here: http://localhost:3000/contacts',
      );
    });
  });
});
