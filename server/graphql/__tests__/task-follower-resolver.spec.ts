import { graphql, print } from 'graphql';
import kue from 'kue';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import taskFollow from '../../../app/graphql/queries/task-user-follow-mutation.graphql';
import taskUnfollow from '../../../app/graphql/queries/task-user-unfollow-mutation.graphql';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

const queue = kue.createQueue();

interface ISetup {
  task: Task;
  user: User;
  clinic: Clinic;
  patient: Patient;
}

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 11, homeClinicId: clinic.id }, txn);
  const dueAt = new Date().toISOString();
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
      title: 'Task A Title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
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
  const taskFollowMutation = print(taskFollow);
  const taskUnfollowMutation = print(taskUnfollow);

  beforeAll(() => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
    queue.testMode.clear();
  });

  afterEach(async () => {
    await txn.rollback();
    txn = null;
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  describe('task followers', () => {
    it('adds and removes user to from task followers and creates TaskEvent models', async () => {
      const { user, task } = await setup(txn);
      const result = await graphql(
        schema,
        taskFollowMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { userId: user.id, taskId: task.id },
      );
      const taskFollowers = cloneDeep(result.data!.taskUserFollow.followers).map((u: any) => u.id);
      expect(taskFollowers).toContain(user.id);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        userId: user.id,
        taskId: task.id,
        eventType: 'add_follower',
        eventUserId: user.id,
      });

      // unfollow
      const unfollowResult = await graphql(
        schema,
        taskUnfollowMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { taskId: task.id, userId: user.id },
      );
      const taskFollowersUnfollowed = cloneDeep(
        unfollowResult.data!.taskUserUnfollow.followers,
      ).map((u: any) => u.id);
      expect(taskFollowersUnfollowed).not.toContain(user.id);

      expect(queue.testMode.jobs.length).toBe(2);
      expect(queue.testMode.jobs[1].data).toMatchObject({
        userId: user.id,
        taskId: task.id,
        eventType: 'remove_follower',
        eventUserId: user.id,
      });
    });
  });
});
