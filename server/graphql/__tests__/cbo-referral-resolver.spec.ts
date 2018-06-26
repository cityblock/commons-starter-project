import { graphql, print } from 'graphql';
import kue from 'kue';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import cboReferralCreate from '../../../app/graphql/queries/cbo-referral-create-mutation.graphql';
import cboReferralEdit from '../../../app/graphql/queries/cbo-referral-edit-mutation.graphql';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import {
  createCBO,
  createCBOReferral,
  createMockClinic,
  createMockUser,
  createPatient,
  createTask,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const queue = kue.createQueue();

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';
const sentAt = '2018-01-11T05:00:00.000Z';
const diagnosis = 'Winter is here';

const setup = async (trx: Transaction) => {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);

  return { user, clinic };
};

describe('CBO Referral resolver', () => {
  let txn = null as any;
  const cboReferralCreateMutation = print(cboReferralCreate);
  const cboReferralEditMutation = print(cboReferralEdit);

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  describe('CBO Referral create', () => {
    it('creates a CBO referral', async () => {
      const { user } = await setup(txn);
      const cbo = await createCBO(txn);

      const result = await graphql(
        schema,
        cboReferralCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          categoryId: cbo.categoryId,
          CBOId: cbo.id,
          diagnosis,
        },
      );

      expect(result.data!.CBOReferralCreate).toMatchObject({
        categoryId: cbo.categoryId,
        CBOId: cbo.id,
        diagnosis,
      });
    });
  });

  describe('CBO Referral edit', () => {
    it('edits a CBO referral and creates associated task events', async () => {
      const { user, clinic } = await setup(txn);
      const cboReferral = await createCBOReferral(txn);
      expect(cboReferral.sentAt).toBeFalsy();
      const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
      const laterDueDate = '2050-11-07T13:45:14.532Z';
      const task = await createTask(
        {
          patientId: patient.id,
          cboReferralId: cboReferral.id,
          userId: user.id,
          dueAt: laterDueDate,
        },
        txn,
      );

      const result = await graphql(
        schema,
        cboReferralEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          CBOReferralId: cboReferral.id,
          taskId: task.id,
          sentAt,
        },
      );
      expect(result.data!.CBOReferralEdit).toMatchObject({
        id: cboReferral.id,
      });
      expect(result.data!.CBOReferralEdit.sentAt).toBeTruthy();

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        taskId: task.id,
        userId: user.id,
        eventType: 'cbo_referral_edit_sent_at',
      });
    });
  });
});
