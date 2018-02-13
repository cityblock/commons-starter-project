import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockPatient, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import Task from '../task';
import TaskComment from '../task-comment';
import User from '../user';

const userRole = 'physician';

describe('task comment model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task', async () => {
    await transaction(Task.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );
      const taskComment = await TaskComment.create(
        {
          taskId: task.id,
          userId: user.id,
          body: 'omg a comment',
        },
        txn,
      );
      expect(taskComment).toMatchObject({
        id: taskComment.id,
        body: 'omg a comment',
        taskId: task.id,
        userId: user.id,
      });
      expect(await TaskComment.get(taskComment.id, txn)).toMatchObject({
        id: taskComment.id,
        body: 'omg a comment',
        taskId: task.id,
        userId: user.id,
      });
      expect(taskComment.deletedAt).toBeFalsy();
      expect(taskComment.createdAt).not.toBeFalsy();
      expect(taskComment.updatedAt).not.toBeFalsy();
    });
  });

  it('throws an error when getting an invalid id', async () => {
    await transaction(Task.knex(), async txn => {
      const fakeId = uuid();
      await expect(TaskComment.get(fakeId, txn)).rejects.toMatch(`No such taskComment: ${fakeId}`);
    });
  });

  it('should update a comment', async () => {
    await transaction(Task.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );
      const taskComment = await TaskComment.create(
        {
          taskId: task.id,
          userId: user.id,
          body: 'omg a comment',
        },
        txn,
      );
      expect(await TaskComment.update(taskComment.id, 'a better comment', txn)).toMatchObject({
        body: 'a better comment',
      });
    });
  });

  it('fetches all not deleted comments for a task', async () => {
    await transaction(Task.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );

      const taskComment1 = await TaskComment.create(
        {
          taskId: task.id,
          userId: user.id,
          body: 'omg a comment',
        },
        txn,
      );
      const taskComment2 = await TaskComment.create(
        {
          taskId: task.id,
          userId: user.id,
          body: 'omg another comment',
        },
        txn,
      );

      // should not include the deleted comment
      const deletedComment = await TaskComment.create(
        {
          taskId: task.id,
          userId: user.id,
          body: 'omg a deleted comment',
        },
        txn,
      );
      await TaskComment.delete(deletedComment.id, txn);

      // Make sure deleted comment isn't returned
      const taskComments = await TaskComment.getTaskComments(
        task.id,
        { pageNumber: 0, pageSize: 10 },
        txn,
      );
      const taskCommentIds = taskComments.results.map(t => t.id);
      expect(taskComments.total).toEqual(2);
      expect(taskCommentIds).toContain(taskComment1.id);
      expect(taskCommentIds).toContain(taskComment2.id);

      // Make sure pagination works correctly
      expect(
        await TaskComment.getTaskComments(task.id, { pageNumber: 0, pageSize: 1 }, txn),
      ).toMatchObject({
        results: [
          {
            body: 'omg a comment',
          },
        ],
        total: 2,
      });
      expect(
        await TaskComment.getTaskComments(task.id, { pageNumber: 1, pageSize: 1 }, txn),
      ).toMatchObject({
        results: [
          {
            body: 'omg another comment',
          },
        ],
        total: 2,
      });
    });
  });

  it('completes a task', async () => {
    await transaction(Task.knex(), async txn => {
      const clinic = await Clinic.create(createMockClinic(), txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient = await Patient.create(createMockPatient(123, 123, clinic.id), txn);
      const dueAt = new Date().toISOString();
      const task = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
        },
        txn,
      );

      expect(await Task.complete(task.id, user.id, txn)).toMatchObject({
        completedById: user.id,
      });
    });
  });
});
