import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createCBOReferral,
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  setupUrgentTasks,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Concern from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import Task from '../task';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';
const order = 'asc';
const orderBy = 'createdAt';
const pageNumber = 0;
const pageSize = 10;

interface ISetup {
  patientGoal: PatientGoal;
  user: User;
  patient: Patient;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
  const patientGoal = await PatientGoal.create(
    {
      title: 'patient goal',
      patientId: patient.id,
      userId: user.id,
    },
    txn,
  );
  return { patientGoal, clinic, user, patient };
}

describe('task model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      expect(task).toMatchObject({
        id: task.id,
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });
      expect(task.createdAt).not.toBeFalsy();
      expect(task.completedAt).toBeFalsy();
      expect(task.updatedAt).not.toBeFalsy();
    });
  });

  it('should get associated concern if there is one', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const title = 'Sandslash';
      const concern = await Concern.create({ title }, txn);
      const patientConcern = await PatientConcern.create(
        {
          concernId: concern.id,
          userId: user.id,
          patientId: patient.id,
        },
        txn,
      );

      await PatientGoal.update(
        patientGoal.id,
        {
          patientConcernId: patientConcern.id,
        },
        user.id,
        txn,
      );

      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'Sandshrew',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      expect(task.patientGoal.patientConcern!.concern).toBeTruthy();
      expect(task.patientGoal.patientConcern!.concern.title).toBe(title);
    });
  });

  it('should create and retrieve a task with an associated CBO referral', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);
      const cboReferral = await createCBOReferral(txn);

      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
          CBOReferralId: cboReferral.id,
        },
        txn,
      );

      expect(task.CBOReferral!.id).toBe(cboReferral.id);

      const fetchedTask = await Task.get(task.id, txn);

      expect(fetchedTask.CBOReferral!.id).toBe(cboReferral.id);
      expect(fetchedTask.CBOReferral!.category.id).toBe(cboReferral.categoryId);
      expect(fetchedTask.CBOReferral!.CBO!.id).toBe(cboReferral.CBOId);
    });
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(Task.knex(), async txn => {
      const fakeId = uuid();
      await expect(Task.get(fakeId, txn)).rejects.toMatch(`No such task: ${fakeId}`);
    });
  });

  it('should update task', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      expect(
        await Task.update(
          task.id,
          {
            completedById: user.id,
          },
          txn,
        ),
      ).toMatchObject({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        completedById: user.id,
      });
    });
  });

  it('fetches all not deleted tasks', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const dueAt = new Date().toISOString();
      const task1 = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      const task2 = await Task.create(
        {
          title: 'title 2',
          description: 'description 2',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      // should not include the deleted task
      const deletedTask = await Task.create(
        {
          title: 'deleted',
          description: 'deleted',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      await Task.delete(deletedTask.id, txn);

      // should not include the deleted task that the user is following
      const deletedFollowedTask = await Task.create(
        {
          title: 'deleted',
          description: 'deleted',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      await TaskFollower.followTask({ userId: user.id, taskId: deletedFollowedTask.id }, txn);
      await Task.delete(deletedFollowedTask.id, txn);

      const patientTasks = await Task.getPatientTasks(
        patient.id,
        {
          pageNumber,
          pageSize,
          order,
          orderBy,
        },
        txn,
      );
      const patientTaskIds = patientTasks.results.map(t => t.id);

      expect(patientTasks.total).toEqual(2);
      expect(patientTaskIds).toContain(task1.id);
      expect(patientTaskIds).toContain(task2.id);
    });
  });

  it('fetches a limited set of tasks', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const dueAt = new Date().toISOString();
      await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      await Task.create(
        {
          title: 'title 2',
          description: 'description 2',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      expect(
        await Task.getPatientTasks(patient.id, { pageNumber: 0, pageSize: 1, order, orderBy }, txn),
      ).toMatchObject({
        results: [
          {
            title: 'title 2',
            description: 'description 2',
          },
        ],
        total: 2,
      });
      expect(
        await Task.getPatientTasks(patient.id, { pageNumber: 1, pageSize: 1, order, orderBy }, txn),
      ).toMatchObject({
        results: [
          {
            title: 'title',
            description: 'description',
          },
        ],
        total: 2,
      });
    });
  });

  it('fetches a user tasks tasks', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal, clinic } = await setup(txn);

      const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
      const dueAt = new Date().toISOString();
      await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          priority: 'low',
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      const task2 = await Task.create(
        {
          title: 'title 2',
          description: 'description 2',
          dueAt,
          patientId: patient.id,
          createdById: user2.id,
          assignedToId: user.id,
          priority: 'high',
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      await TaskFollower.followTask({ userId: user.id, taskId: task2.id }, txn);
      expect(
        await Task.getUserTasks(user.id, { pageNumber: 0, pageSize: 2, order, orderBy }, txn),
      ).toMatchObject({
        results: [
          {
            title: 'title',
            description: 'description',
            priority: 'low',
          },
          {
            title: 'title 2',
            description: 'description 2',
            priority: 'high',
          },
        ],
        total: 2,
      });
    });
  });

  it('completes a task', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      expect(await Task.complete(task.id, user.id, txn)).toMatchObject({
        completedById: user.id,
      });
    });
  });

  it('uncompletes a task', async () => {
    await transaction(Task.knex(), async txn => {
      const { patient, user, patientGoal } = await setup(txn);

      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          patientGoalId: patientGoal.id,
        },
        txn,
      );

      await Task.complete(task.id, user.id, txn);
      const fetchedTask = await Task.get(task.id, txn);
      expect(fetchedTask.completedAt).not.toBeFalsy();

      expect(await Task.uncomplete(task.id, user.id, txn)).toMatchObject({
        completedAt: null,
      });
    });
  });

  it('returns task ids that have notifications', async () => {
    await transaction(Task.knex(), async txn => {
      const { user, user2, task } = await setupUrgentTasks(txn);
      const result = await Task.getTaskIdsWithNotifications(user.id, txn);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(task.id);

      const result2 = await Task.getTaskIdsWithNotifications(user2.id, txn);
      expect(result2.length).toBe(1);
      expect(result[0].id).toBe(task.id);
    });
  });

  describe('urgent tasks for patient dashboard', () => {
    it('returns tasks that are due soon', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient1, user, patient5 } = await setupUrgentTasks(txn);
        const result = await Task.getTasksDueSoonForPatient(patient1.id, user.id, txn);

        expect(result.length).toBe(1);
        expect(result[0]).toMatchObject({
          patientId: patient1.id,
          assignedToId: user.id,
        });

        const result2 = await Task.getTasksDueSoonForPatient(patient5.id, user.id, txn);
        expect(result2.length).toBe(0);
      });
    });

    it('returns tasks that have notifications', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient1, user, patient5, task } = await setupUrgentTasks(txn);
        const result = await Task.getTasksWithNotificationsForPatient(patient1.id, user.id, txn);

        expect(result.length).toBe(0);

        const result2 = await Task.getTasksWithNotificationsForPatient(patient5.id, user.id, txn);
        expect(result2.length).toBe(1);
        expect(result2[0].id).toBe(task.id);
      });
    });
  });
});
