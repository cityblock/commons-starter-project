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

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve task', () => {
    it('can fetch task', async () => {
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
      const query = `{
        task(taskId: "${task.id}") {
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
        id: task.id,
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
            id: task.id,
            title: 'title',
          },
        }],
      });
    });

    it('returns correct page information', async () => {
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
      const task2 = await Task.create({
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
      });

      const query = `{
        tasksForPatient(patientId: "${patient.id}", pageNumber: 0, pageSize: 1) {
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
      const query = `mutation {
        taskEdit(input: { title: "new title", taskId: "${task.id}" }) {
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
      expect(task.completedAt).toBeNull();
      const query = `mutation {
        taskComplete(input: { taskId: "${task.id}" }) {
          completedAt
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(result.data!.taskComplete.completedAt).not.toBeNull();
    });
  });

  describe('taskCreate', () => {
    it('creates a new task', async () => {
      const user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
      const patient = await createPatient(createMockPatient(123), user.id);
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
