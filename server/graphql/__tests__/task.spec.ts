import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Task from '../../models/task';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('task tests', () => {

  let db: Db = null as any;
  const userRole = 'physician';
  let task1: Task = null as any;
  let task2: Task = null as any;
  let user: User = null as any;
  let patient = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
    task1 = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    task2 = await Task.create({
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

  describe('resolve task', () => {
    it('can fetch task', async () => {
      const query = `{
        task(taskId: "${task1.id}") {
          id
          title
          description
          createdBy { id }
          assignedTo { id }
          patient { id }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.task)).toMatchObject({
        id: task1.id,
        title: 'title',
        description: 'description',
        createdBy: { id: user.id },
        assignedTo: { id: user.id },
        patient: { id: patient.id },
      });
    });

    it('errors if a task cannot be found', async () => {
      const query = `{ task(taskId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'No such task: fakeId',
      );
    });
  });

  describe('resolve patient tasks', () => {
    it('resolves patient tasks', async () => {
      const query = `{
        tasksForPatient(patientId: "${patient.id}", pageNumber: 0, pageSize: 1) {
          edges {
            node {
              id, title
            }
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.data!.tasksForPatient)).toMatchObject({
        edges: [{
          node: {
            id: task2.id,
            title: task2.title,
          },
        }],
      });
    });

    it('returns correct page information', async () => {
      const query = `{
        tasksForPatient(
          patientId: "${patient.id}", pageNumber: 0, pageSize: 1, orderBy: createdAtAsc
        ) {
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

      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.data!.tasksForPatient)).toMatchObject({
        edges: [{
          node: {
            id: task1.id,
            title: task1.title,
          },
        }],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });

    it('can alter sort order', async () => {
      const query = `{
        tasksForPatient(
          patientId: "${patient.id}", pageNumber: 0, pageSize: 1, orderBy: createdAtDesc
        ) {
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

      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.tasksForPatient)).toMatchObject({
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

  describe('taskEdit', () => {
    it('edits task', async () => {

      const query = `mutation {
        taskEdit(input: { title: "new title", taskId: "${task1.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.taskEdit)).toMatchObject({
        title: 'new title',
      });
    });
  });

  describe('taskComplete', () => {
    it('completes a task', async () => {
      expect(task1.completedAt).toBeNull();
      const query = `mutation {
        taskComplete(input: { taskId: "${task1.id}" }) {
          completedAt
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(result.data!.taskComplete.completedAt).not.toBeNull();
    });
  });

  describe('taskUncomplete', () => {
    it('uncompletes a task', async () => {
      await Task.complete(task1.id, user.id);

      const query = `mutation {
        taskUncomplete(input: { taskId: "${task1.id}" }) {
          completedAt
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(result.data!.taskUncomplete.completedAt).toBeNull();
    });
  });

  describe('taskCreate', () => {
    it('creates a new task', async () => {
      const mutation = `mutation {
        taskCreate(input: { patientId: "${patient.id}", title: "title" }) {
          title,
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.taskCreate)).toMatchObject({
        title: 'title',
      });
    });
  });
});
