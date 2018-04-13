import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import * as getSmsMessages from '../../../app/graphql/queries/get-sms-messages.graphql';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
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
import schema from '../make-executable-schema';

const userRole = 'admin';
const body1 = 'Winter is coming.';
const body2 = 'Winter is here.';

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const phone = await Phone.create(createMockPhone(), txn);
  await PatientPhone.create({ phoneId: phone.id, patientId: patient.id }, txn);

  return { patient, user, clinic };
}

describe('SMS Message Resolver', () => {
  const log = jest.fn();
  const logger = { log };
  let txn = null as any;
  let db: Db;
  const getSmsMessagesQuery = print(getSmsMessages);

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
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
});
