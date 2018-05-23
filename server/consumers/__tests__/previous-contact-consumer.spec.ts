import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
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
import { getNoticeCopy, processPreviousContactCheck } from '../previous-contact-consumer';

interface ISetup {
  clinic: Clinic;
  user: User;
  patient: Patient;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic('Winterfell', 123455), txn);
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

describe('Previous Contact Consumer', () => {
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

  describe('processPreviousContactCheck', () => {
    it('does nothing if phone number not associated with a patient', async () => {
      const { user } = await setup(txn);

      await processPreviousContactCheck(
        {
          userId: user.id,
          contactNumber: '+12343454567',
        },
        txn,
      );

      expect(createMessage).not.toBeCalled();
    });

    it('does nothing if user not on patient care team', async () => {
      const { user, clinic, phone } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      const patient2 = await createPatient(
        {
          cityblockId: 234,
          homeClinicId: clinic.id,
          firstName: 'Daenerys',
          lastName: 'Targaryen',
        },
        txn,
      );

      await PatientPhone.create({ phoneId: phone.id, patientId: patient2.id }, txn);
      await PatientPhone.delete({ phoneId: phone.id, patientId: patient2.id }, txn);

      await processPreviousContactCheck(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
      );

      expect(createMessage).not.toBeCalled();
    });

    it('does nothing if phone number still active', async () => {
      const { user, patient, phone } = await setup(txn);

      await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);

      await processPreviousContactCheck(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
      );

      expect(createMessage).not.toBeCalled();
    });

    it('notifies user if trying to contact deleted phone number', async () => {
      const { user, patient, phone } = await setup(txn);
      await User.update(user.id, { phone: phoneNumber }, txn);

      await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);
      await PatientPhone.delete({ phoneId: phone.id, patientId: patient.id }, txn);

      await processPreviousContactCheck(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
        },
        txn,
      );

      expect(createMessage).toHaveBeenCalledTimes(2);

      const args = createMessage.mock.calls;

      expect(args[0][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body: 'The number +11234567890 is no longer associated with member Jon S.',
      });
      expect(args[1][0]).toMatchObject({
        from: '+17273415787',
        to: phoneNumber,
        body:
          'Please delete the Jon S. contact and download updated contacts here: http://localhost:3000/contacts',
      });
    });
  });

  describe('getNoticeCopy', () => {
    it('returns message that number not associated with member', async () => {
      const { patient } = await setup(txn);
      const noticeCopy = getNoticeCopy(patient, phoneNumber);

      expect(noticeCopy).toBe('The number +17273334444 is no longer associated with member Jon S.');
    });
  });
});
