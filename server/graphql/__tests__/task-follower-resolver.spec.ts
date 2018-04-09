import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  task: Task;
  user: User;
  clinic: Clinic;
  patient: Patient;
}

const userRole = 'physician';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
  const dueAt = new Date().toISOString();
  const task = await Task.create(
    {
      title: 'Task A Title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    },
    txn,
  );

  return {
    task,
    user,
    clinic,
    patient,
  };
}

describe('task follower', () => {
  let txn = null as any;
  let db: Db;

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

  describe('task followers', () => {
    it('adds and removes user to from task followers and creates TaskEvent models', async () => {
      const { user, task } = await setup(txn);
      const mutation = `mutation {
          taskUserFollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
            id
            followers { id }
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const taskFollowers = cloneDeep(result.data!.taskUserFollow.followers).map((u: any) => u.id);
      expect(taskFollowers).toContain(user.id);
      const taskEvents1 = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents1.total).toEqual(1);
      expect(taskEvents1.results[0].eventType).toEqual('add_follower');

      // unfollow
      const unfollowMutation = `mutation {
          taskUserUnfollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
            id
            followers { id }
          }
        }`;
      const unfollowResult = await graphql(schema, unfollowMutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const taskFollowersUnfollowed = cloneDeep(
        unfollowResult.data!.taskUserUnfollow.followers,
      ).map((u: any) => u.id);
      expect(taskFollowersUnfollowed).not.toContain(user.id);
      const taskEvents2 = await TaskEvent.getTaskEvents(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      expect(taskEvents2.total).toEqual(2);
      const eventTypes = taskEvents2.results.map(event => event.eventType);
      expect(eventTypes).toContain('add_follower');
      expect(eventTypes).toContain('remove_follower');
    });
  });
});
