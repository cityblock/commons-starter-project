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
import PhoneCall from '../phone-call';
import User from '../user';

const userRole = 'admin' as UserRole;
const timestamp = new Date().toISOString();
const callStatus = 'completed';
const twilioPayload = {
  To: '+17274221111',
  From: '+11234567777',
  CallSid: 'bogusid',
};
const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';

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
    txn = await transaction.start(PhoneCall.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('should create phone call and associate with patient if applicable', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 11,
          callStatus,
          twilioPayload,
          callSid,
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
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

    it('shoule eager load patient if specified', async () => {
      const { phone, user, patient } = await setup(txn);
      await PatientPhone.create({ patientId: patient.id, phoneId: phone.id }, txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 11,
          callStatus,
          twilioPayload,
          callSid,
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
        },
        txn,
        true,
      );

      expect(phoneCall).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: patient.id,
        duration: 11,
        callStatus,
        twilioPayload,
        patient: {
          patientInfo: {
            gender: patient.patientInfo.gender,
            canReceiveTexts: patient.patientInfo.canReceiveTexts,
          },
        },
      });
    });

    it('should create phone call not associated with patient if applicable', async () => {
      const { phone, user } = await setup(txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 11,
          callStatus,
          twilioPayload,
          callSid,
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
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

    it('should eager load no patient if specified', async () => {
      const { phone, user } = await setup(txn);

      const phoneCall = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 11,
          callStatus,
          twilioPayload,
          callSid,
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
        },
        txn,
        true,
      );

      expect(phoneCall).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: null,
        duration: 11,
        callStatus,
        twilioPayload,
        patient: null,
      });
    });

    it('should not create a phone call with invalid contact number', async () => {
      const { user } = await setup(txn);

      await expect(
        PhoneCall.create(
          {
            userId: user.id,
            contactNumber: '(123) 456-7890',
            direction: 'toUser' as SmsMessageDirection,
            duration: 11,
            callStatus,
            twilioPayload,
            callSid,
            twilioCreatedAt: timestamp,
            twilioUpdatedAt: timestamp,
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
          direction: 'toUser' as SmsMessageDirection,
          duration: 11,
          callStatus,
          twilioPayload,
          callSid,
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
        },
        txn,
      );

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone2.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 12,
          callStatus,
          twilioPayload,
          callSid: 'CAgce57a569adc67124a71a10f965BOGUS',
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
        },
        txn,
      );

      const phoneCall2 = await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone3.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 13,
          callStatus,
          twilioPayload,
          callSid: 'CAide57a569adc67124a71a10f965BOGUS',
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
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

  describe('getByCallSid', () => {
    it('gets a phone call by a given call sid', async () => {
      const { phone, user } = await setup(txn);

      await PhoneCall.create(
        {
          userId: user.id,
          contactNumber: phone.phoneNumber,
          direction: 'toUser' as SmsMessageDirection,
          duration: 11,
          callStatus,
          twilioPayload,
          callSid,
          twilioCreatedAt: timestamp,
          twilioUpdatedAt: timestamp,
        },
        txn,
      );

      const fetchedCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(fetchedCall).toMatchObject({
        userId: user.id,
        contactNumber: phone.phoneNumber,
        patientId: null,
        duration: 11,
        callStatus,
        twilioPayload,
      });
    });

    it('returns null if no phone call for a given sid found', async () => {
      const fetchedCall = await PhoneCall.getByCallSid('CAide57a569adc67124a71a10f965BOGUS', txn);
      expect(fetchedCall).toBeNull();
    });
  });
});
