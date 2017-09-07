import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Task from '../../models/task';
import TaskComment from '../../models/task-comment';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('task comments', () => {
  let db: Db;
  let task: Task;
  let user: User;
  const userRole = 'physician';
  const homeClinicId = '1';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({
      email: 'a@b.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId,
    });
    const patient = await createPatient(createMockPatient(), user.id);
    const dueAt = new Date().toUTCString();
    task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('task comments', () => {
    it('adds and removes a comment', async () => {
      // add comment
      const mutation = `mutation {
        taskCommentCreate(
          input: { taskId: "${task.id}", body: "my comment" }
        ) {
          id, body
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.taskCommentCreate.body)).toEqual('my comment');
      const taskEvents1 = await TaskEvent.getTaskEvents(task.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents1.total).toEqual(1);
      expect(taskEvents1.results[0].eventType).toEqual('add_comment');

      // delete comment
      const deleteMutation = `mutation {
        taskCommentDelete(input: { taskCommentId: "${result.data!.taskCommentCreate.id}" }) {
          id
        }
      }`;
      await graphql(schema, deleteMutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const taskEvents2 = await TaskEvent.getTaskEvents(task.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents2.total).toEqual(2);
      expect(taskEvents2.results[0].eventType).toEqual('delete_comment');

      // get comments
      const getComments = `{ taskComments(taskId: "${task.id}") {
          edges {
            node {
              body
            }
          }
        }
      }`;
      const taskComments = await graphql(schema, getComments, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(taskComments.data!.taskComments.edges)).toHaveLength(0);
    });

    it('edits a comment', async () => {
      // add comment
      const mutation = `mutation {
        taskCommentCreate(
          input: { taskId: "${task.id}", body: "my comment" }
        ) {
          id, body
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.taskCommentCreate.body)).toEqual('my comment');

      // edit comment
      const editMutation = `mutation {
        taskCommentEdit(input: {
            taskCommentId: "${result.data!.taskCommentCreate.id}",
            body: "cool new comment"
        }) {
          id, body
        }
      }`;
      const editedComment = await graphql(schema, editMutation, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(cloneDeep(editedComment.data!.taskCommentEdit.body)).toEqual('cool new comment');
      const taskEvents = await TaskEvent.getTaskEvents(task.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents.total).toEqual(2);
      expect(taskEvents.results[0].eventType).toEqual('edit_comment');
    });

    it('resolves task comments', async () => {
      // add comment
      const mutation = `mutation {
        taskCommentCreate(
          input: { taskId: "${task.id}", body: "my comment" }
        ) {
          id, body
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const query = `{
        taskComments(taskId: "${task.id}",pageNumber: 0, pageSize: 1) {
          edges {
            node {
              id, body
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(cloneDeep(result.data!.taskComments)).toMatchObject({
        edges: [
          {
            node: {
              body: 'my comment',
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });
  });

  it('resolves a single task comment', async () => {
    const taskComment = await TaskComment.create({
      userId: user.id,
      taskId: task.id,
      body: 'my comment',
    });

    const query = `{
      taskComment(taskCommentId: "${taskComment.id}") {
        id, body
      }
    }`;

    const result = await graphql(schema, query, null, {
      db,
      userRole,
      userId: user.id,
    });

    expect(cloneDeep(result.data!.taskComment)).toMatchObject({
      id: taskComment.id,
      body: taskComment.body,
    });
  });
});
