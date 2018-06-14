import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { DocumentTypeOptions, PhoneTypeOptions, SmsMessageDirection, UserRole } from 'schema';
import * as getSmsMessageLatest from '../../../app/graphql/queries/get-sms-message-latest.graphql';
import * as getSmsMessages from '../../../app/graphql/queries/get-sms-messages.graphql';
import * as smsMessageCreate from '../../../app/graphql/queries/sms-message-create-mutation.graphql';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientDocument from '../../models/patient-document';
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
import schema from '../make-executable-schema';

const userRole = 'admin' as UserRole;
const userPhone = '+11234445555';
const body1 = 'Winter is coming.';
const body2 = 'Winter is here.';
const messageSid = 'CAfbe57a569adc67124a71a10f965BOGUS';
const mockTwilioPayload = {
  From: userPhone,
  To: '+11234567890',
  body: body1,
  sid: messageSid,
};

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(
    createMockPhone('123-456-7890', 'mobile' as PhoneTypeOptions),
    txn,
  );
  await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);

  return { patient, user, clinic, phone };
}

describe('SMS Message Resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;

  const getSmsMessagesQuery = print(getSmsMessages);
  const getSmsMessageLatestQuery = print(getSmsMessageLatest);
  const smsMessageCreateMutation = print(smsMessageCreate);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());

    TwilioClient.get = jest.fn().mockReturnValue({
      messages: {
        create: () => mockTwilioPayload,
      },
    });
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolveSmsMessages', () => {
    it('returns SMS messages between a given patient and user', async () => {
      const { patient, user } = await setup(txn);

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser' as SmsMessageDirection,
          body: body1,
          twilioPayload: {},
          messageSid,
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234565555',
          direction: 'toUser' as SmsMessageDirection,
          body: 'Not from patient',
          twilioPayload: {},
          messageSid: 'DBfbe57a569adc67124a71a10f965BOGUS',
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser' as SmsMessageDirection,
          body: body2,
          twilioPayload: {},
          messageSid: 'EFfbe57a569adc67124a71a10f965BOGUS',
        },
        txn,
      );

      const result = await graphql(
        schema,
        getSmsMessagesQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id, pageNumber: 0, pageSize: 5 },
      );

      expect(result.data!.smsMessages.totalCount).toBe(2);
      expect(result.data!.smsMessages.edges[0].node).toMatchObject({
        body: body2,
        userId: user.id,
        patientId: patient.id,
        direction: 'toUser' as SmsMessageDirection,
      });
      expect(result.data!.smsMessages.edges[1].node).toMatchObject({
        body: body1,
        userId: user.id,
        patientId: patient.id,
        direction: 'toUser' as SmsMessageDirection,
      });
    });
  });

  describe('resolveSmsMessageLatest', () => {
    it('returns latest SMS message between user and patient', async () => {
      const { patient, user, phone } = await setup(txn);

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser' as SmsMessageDirection,
          body: body1,
          twilioPayload: {},
          messageSid,
        },
        txn,
      );
      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser' as SmsMessageDirection,
          body: body2,
          twilioPayload: {},
          messageSid: 'DBfbe57a569adc67124a71a10f965BOGUS',
        },
        txn,
      );

      const result = await graphql(
        schema,
        getSmsMessageLatestQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );

      expect(result.data!.smsMessageLatest).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        direction: 'toUser' as SmsMessageDirection,
        body: body2,
        contactNumber: phone.phoneNumber,
      });
    });

    it('returns null if no SMS messages between user and patient', async () => {
      const { patient, user } = await setup(txn);

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234565555',
          direction: 'toUser' as SmsMessageDirection,
          body: 'Not from patient',
          twilioPayload: {},
          messageSid,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getSmsMessageLatestQuery,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id },
      );

      expect(result.data!.smsMessageLatest).toBeNull();
    });
  });

  describe('create SMS message', () => {
    it('does not create a SMS message if user has no phone number', async () => {
      const { patient, user } = await setup(txn);

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id, body: body1 },
      );

      expect(result.errors![0].message).toBe(
        'You do not have a phone number registered with Cityblock. Please contact us for help.',
      );
    });

    it('does not create a SMS message if patient did not consent to receive texts', async () => {
      const { patient, user } = await setup(txn);
      await User.update(user.id, { phone: userPhone }, txn);

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id, body: body1 },
      );

      expect(result.errors![0].message).toBe(
        'This patient has not consented to receive text messages.',
      );
    });

    it("texts patient's primary phone if it is mobile", async () => {
      const { patient, user } = await setup(txn);
      await User.update(user.id, { phone: userPhone }, txn);
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: '/lets/go/pikachu.png',
          documentType: 'textConsent' as DocumentTypeOptions,
        },
        txn,
      );

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id, body: body1 },
      );

      expect(result.data!.smsMessageCreate.node).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        contactNumber: '+11234567890',
        body: body1,
      });
    });

    it('texts mobile phone of patient if primary phone not mobile', async () => {
      const { patient, user, phone } = await setup(txn);
      await User.update(user.id, { phone: userPhone }, txn);
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(
        createMockPhone('123-456-7777', 'mobile' as PhoneTypeOptions),
        txn,
      );
      await PatientPhone.create({ phoneId: phone2.id, patientId: patient.id }, txn);
      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: '/lets/go/pikachu.png',
          documentType: 'textConsent' as DocumentTypeOptions,
        },
        txn,
      );

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id, body: body1 },
      );

      expect(result.data!.smsMessageCreate.node).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        contactNumber: '+11234567777',
        body: body1,
      });
    });

    it('does not text patient if no valid phone number set up', async () => {
      const { patient, user, phone } = await setup(txn);
      await User.update(user.id, { phone: userPhone }, txn);
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(
        createMockPhone('123-456-7777', 'home' as PhoneTypeOptions),
        txn,
      );

      await PatientDocument.create(
        {
          patientId: patient.id,
          uploadedById: user.id,
          filename: '/lets/go/pikachu.png',
          documentType: 'textConsent' as DocumentTypeOptions,
        },
        txn,
      );

      await PatientPhone.create({ phoneId: phone2.id, patientId: patient.id }, txn);
      await SmsMessage.create(
        {
          userId: user.id,
          body: body2,
          contactNumber: '+11234567777',
          direction: 'toUser' as SmsMessageDirection,
          twilioPayload: mockTwilioPayload,
          messageSid,
        },
        txn,
      );

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          userId: user.id,
          permissions: 'blue',
          logger,
          testTransaction: txn,
        },
        { patientId: patient.id, body: body1 },
      );

      expect(result.errors![0].message).toBe(
        'This patient does not have a phone number set up to receive texts. Please edit their contact information if that is not correct.',
      );
    });
  });
});
