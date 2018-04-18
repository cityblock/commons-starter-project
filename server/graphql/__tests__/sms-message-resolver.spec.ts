import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import * as getSmsMessageLatest from '../../../app/graphql/queries/get-sms-message-latest.graphql';
import * as getSmsMessages from '../../../app/graphql/queries/get-sms-messages.graphql';
import * as smsMessageCreate from '../../../app/graphql/queries/sms-message-create-mutation.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
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

jest.mock('../../twilio-client');

const userRole = 'admin';
const userPhone = '+11234445555';
const body1 = 'Winter is coming.';
const body2 = 'Winter is here.';
const mockTwilioPayload = {
  From: userPhone,
  To: '+11234567890',
  body: body1,
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
  const phone = await Phone.create(createMockPhone('123-456-7890', 'mobile'), txn);
  await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);

  return { patient, user, clinic, phone };
}

describe('SMS Message Resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;
  let db: Db;
  const getSmsMessagesQuery = print(getSmsMessages);
  const getSmsMessageLatestQuery = print(getSmsMessageLatest);
  const smsMessageCreateMutation = print(smsMessageCreate);

  beforeEach(async () => {
    db = await Db.get();
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

  afterAll(async () => {
    await Db.release();
  });

  describe('resolveSmsMessages', () => {
    it('returns SMS messages between a given patient and user', async () => {
      const { patient, user } = await setup(txn);

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser',
          body: body1,
          twilioPayload: {},
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234565555',
          direction: 'toUser',
          body: 'Not from patient',
          twilioPayload: {},
        },
        txn,
      );

      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser',
          body: body2,
          twilioPayload: {},
        },
        txn,
      );

      const result = await graphql(
        schema,
        getSmsMessagesQuery,
        null,
        {
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
        },
        { patientId: patient.id, pageNumber: 0, pageSize: 5 },
      );

      expect(result.data!.smsMessages.totalCount).toBe(2);
      expect(result.data!.smsMessages.edges[0].node).toMatchObject({
        body: body2,
        userId: user.id,
        patientId: patient.id,
        direction: 'toUser',
      });
      expect(result.data!.smsMessages.edges[1].node).toMatchObject({
        body: body1,
        userId: user.id,
        patientId: patient.id,
        direction: 'toUser',
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
          direction: 'toUser',
          body: body1,
          twilioPayload: {},
        },
        txn,
      );
      await SmsMessage.create(
        {
          userId: user.id,
          contactNumber: '+11234567890',
          direction: 'toUser',
          body: body2,
          twilioPayload: {},
        },
        txn,
      );

      const result = await graphql(
        schema,
        getSmsMessageLatestQuery,
        null,
        {
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
        },
        { patientId: patient.id },
      );

      expect(result.data!.smsMessageLatest).toMatchObject({
        userId: user.id,
        patientId: patient.id,
        direction: 'toUser',
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
          direction: 'toUser',
          body: 'Not from patient',
          twilioPayload: {},
        },
        txn,
      );

      const result = await graphql(
        schema,
        getSmsMessageLatestQuery,
        null,
        {
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
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
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
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
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
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
      await PatientInfo.edit(
        { canReceiveTexts: true, updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
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
      await PatientInfo.edit(
        { canReceiveTexts: true, updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone('123-456-7777', 'mobile'), txn);
      await PatientPhone.create({ phoneId: phone2.id, patientId: patient.id }, txn);

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
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
      await PatientInfo.edit(
        { canReceiveTexts: true, updatedById: user.id },
        patient.patientInfo.id,
        txn,
      );
      await PatientPhone.delete({ patientId: patient.id, phoneId: phone.id }, txn);

      const phone2 = await Phone.create(createMockPhone('123-456-7777', 'home'), txn);
      await PatientPhone.create({ phoneId: phone2.id, patientId: patient.id }, txn);
      await SmsMessage.create(
        {
          userId: user.id,
          body: body2,
          contactNumber: '+11234567777',
          direction: 'toUser',
          twilioPayload: mockTwilioPayload,
        },
        txn,
      );

      const result = await graphql(
        schema,
        smsMessageCreateMutation,
        null,
        {
          db,
          userId: user.id,
          permissions: 'blue',
          logger,
          txn,
        },
        { patientId: patient.id, body: body1 },
      );

      expect(result.errors![0].message).toBe(
        'This patient does not have a phone number set up to receive texts. Please edit their contact information if that is not correct.',
      );
    });
  });
});
