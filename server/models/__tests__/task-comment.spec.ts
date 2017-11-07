import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Task from '../task';
import TaskComment from '../task-comment';
import User from '../user';

const userRole = 'physician';

describe('task comment model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    const taskComment = await TaskComment.create({
      taskId: task.id,
      userId: user.id,
      body: 'omg a comment',
    });
    expect(taskComment).toMatchObject({
      id: taskComment.id,
      body: 'omg a comment',
      taskId: task.id,
      userId: user.id,
    });
    expect(await TaskComment.get(taskComment.id)).toMatchObject({
      id: taskComment.id,
      body: 'omg a comment',
      taskId: task.id,
      userId: user.id,
    });
    expect(taskComment.deletedAt).toBeUndefined();
    expect(taskComment.createdAt).not.toBeNull();
    expect(taskComment.updatedAt).not.toBeNull();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(TaskComment.get(fakeId)).rejects.toMatch(`No such taskComment: ${fakeId}`);
  });

  it('should update a comment', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    const taskComment = await TaskComment.create({
      taskId: task.id,
      userId: user.id,
      body: 'omg a comment',
    });
    expect(await TaskComment.update(taskComment.id, 'a better comment')).toMatchObject({
      body: 'a better comment',
    });
  });

  it('fetches all not deleted comments for a task', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    await TaskComment.create({
      taskId: task.id,
      userId: user.id,
      body: 'omg a comment',
    });
    await TaskComment.create({
      taskId: task.id,
      userId: user.id,
      body: 'omg another comment',
    });

    // should not include the deleted comment
    const deletedComment = await TaskComment.create({
      taskId: task.id,
      userId: user.id,
      body: 'omg a deleted comment',
    });
    await TaskComment.delete(deletedComment.id);

    // Make sure deleted comment isn't returned
    expect(
      await TaskComment.getTaskComments(task.id, { pageNumber: 0, pageSize: 10 }),
    ).toMatchObject({
      results: [
        {
          body: 'omg another comment',
        },
        {
          body: 'omg a comment',
        },
      ],
      total: 2,
    });

    // Make sure pagination works correctly
    expect(
      await TaskComment.getTaskComments(task.id, { pageNumber: 0, pageSize: 1 }),
    ).toMatchObject({
      results: [
        {
          body: 'omg another comment',
        },
      ],
      total: 2,
    });
    expect(
      await TaskComment.getTaskComments(task.id, { pageNumber: 1, pageSize: 1 }),
    ).toMatchObject({
      results: [
        {
          body: 'omg a comment',
        },
      ],
      total: 2,
    });
  });

  it('completes a task', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
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
});
