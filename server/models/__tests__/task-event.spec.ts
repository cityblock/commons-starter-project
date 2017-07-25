import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Task from '../task';
import TaskEvent from '../task-event';
import User from '../user';

const userRole = 'physician';

describe('task event model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task event', async () => {
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
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(taskEvent).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(await TaskEvent.get(taskEvent.id)).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(taskEvent.deletedAt).toBeUndefined();
    expect(taskEvent.createdAt).not.toBeNull();
    expect(taskEvent.updatedAt).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(TaskEvent.get(fakeId))
      .rejects
      .toMatch('No such taskEvent: fakeId');
  });

  it('fetches all not deleted task events for a task', async () => {
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

    await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
    });
    const toBeDeletedEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_comment',
    });

    // Make sure all events are returned
    expect(await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 })).toMatchObject({
      results: [{
        eventType: 'edit_comment',
      }, {
        eventType: 'add_comment',
      }],
      total: 2,
    });

    await TaskEvent.delete(toBeDeletedEvent.id);

    // Make sure deleted event isn't returned
    expect(await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 })).toMatchObject({
      results: [{ eventType: 'add_comment' }],
      total: 1,
    });
  });

  it('fetches all not deleted task events for a user', async () => {
    const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    const user2 = await User.create({ email: 'b@c.com', userRole, homeClinicId: '1' });
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

    await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
    });
    await TaskEvent.create({
      taskId: task.id,
      userId: user2.id,
      eventType: 'delete_comment',
    });
    const toBeDeletedEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_comment',
    });

    // Make sure all events are returned
    expect(
      await TaskEvent.getUserTaskEvents(user.id, { pageNumber: 0, pageSize: 10 }),
    ).toMatchObject({
      results: [{
        eventType: 'edit_comment',
      }, {
        eventType: 'add_comment',
      }],
      total: 2,
    });

    await TaskEvent.delete(toBeDeletedEvent.id);

    // Make sure deleted event isn't returned
    expect(
      await TaskEvent.getUserTaskEvents(user.id, { pageNumber: 0, pageSize: 10 }),
    ).toMatchObject({
      results: [{ eventType: 'add_comment' }],
      total: 1,
    });
  });

  it('deletes a task event', async () => {
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

    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'complete_task',
    });

    expect(await TaskEvent.delete(taskEvent.id)).toMatchObject({
      userId: user.id,
    });

    expect(await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 })).toMatchObject({
      results: [],
      total: 0,
    });
  });
});
