import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  createCBO,
  createCBOReferral,
  createMockClinic,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
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

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('CBO Referral create', () => {
    it('creates a CBO referral', async () => {
      const { user } = await setup(txn);
      const cbo = await createCBO(txn);

      const mutation = `mutation {
          CBOReferralCreate(input: {
            categoryId: "${cbo.categoryId}"
            CBOId: "${cbo.id}"
            diagnosis: "${diagnosis}"
          }) {
            categoryId
            CBOId
            diagnosis
          }
        }`;

      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        txn,
      });

      expect(result.data!.CBOReferralCreate).toMatchObject({
        categoryId: cbo.categoryId,
        CBOId: cbo.id,
        diagnosis,
      });
    });
  });

  describe('CBO Referral edit', () => {
    it('edits a CBO referral and creates associated task events', async () => {
      const taskTitle = 'Defeat Night King';
      const goalTitle = 'Save the world';

      const { user, clinic } = await setup(txn);
      const cboReferral = await createCBOReferral(txn);
      expect(cboReferral.sentAt).toBeFalsy();
      const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
      const patientGoal = await PatientGoal.create(
        {
          userId: user.id,
          patientId: patient.id,
          title: goalTitle,
        },
        txn,
      );

      const task = await Task.create(
        {
          title: taskTitle,
          patientId: patient.id,
          CBOReferralId: cboReferral.id,
          patientGoalId: patientGoal.id,
          createdById: user.id,
        },
        txn,
      );

      const mutation = `mutation {
          CBOReferralEdit(input: {
            CBOReferralId: "${cboReferral.id}"
            taskId: "${task.id}"
            sentAt: "${sentAt}"
          }) {
            id
            sentAt
          }
        }`;

      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        txn,
      });
      expect(result.data!.CBOReferralEdit).toMatchObject({
        id: cboReferral.id,
      });
      expect(result.data!.CBOReferralEdit.sentAt).toBeTruthy();

      const taskEvents = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );

      expect(taskEvents.results.length).toBe(1);
      expect(taskEvents.results[0]).toMatchObject({
        taskId: task.id,
        userId: user.id,
        eventType: 'cbo_referral_edit_sent_at',
      });
    });
  });
});
