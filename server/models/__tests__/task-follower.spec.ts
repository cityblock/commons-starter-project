import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import PatientGoal from '../../models/patient-goal';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import Concern from '../concern';
import PatientConcern from '../patient-concern';
import Task from '../task';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

describe('task followers', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(TaskFollower.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('modify followers', () => {
    it('user follows a task', async () => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user1 = await User.create(
        createMockUser(11, clinic.id, userRole, 'care@care.com'),
        txn,
      );
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
      const patient1 = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient1.id,
          userId: user1.id,
        },
        txn,
      );
      const patientGoal = await PatientGoal.create(
        {
          patientId: patient1.id,
          title: 'goal title',
          userId: user2.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const task1 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient1.id,
          createdById: user1.id,
          assignedToId: user1.id,
          patientGoalId: patientGoal.id,
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

    it('throws an error if adding a non-existant user to a task', async () => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const patientGoal = await PatientGoal.create(
        {
          patientId: patient.id,
          title: 'goal title',
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      const error =
        'insert into "task_follower" ("createdAt", "id", "taskId", "updatedAt", "userId") values ($1, $2, $3, $4, $5) returning "id" - insert or update on table "task_follower" violates foreign key constraint "task_follower_userid_foreign"';

      await expect(
        TaskFollower.followTask({ userId: uuid(), taskId: task.id }, txn),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove a user from a followed tasks', async () => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole, 'care@care.com'), txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient.id,
          userId: user.id,
        },
        txn,
      );
      const patientGoal = await PatientGoal.create(
        {
          patientId: patient.id,
          title: 'goal title',
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
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

  describe('unfollowPatientTasks', () => {
    it('unfollows all tasks for a user for a patient', async () => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user1 = await User.create(
        createMockUser(11, clinic.id, userRole, 'care@care.com'),
        txn,
      );
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
      const patient1 = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const patient2 = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern1 = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient1.id,
          userId: user1.id,
        },
        txn,
      );
      const patientConcern2 = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient2.id,
          userId: user1.id,
        },
        txn,
      );

      const patientGoalForPatient1 = await PatientGoal.create(
        {
          patientId: patient1.id,
          title: 'goal title',
          userId: user1.id,
          patientConcernId: patientConcern1.id,
        },
        txn,
      );
      const patientGoalForPatient2 = await PatientGoal.create(
        {
          patientId: patient2.id,
          title: 'goal title',
          userId: user1.id,
          patientConcernId: patientConcern2.id,
        },
        txn,
      );
      const task1 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient1.id,
          createdById: user2.id,
          assignedToId: user2.id,
          patientGoalId: patientGoalForPatient1.id,
        },
        txn,
      );
      const task2 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient1.id,
          createdById: user2.id,
          assignedToId: user2.id,
          patientGoalId: patientGoalForPatient1.id,
        },
        txn,
      );
      const task3 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient2.id,
          createdById: user2.id,
          assignedToId: user2.id,
          patientGoalId: patientGoalForPatient2.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user1.id,
          taskId: task1.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user1.id,
          taskId: task2.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user1.id,
          taskId: task3.id,
        },
        txn,
      );
      const tasks = await Task.getAllUserPatientTasks(
        { userId: user1.id, patientId: patient1.id },
        txn,
      );
      const taskIds = tasks.map(task => task.id);
      const patient2Tasks = await Task.getAllUserPatientTasks(
        { userId: user1.id, patientId: patient2.id },
        txn,
      );
      const patient2TaskIds = patient2Tasks.map(task => task.id);
      expect(tasks).toHaveLength(2);
      expect(patient2Tasks).toHaveLength(1);
      expect(taskIds).toContain(task1.id);
      expect(taskIds).toContain(task2.id);
      expect(patient2TaskIds).toContain(task3.id);

      await TaskFollower.unfollowPatientTasks({ userId: user1.id, patientId: patient1.id }, txn);
      const refetchedTasks = await Task.getAllUserPatientTasks(
        { userId: user1.id, patientId: patient1.id },
        txn,
      );
      const refetchedPatient2Tasks = await Task.getAllUserPatientTasks(
        { userId: user1.id, patientId: patient2.id },
        txn,
      );
      expect(refetchedTasks).toHaveLength(0);
      expect(refetchedPatient2Tasks).toHaveLength(1);
    });

    it('unfollows all tasks for a user for a patient and adds a new follower', async () => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user1 = await User.create(
        createMockUser(11, clinic.id, userRole, 'care@care.com'),
        txn,
      );
      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
      const user3 = await User.create(createMockUser(11, clinic.id, userRole, 'c@d.com'), txn);
      const patient1 = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const patient2 = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, txn);
      const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
      const patientConcern1 = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient1.id,
          userId: user1.id,
        },
        txn,
      );
      const patientConcern2 = await PatientConcern.create(
        {
          concernId: concern.id,
          patientId: patient2.id,
          userId: user1.id,
        },
        txn,
      );

      const patientGoalForPatient1 = await PatientGoal.create(
        {
          patientId: patient1.id,
          title: 'goal title',
          userId: user1.id,
          patientConcernId: patientConcern1.id,
        },
        txn,
      );
      const patientGoalForPatient2 = await PatientGoal.create(
        {
          patientId: patient2.id,
          title: 'goal title',
          userId: user1.id,
          patientConcernId: patientConcern2.id,
        },
        txn,
      );

      const task1 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient1.id,
          createdById: user2.id,
          assignedToId: user2.id,
          patientGoalId: patientGoalForPatient1.id,
        },
        txn,
      );
      const task2 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient1.id,
          createdById: user2.id,
          assignedToId: user2.id,
          patientGoalId: patientGoalForPatient1.id,
        },
        txn,
      );
      const task3 = await Task.create(
        {
          title: 'title',
          description: 'description',
          patientId: patient2.id,
          createdById: user2.id,
          assignedToId: user2.id,
          patientGoalId: patientGoalForPatient2.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user1.id,
          taskId: task1.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user1.id,
          taskId: task2.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user1.id,
          taskId: task3.id,
        },
        txn,
      );
      await TaskFollower.followTask(
        {
          userId: user3.id,
          taskId: task1.id,
        },
        txn,
      );

      const user1Tasks = await Task.getAllUserPatientTasks(
        { userId: user1.id, patientId: patient1.id },
        txn,
      );
      const user1TaskIds = user1Tasks.map(task => task.id);
      const user3Tasks = await Task.getAllUserPatientTasks(
        { userId: user3.id, patientId: patient1.id },
        txn,
      );
      const user3TaskIds = user3Tasks.map(task => task.id);
      expect(user1Tasks).toHaveLength(2);
      expect(user1TaskIds).toContain(task1.id);
      expect(user1TaskIds).toContain(task2.id);
      expect(user3Tasks).toHaveLength(1);
      expect(user3TaskIds).toContain(task1.id);

      await TaskFollower.unfollowPatientTasks(
        { userId: user1.id, patientId: patient1.id, newFollowerId: user3.id },
        txn,
      );

      const refetchedUser1Tasks = await Task.getAllUserPatientTasks(
        { userId: user1.id, patientId: patient1.id },
        txn,
      );
      const refetchedUser3Tasks = await Task.getAllUserPatientTasks(
        { userId: user3.id, patientId: patient1.id },
        txn,
      );
      const refetchedUser3TaskIds = refetchedUser3Tasks.map(task => task.id);
      expect(refetchedUser1Tasks).toHaveLength(0);
      expect(refetchedUser3Tasks).toHaveLength(2);
      expect(refetchedUser3TaskIds).toContain(task1.id);
      expect(refetchedUser3TaskIds).toContain(task2.id);
    });
  });
});
