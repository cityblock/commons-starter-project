import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientPhone from '../../models/patient-phone';
import Phone from '../../models/phone';
import PhoneCall, { CallStatus } from '../../models/phone-call';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPhone,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import TwilioClient from '../../twilio-client';
import { createPhoneCall, deletePhoneCall, processPhoneCall } from '../phone-call-consumer';

const callSid = 'CAfbe57a569adc67124a71a10f965BOGUS';
const twilioSimId = 'BOGUS5f14990BOGUS580c2a54713dBOGUS';
const fullSimId = `sim:${twilioSimId}`;

const userPhone = '+13452343456';
const otherPhone = '+12343458888';

const timestamp = new Date();

interface ISetup {
  user: User;
  phone: Phone;
  patient: Patient;
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

  return { user: updatedUser, phone, patient };
}

describe('Phone Call Consumer', () => {
  let txn = null as any;
  let removeCall = null as any;

  beforeEach(async () => {
    txn = await transaction.start(PhoneCall.knex());
    removeCall = jest.fn();

    TwilioClient.get = jest.fn().mockReturnValue({
      calls: (sid: string) => ({
        remove: removeCall,
      }),
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('processPhoneCall', () => {
    it('stores record of call and deletes it', async () => {
      const { user, phone, patient } = await setup(txn);

      const call = {
        parentCallSid: callSid,
        to: fullSimId,
        from: phone.phoneNumber,
        duration: '11',
        dateCreated: timestamp,
        dateUpdated: timestamp,
        status: 'completed' as CallStatus,
        sid: 'childSid',
      };

      await processPhoneCall(call, txn);

      const phoneCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(phoneCall).toMatchObject({
        direction: 'toUser',
        userId: user.id,
        patientId: patient.id,
        duration: 11,
        contactNumber: phone.phoneNumber,
        callStatus: 'completed',
      });

      expect(removeCall).toBeCalled();
    });

    it('only deletes intermediate parent call', async () => {
      const { phone } = await setup(txn);

      const call = {
        parentCallSid: null,
        to: fullSimId,
        from: phone.phoneNumber,
        duration: '11',
        dateCreated: timestamp,
        dateUpdated: timestamp,
        status: 'completed' as CallStatus,
        sid: 'childSid',
      };

      await processPhoneCall(call, txn);

      const phoneCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(phoneCall).toBeNull();
      expect(removeCall).toBeCalled();
    });

    it('does nothing if call in progress', async () => {
      const { phone } = await setup(txn);

      const call = {
        parentCallSid: callSid,
        to: fullSimId,
        from: phone.phoneNumber,
        duration: '11',
        dateCreated: timestamp,
        dateUpdated: timestamp,
        status: 'in-progress' as CallStatus,
        sid: 'childSid',
      };

      await processPhoneCall(call, txn);

      const phoneCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(phoneCall).toBeNull();
      expect(removeCall).not.toBeCalled();
    });
  });

  describe('createPhoneCall', () => {
    it('creates inbound phone call', async () => {
      const { user, phone, patient } = await setup(txn);

      const call = {
        parentCallSid: callSid,
        to: fullSimId,
        from: phone.phoneNumber,
        duration: '11',
        dateCreated: timestamp,
        dateUpdated: timestamp,
        status: 'completed' as CallStatus,
        sid: 'childSid',
      };

      await createPhoneCall(call, txn);

      const phoneCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(phoneCall).toMatchObject({
        direction: 'toUser',
        userId: user.id,
        patientId: patient.id,
        duration: 11,
        contactNumber: phone.phoneNumber,
        callStatus: 'completed',
      });
    });

    it('creates outbound phone call', async () => {
      const { user, phone, patient } = await setup(txn);

      const call = {
        parentCallSid: callSid,
        to: phone.phoneNumber,
        from: userPhone,
        duration: '11',
        dateCreated: timestamp,
        dateUpdated: timestamp,
        status: 'completed' as CallStatus,
        sid: 'childSid',
      };

      await createPhoneCall(call, txn);

      const phoneCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(phoneCall).toMatchObject({
        direction: 'fromUser',
        userId: user.id,
        patientId: patient.id,
        duration: 11,
        contactNumber: phone.phoneNumber,
        callStatus: 'completed',
      });
    });

    it('creates phone call not associated with patient', async () => {
      const { user } = await setup(txn);

      const call = {
        parentCallSid: callSid,
        to: otherPhone,
        from: userPhone,
        duration: '11',
        dateCreated: timestamp,
        dateUpdated: timestamp,
        status: 'completed' as CallStatus,
        sid: 'childSid',
      };

      await createPhoneCall(call, txn);

      const phoneCall = await PhoneCall.getByCallSid(callSid, txn);

      expect(phoneCall).toMatchObject({
        direction: 'fromUser',
        userId: user.id,
        patientId: null,
        duration: 11,
        contactNumber: otherPhone,
        callStatus: 'completed',
      });
    });

    describe('deletePhoneCall', () => {
      it('makes a request to delete phone call from Twilio', async () => {
        const sid = 'FAKE_SID';

        await deletePhoneCall(sid);

        expect(removeCall).toBeCalled();
      });
    });
  });
});
