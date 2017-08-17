import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Patient from '../../models/patient';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('task follower', () => {

  let db: Db;
  let task: Task;
  let user: User;
  let patient: Patient;
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
    patient = await createPatient(createMockPatient(), user.id);
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

  describe('task followers', () => {
    it('adds and removes user to from task followers and creates TaskEvent models', async () => {
      const mutation = `mutation {
        taskUserFollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
          id
          followers { id }
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      const taskFollowers = cloneDeep(result.data!.taskUserFollow.followers).map((u: any) => u.id);
      expect(taskFollowers).toContain(user.id);
      const taskEvents1 = await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 });
      expect(taskEvents1.total).toEqual(1);
      expect(taskEvents1.results[0].eventType).toEqual('add_follower');

      // unfollow
      const unfollowMutation = `mutation {
        taskUserUnfollow(input: { userId: "${user.id}", taskId: "${task.id}" }) {
          id
          followers { id }
        }
      }`;
      const unfollowResult = await graphql(schema, unfollowMutation, null, {
        db, userRole, userId: user.id,
      });
      const taskFollowersUnfollowed = cloneDeep(
        unfollowResult.data!.taskUserUnfollow.followers,
      ).map((u: any) => u.id);
      expect(taskFollowersUnfollowed).not.toContain(user.id);
      const taskEvents2 = await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 });
      expect(taskEvents2.total).toEqual(2);
      expect(taskEvents2.results[0].eventType).toEqual('remove_follower');
    });

  });

  describe('current user tasks', () => {
    it('resolves current user tasks', async () => {
      const query = `{
        tasksForCurrentUser(pageNumber: 0, pageSize: 1) {
          edges {
            node {
              id, title
            }
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });

      expect(cloneDeep(result.data!.tasksForCurrentUser)).toMatchObject({
        edges: [{
          node: {
            id: task.id,
            title: 'title',
          },
        }],
      });
    });

    it('returns correct page information', async () => {
      const patient2 = await createPatient(createMockPatient(123), user.id);
      const dueAt = new Date().toUTCString();
      await Task.create({
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient2.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      const query = `{
        tasksForCurrentUser(pageNumber: 0, pageSize: 1) {
          edges {
            node {
              id
              title
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.tasksForCurrentUser)).toMatchObject({
        edges: [{
          node: {
            id: task.id,
            title: task.title,
          },
        }],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });

    it('can alter sort order', async () => {
      const task2 = await Task.create({
        title: 'title',
        description: 'description',
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });
      const query = `{
        tasksForCurrentUser(pageNumber: 0, pageSize: 1, orderBy: createdAtDesc) {
          edges {
            node {
              id
              title
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.tasksForCurrentUser)).toMatchObject({
        edges: [{
          node: {
            id: task2.id,
            title: task2.title,
          },
        }],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });
  });
});
