import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
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

describe('task model', () => {
  let patientGoal: PatientGoal;
  let user: User;
  let patient: Patient;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    patientGoal = await PatientGoal.create({
      title: 'patient goal',
      patientId: patient.id,
      userId: user.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task', async () => {
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });
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

  it('should get associated concern if there is one', async () => {
    const title = 'Sandslash';
    const concern = await Concern.create({ title });
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      userId: user.id,
      patientId: patient.id,
    });

    await PatientGoal.update(
      patientGoal.id,
      {
        patientConcernId: patientConcern.id,
      },
      user.id,
    );

    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'Sandshrew',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });

    expect(task.patientGoal.patientConcern!.concern).toBeTruthy();
    expect(task.patientGoal.patientConcern!.concern.title).toBe(title);
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(Task.get(fakeId)).rejects.toMatch(`No such task: ${fakeId}`);
  });

  it('should update task', async () => {
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });
    expect(
      await Task.update(task.id, {
        completedById: user.id,
      }),
    ).toMatchObject({
      title: 'title',
      description: 'description',
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      completedById: user.id,
    });
  });

  it('fetches all not deleted tasks', async () => {
    const dueAt = new Date().toISOString();
    await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });

    await Task.create({
      title: 'title 2',
      description: 'description 2',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });

    // should not include the deleted task
    const deletedTask = await Task.create({
      title: 'deleted',
      description: 'deleted',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });
    await Task.delete(deletedTask.id);

    // should not include the deleted task that the user is following
    const deletedFollowedTask = await Task.create({
      title: 'deleted',
      description: 'deleted',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });
    await TaskFollower.followTask({ userId: user.id, taskId: deletedFollowedTask.id });
    await Task.delete(deletedFollowedTask.id);

    expect(
      await Task.getPatientTasks(patient.id, {
        pageNumber,
        pageSize,
        order,
        orderBy,
      }),
    ).toMatchObject({
      results: [
        {
          title: 'title',
          description: 'description',
        },
        {
          title: 'title 2',
          description: 'description 2',
        },
      ],
      total: 2,
    });
  });

  it('fetches a limited set of tasks', async () => {
    const dueAt = new Date().toISOString();
    await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });

    await Task.create({
      title: 'title 2',
      description: 'description 2',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });
    expect(
      await Task.getPatientTasks(patient.id, { pageNumber: 0, pageSize: 1, order, orderBy }),
    ).toMatchObject({
      results: [
        {
          title: 'title',
          description: 'description',
        },
      ],
      total: 2,
    });
    expect(
      await Task.getPatientTasks(patient.id, { pageNumber: 1, pageSize: 1, order, orderBy }),
    ).toMatchObject({
      results: [
        {
          title: 'title 2',
          description: 'description 2',
        },
      ],
      total: 2,
    });
  });

  it('fetches a user tasks tasks', async () => {
    const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
    const dueAt = new Date().toISOString();
    await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
      patientGoalId: patientGoal.id,
    });
    const task2 = await Task.create({
      title: 'title 2',
      description: 'description 2',
      dueAt,
      patientId: patient.id,
      createdById: user2.id,
      assignedToId: user.id,
      priority: 'high',
      patientGoalId: patientGoal.id,
    });
    await TaskFollower.followTask({ userId: user.id, taskId: task2.id });
    expect(
      await Task.getUserTasks(user.id, { pageNumber: 0, pageSize: 2, order, orderBy }),
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

  it('completes a task', async () => {
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });

    expect(await Task.complete(task.id, user.id)).toMatchObject({
      completedById: user.id,
    });
  });

  it('uncompletes a task', async () => {
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      patientGoalId: patientGoal.id,
    });

    await Task.complete(task.id, user.id);
    const fetchedTask = await Task.get(task.id);
    expect(fetchedTask.completedAt).not.toBeFalsy();

    expect(await Task.uncomplete(task.id, user.id)).toMatchObject({
      completedAt: null,
    });
  });
});
