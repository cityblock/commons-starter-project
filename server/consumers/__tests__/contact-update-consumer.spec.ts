import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import {
  getActionCopy,
  getNoticeCopy,
  notifyUserOfContactEdit,
  processPatientContactEdit,
} from '../contact-update-consumer';

interface ISetup {
  clinic: Clinic;
  user: User;
  patient: Patient;
  phone: Phone;
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
  const phone = await Phone.create(createMockPhone(), txn);

  return { clinic, user, patient, phone };
}

describe('Contact Update Consumer', () => {
  let txn = null as any;
  let createMessage = null as any;
  const phoneNumber = '+17273334444';

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
      await User.update(user.id, { phone: phoneNumber }, txn);

      await processPatientContactEdit(
        {
          patientId: patient.id,
          type: 'deletePhoneNumber',
        },
        txn,
      );

      expect(createMessage).toHaveBeenCalledTimes(2);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body: 'An existing contact for Jon S. has been deleted in Commons.',
      });
      expect(args[1][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Please delete the Jon S. contact and download updated contacts here: http://localhost:3000/contacts',
      });
    });

    it('notifies care team of preferred name changes', async () => {
      const { user, patient } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      await processPatientContactEdit(
        {
          patientId: patient.id,
          type: 'editPreferredName',
          prevPreferredName: 'King',
        },
        txn,
      );

      expect(createMessage).toHaveBeenCalledTimes(2);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body: 'The preferred name of Jon (King) S. has been updated in Commons.',
      });
      expect(args[1][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Please delete the Jon (King) S. contact and download updated contacts here: http://localhost:3000/contacts',
      });
    });

    it('notifies single user of new care team member', async () => {
      const { user, patient, phone } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);
      await PatientInfo.edit(
        { primaryPhoneId: phone.id, updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );

      await processPatientContactEdit(
        {
          patientId: patient.id,
          type: 'addCareTeamMember',
          userId: user.id,
        },
        txn,
      );

      expect(createMessage).toHaveBeenCalledTimes(1);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'A member has been added to your care team. Please download updated contacts here: http://localhost:3000/contacts',
      });
    });

    it('does not notify user of new care team member if no phones stored', async () => {
      const { user, patient } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      await processPatientContactEdit(
        {
          patientId: patient.id,
          type: 'addCareTeamMember',
          userId: user.id,
        },
        txn,
      );

      expect(createMessage).not.toBeCalled();
    });

    it('notifies if bulk assign occurred', async () => {
      const { user, patient, clinic, phone } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      const patient2 = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          userId: user.id,
          firstName: 'Daenerys',
          lastName: 'Targaryen',
        },
        txn,
      );

      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);
      await PatientInfo.edit(
        { primaryPhoneId: phone.id, updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );
      await PatientInfo.edit(
        { primaryPhoneId: phone.id, updatedById: user.id },
        patient2.patientInfo.id,
        txn,
      );

      await processPatientContactEdit(
        {
          patientIds: [patient.id, patient2.id],
          type: 'addCareTeamMember',
          userId: user.id,
        },
        txn,
      );

      expect(createMessage).toHaveBeenCalledTimes(1);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'A member has been added to your care team. Please download updated contacts here: http://localhost:3000/contacts',
      });
    });

    it('does not notify in bulk assign if no patients has phone numbers', async () => {
      const { user, patient, clinic } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      const patient2 = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          userId: user.id,
          firstName: 'Daenerys',
          lastName: 'Targaryen',
        },
        txn,
      );

      await processPatientContactEdit(
        {
          patientIds: [patient.id, patient2.id],
          type: 'addCareTeamMember',
          userId: user.id,
        },
        txn,
      );

      expect(createMessage).not.toBeCalled();
    });
  });

  describe('notifyUserOfContactEdit', () => {
    const noticeCopy = 'noticeCopy';
    const actionCopy = 'actionCopy';

    it('sends messages notifying user of contact change', async () => {
      const { user } = await setup(txn);
      const updatedUser = await User.update(user.id, { phone: phoneNumber }, txn);

      await notifyUserOfContactEdit(updatedUser, noticeCopy, actionCopy);

      expect(createMessage).toHaveBeenCalledTimes(2);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body: noticeCopy,
      });
      expect(args[1][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body: actionCopy,
      });
    });

    it('only sends one message if specified', async () => {
      const { user } = await setup(txn);
      const updatedUser = await User.update(user.id, { phone: phoneNumber }, txn);

      await notifyUserOfContactEdit(updatedUser, noticeCopy, null);

      expect(createMessage).toHaveBeenCalledTimes(1);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body: noticeCopy,
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

    it('gets notice copy for deleted phone number', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, 'deletePhoneNumber');

      expect(noticeCopy).toBe('An existing contact for Jon S. has been deleted in Commons.');
    });

    it('gets notice copy for new to care team message', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, 'addCareTeamMember');

      expect(noticeCopy).toBe(
        'A member has been added to your care team. Please download updated contacts here: http://localhost:3000/contacts',
      );
    });

    it('handles case where previous preferred name provided', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, 'editPreferredName', 'King');

      expect(noticeCopy).toBe('The preferred name of Jon (King) S. has been updated in Commons.');
    });
  });

  describe('getActionCopy', () => {
    it('gets action copy for added phone number', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'addPhoneNumber');

      expect(actionCopy).toBe('Please download it here: http://localhost:3000/contacts');
    });

    it('gets action copy for deleted phone number', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'deletePhoneNumber');

      expect(actionCopy).toBe(
        'Please delete the Jon S. contact and download updated contacts here: http://localhost:3000/contacts',
      );
    });

    it('gets action copy for new to care team message', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'addCareTeamMember');

      expect(actionCopy).toBeNull();
    });

    it('handles case where previous preferred name provided', async () => {
      const { patient } = await setup(txn);
      const actionCopy = getActionCopy(patient, 'editPreferredName', 'King');

      expect(actionCopy).toBe(
        'Please delete the Jon (King) S. contact and download updated contacts here: http://localhost:3000/contacts',
      );
    });
  });
});
