import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockPatient, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import Task from '../task';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

describe('task followers', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('modify followers', () => {
    it('user follows a task', async () => {
      await transaction(User.knex(), async txn => {
        const clinic = await Clinic.create(createMockClinic(), txn);
        const user1 = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
        const patient1 = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        const task1 = await Task.create(
          {
            title: 'title',
            description: 'description',
            patientId: patient1.id,
            createdById: user1.id,
            assignedToId: user1.id,
          },
          txn,
        );

        // Add 2nd user to task 1 followers
        await TaskFollower.followTask(
          {
            userId: user2.id,
            taskId: task1.id,
          },
          txn,
        );

        const fetchedTask = await Task.get(task1.id, txn);
        expect(fetchedTask.createdById).toEqual(user1.id);
        expect(fetchedTask.followers[0].id).toEqual(user2.id);
      });
    });

    it('throws an error if adding a non-existant user to a task', async () => {
      await transaction(User.knex(), async txn => {
        const clinic = await Clinic.create(createMockClinic(), txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        const task = await Task.create(
          {
            title: 'title',
            description: 'description',
            patientId: patient.id,
            createdById: user.id,
            assignedToId: user.id,
          },
          txn,
        );

        const error =
          'insert into "task_follower" ("id", "taskId", "updatedAt", "userId") values ($1, $2, $3, $4) returning "id" - insert or update on table "task_follower" violates foreign key constraint "task_follower_userid_foreign"';

        await expect(
          TaskFollower.followTask({ userId: uuid(), taskId: task.id }, txn),
        ).rejects.toMatchObject(new Error(error));
      });
    });

    it('can remove a user from a followed tasks', async () => {
      await transaction(User.knex(), async txn => {
        const clinic = await Clinic.create(createMockClinic(), txn);
        const user = await User.create(
          createMockUser(11, clinic.id, userRole, 'care@care.com'),
          txn,
        );
        const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
        const task = await Task.create(
          {
            title: 'title',
            description: 'description',
            patientId: patient.id,
            createdById: user.id,
            assignedToId: user.id,
          },
          txn,
        );

        await TaskFollower.followTask(
          {
            userId: user.id,
            taskId: task.id,
          },
          txn,
        );
        const followedTask = await Task.get(task.id, txn);
        expect(followedTask.followers[0].id).toEqual(user.id);

        // refollow the same task
        await TaskFollower.followTask(
          {
            userId: user.id,
            taskId: task.id,
          },
          txn,
        );
        const reFollowedTask = await Task.get(task.id, txn);
        expect(reFollowedTask.followers[0].id).toEqual(user.id);

        await TaskFollower.unfollowTask(
          {
            userId: user.id,
            taskId: task.id,
          },
          txn,
        );
        const unfollowedTask = await Task.get(task.id, txn);
        expect(unfollowedTask.followers).toEqual([]);
      });
    });
  });
});
