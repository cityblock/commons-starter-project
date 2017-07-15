import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Task from '../task';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

describe('task model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task', async () => {
    const user = await User.create({
      email: 'care@care.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId: '1',
    });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    expect(task).toMatchObject({
      id: task.id,
      title: 'title',
      description: 'description',
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    expect(task.createdAt).not.toBeNull();
    expect(task.completedAt).toBeNull();
    expect(task.updatedAt).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(Task.get(fakeId))
      .rejects
      .toMatch('No such task: fakeId');
  });

  it('should update task', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    expect(await Task.update(task.id, {
      completedById: user.id,
    })).toMatchObject({
      title: 'title',
      description: 'description',
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      completedById: user.id,
    });
  });

  it('fetches all not deleted tasks', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    await Task.create({
      title: 'title 2',
      description: 'description 2',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    // should not include the deleted comment
    const deletedTask = await Task.create({
      title: 'deleted',
      description: 'deleted',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    await Task.delete(deletedTask.id);

    expect(await Task.getPatientTasks(patient.id, { pageNumber: 0, pageSize: 10 })).toMatchObject(
      {
        results: [{
          title: 'title',
          description: 'description',
        }, {
          title: 'title 2',
          description: 'description 2',
        }],
        total: 2,
      },
    );
  });

  it('fetches a limited set of tasks', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    await Task.create({
      title: 'title 2',
      description: 'description 2',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    expect(await Task.getPatientTasks(patient.id, { pageNumber: 0, pageSize: 1 })).toMatchObject(
      {
        results: [{
          title: 'title',
          description: 'description',
        }],
        total: 2,
      },
    );
    expect(await Task.getPatientTasks(patient.id, { pageNumber: 1, pageSize: 1 })).toMatchObject(
      {
        results: [{
          title: 'title 2',
          description: 'description 2',
        }],
        total: 2,
      },
    );
  });

  it('fetches a user tasks tasks', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const user2 = await User.create({ email: 'b@a.com', userRole, homeClinicId: '1' });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
    });
    const task2 = await Task.create({
      title: 'title 2',
      description: 'description 2',
      dueAt,
      patientId: patient.id,
      createdById: user2.id,
      assignedToId: user.id,
      priority: 'high',
    });
    await TaskFollower.followTask({ userId: user.id, taskId: task2.id });
    expect(await Task.getUserTasks(user.id, { pageNumber: 0, pageSize: 2 })).toMatchObject(
      {
        results: [{
          title: 'title',
          description: 'description',
          priority: 'low',
        }, {
          title: 'title 2',
          description: 'description 2',
          priority: 'high',
        }],
        total: 2,
      },
    );
  });

  it('completes a task', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    expect(await Task.complete(task.id, user.id)).toMatchObject({
      completedById: user.id,
    });
  });

  it('uncompletes a task', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    await Task.complete(task.id, user.id);
    const fetchedTask = await Task.get(task.id);
    expect(fetchedTask.completedAt).not.toBeNull();

    expect(await Task.uncomplete(task.id, user.id)).toMatchObject({
      completedAt: null,
    });
  });
});
