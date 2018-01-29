import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import CBOReferral from '../../models/cbo-referral';
import Clinic from '../../models/clinic';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  createCBO,
  createCBOReferral,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const sentAt = '2018-01-11T05:00:00.000Z';
const diagnosis = 'Winter is here';

const setup = async (txn: Transaction) => {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

  return { user, clinic };
};

describe('CBO Referral resolver', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('CBO Referral create', () => {
    it('creates a CBO referral', async () => {
      await transaction(CBOReferral.knex(), async txn => {
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
          userRole,
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
  });

  describe('CBO Referral edit', () => {
    it('edits a CBO referral and creates associated task events', async () => {
      await transaction(CBOReferral.knex(), async txn => {
        const taskTitle = 'Defeat Night King';
        const goalTitle = 'Save the world';

        const { user, clinic } = await setup(txn);
        const cboReferral = await createCBOReferral(txn);
        expect(cboReferral.sentAt).toBeFalsy();
        const patient = await createPatient(createMockPatient(11, clinic.id), user.id, txn);
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
          userRole,
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
});
