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
import PhoneCall from '../phone-call';
import User from '../user';

const userRole = 'admin';
const callStatus = 'completed';
const twilioPayload = {
  To: '+17274221111',
  From: '+11234567777',
  CallSid: 'bogusid',
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

describe('Phone Call Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(PhoneCall.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', () => {
    it('should create phone call and associate with patient if applicable', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser',
          duration: 11,
          callStatus,
          twilioPayload,
        },
        txn,
      );

      expect(phoneCall).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: patient.id,
        duration: 11,
        callStatus,
        twilioPayload,
      });
    });

    it('should create phone call not associated with patient if applicable', async () => {
      const { phone, user } = await setup(txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser',
          duration: 11,
          callStatus,
          twilioPayload,
        },
        txn,
      );

      expect(phoneCall).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: null,
        duration: 11,
        callStatus,
        twilioPayload,
      });
    });

    it('should not create a phone call with invalid contact number', async () => {
      const { user } = await setup(txn);

      await expect(
        PhoneCall.create(
          {
            userId: user.id,
            contactNumber: '(123) 456-7890',
            direction: 'toUser',
            duration: 11,
            callStatus,
            twilioPayload,
          },
          txn,
        ),
      ).rejects.toMatch('Phone number must be in +12345678901 format');
    });
  });

  describe('getForUserPatient', () => {
    it('should get a list of phone calls for a given user and patient', async () => {
      const { patient, phone, user } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone('+12223334444'), txn);

      const phone3 = await Phone.create(createMockPhone('+13334445555'), txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone3.id }, txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser',
          duration: 11,
          callStatus,
          twilioPayload,
        },
        txn,
      );

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone2.phoneNumber,
          direction: 'toUser',
          duration: 12,
          callStatus,
          twilioPayload,
        },
        txn,
      );

      const phoneCall2 = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone3.phoneNumber,
          direction: 'toUser',
          duration: 13,
          callStatus,
          twilioPayload,
        },
        txn,
      );

      await PatientPhone.delete({ patientId: patient.id, phoneId: phone3.id }, txn);

      const phoneCalls = await PhoneCall.getForUserPatient(
        { userId: user.id, patientId: patient.id },
        { pageNumber: 0, pageSize: 5 },
        txn,
      );

      expect(phoneCalls.total).toBe(2);
      expect(phoneCalls.results[0]).toMatchObject(phoneCall2);
      expect(phoneCalls.results[1]).toMatchObject(phoneCall);
    });
  });
});
