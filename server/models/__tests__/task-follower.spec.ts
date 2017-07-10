import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Task from '../task';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

describe('task followers', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('modify followers', () => {
    it('user follows a task', async () => {
      const user1 = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const user2 = await User.create({
        email: 'b@c.com',
        userRole,
        homeClinicId: '1',
      });
      const patient1 = await createPatient(createMockPatient(123), user1.id);
      const task1 = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient1.id,
        createdById: user1.id,
        assignedToId: user1.id,
      });

      // Add 2nd user to task 1 followers
      const taskFollower = await TaskFollower.followTask({
        userId: user2.id,
        taskId: task1.id,
      });
      expect(taskFollower[0].id).toEqual(user2.id);
    });

    it('throws an error if adding a non-existant user to a task', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      const task = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      const error = 'insert into "task_follower" ("id", "taskId", "userId") values ($1, $2, $3) '
        + 'returning "id" - insert or update on table "task_follower" violates foreign key '
        + 'constraint "task_follower_userid_foreign"';

      await expect(TaskFollower.followTask({ userId: 'fakeUserId', taskId: task.id }))
        .rejects
        .toMatchObject({
          message: error,
        });
    });

    it('can remove a user from a followed tasks', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      const task = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      const followedTasks = await TaskFollower.followTask({
        userId: user.id,
        taskId: task.id,
      });
      expect(followedTasks[0].id).toEqual(user.id);

      const unfollowedTasks = await TaskFollower.unfollowTask({
        userId: user.id,
        taskId: task.id,
      });
      expect(unfollowedTasks).toEqual([]);
    });

  });

  describe('get tasks for user', () => {
    it('should fetch limited set of users', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      const task1 = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      const task2 = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      await TaskFollower.followTask({
        userId: user.id,
        taskId: task1.id,
      });

      await TaskFollower.followTask({
        userId: user.id,
        taskId: task2.id,
      });

      const results1 = await TaskFollower.getForUser(user.id, { pageSize: 1, pageNumber: 0 });
      const results2 = await TaskFollower.getForUser(user.id, { pageSize: 1, pageNumber: 1 });
      expect(results1).toMatchObject({
        results: [{ id: task1.id }],
        total: 2,
      });
      expect(results2).toMatchObject({
        results: [{ id: task2.id }],
        total: 2,
      });
    });
  });

  describe('get users for task', () => {
    it('fetches user following task', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      const task = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      await TaskFollower.followTask({
        userId: user.id,
        taskId: task.id,
      });

      expect(await TaskFollower.getForTask(task.id)).toMatchObject([
        { id: user.id },
      ]);
    });
  });
});
