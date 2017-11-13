import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('task tests', () => {
  let db: Db;
  const userRole = 'physician';
  let task1: Task;
  let task2: Task;
  let user: User;
  let user2: User;
  let patient: Patient;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    task1 = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
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
      const fakeId = uuid();
      const query = `{ task(taskId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(`No such task: ${fakeId}`);
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
        edges: [
          {
            node: {
              id: task2.id,
              title: task2.title,
            },
          },
        ],
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
        edges: [
          {
            node: {
              id: task1.id,
              title: task1.title,
            },
          },
        ],
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
        edges: [
          {
            node: {
              id: task2.id,
              title: task2.title,
            },
          },
        ],
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
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.taskEdit)).toMatchObject({
        title: 'new title',
      });
    });

    it('creates the relevant TaskEvent records', async () => {
      // Editing one field at a time
      const query = `mutation {
        taskEdit(input: { priority: high, taskId: "${task1.id}" }) {
          id
          priority
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      const task = cloneDeep(result.data!.taskEdit);
      const taskEvents = await TaskEvent.getTaskEvents(task.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('edit_priority');

      const query2 = `mutation {
        taskEdit(input: { assignedToId: "${user2.id}", taskId: "${task1.id}" }) {
          id
          assignedTo {
            id
          }
        }
      }`;
      const result2 = await graphql(schema, query2, null, {
        db,
        userRole,
        userId: user.id,
      });
      const secondTask = cloneDeep(result2.data!.taskEdit);
      const taskEvents2 = await TaskEvent.getTaskEvents(secondTask.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents2.total).toEqual(2);
      expect(taskEvents2.results[0].eventType).toEqual('edit_assignee');

      const newDueAt = new Date().toISOString();
      const query3 = `mutation {
        taskEdit(input: { dueAt: "${newDueAt}", taskId: "${task1.id}" }) {
          id
          dueAt
        }
      }`;
      const result3 = await graphql(schema, query3, null, {
        db,
        userRole,
        userId: user.id,
      });
      const thirdTask = cloneDeep(result3.data!.taskEdit);
      const taskEvents3 = await TaskEvent.getTaskEvents(thirdTask.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents3.total).toEqual(3);
      expect(taskEvents3.results[0].eventType).toEqual('edit_due_date');

      const query4 = `mutation {
        taskEdit(input: { title: "edited title", taskId: "${task1.id}" }) {
          id
          title
        }
      }`;
      const result4 = await graphql(schema, query4, null, {
        db,
        userRole,
        userId: user.id,
      });
      const fourthTask = cloneDeep(result4.data!.taskEdit);
      const taskEvents4 = await TaskEvent.getTaskEvents(fourthTask.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents4.total).toEqual(4);
      expect(taskEvents4.results[0].eventType).toEqual('edit_title');

      const query5 = `mutation {
        taskEdit(input: { description: "edited description", taskId: "${task1.id}" }) {
          id
          description
        }
      }`;
      const result5 = await graphql(schema, query5, null, {
        db,
        userRole,
        userId: user.id,
      });
      const fifthTask = cloneDeep(result5.data!.taskEdit);
      const taskEvents5 = await TaskEvent.getTaskEvents(fifthTask.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents5.total).toEqual(5);
      expect(taskEvents5.results[0].eventType).toEqual('edit_description');

      // Editing multiple fields at the same time
      const query6 = `mutation {
        taskEdit(input: {
          dueAt: "${newDueAt}"
          assignedToId: "${user.id}"
          priority: medium
          taskId: "${task1.id}"
          title: "brand new title"
          description: "fancy new description"
        }) {
          id
          dueAt
          priority
          assignedTo {
            id
          }
          title
          description
        }
      }`;
      const result6 = await graphql(schema, query6, null, {
        db,
        userRole,
        userId: user.id,
      });
      const sixthTask = cloneDeep(result6.data!.taskEdit);
      const taskEvents6 = await TaskEvent.getTaskEvents(sixthTask.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents6.total).toEqual(10);
    });
  });

  describe('taskComplete', () => {
    it('completes a task', async () => {
      expect(task1.completedAt).toBeFalsy();
      const query = `mutation {
        taskComplete(input: { taskId: "${task1.id}" }) {
          completedAt
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(result.data!.taskComplete.completedAt).not.toBeFalsy();
    });

    it('creates the relevant TaskEvent model', async () => {
      const query = `mutation {
        taskComplete(input: { taskId: "${task1.id}" }) {
          completedAt
        }
      }`;
      await graphql(schema, query, null, { db, userRole, userId: user.id });
      const taskEvents = await TaskEvent.getTaskEvents(task1.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('complete_task');
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
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(result.data!.taskUncomplete.completedAt).toBeFalsy();
    });

    it('creates the relevant TaskEvent model', async () => {
      const query = `mutation {
        taskUncomplete(input: { taskId: "${task1.id}" }) {
          completedAt
        }
      }`;
      await graphql(schema, query, null, { db, userRole, userId: user.id });
      const taskEvents = await TaskEvent.getTaskEvents(task1.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('uncomplete_task');
    });
  });

  describe('taskCreate', () => {
    it('creates a new task', async () => {
      const mutation = `mutation {
        taskCreate(input: { patientId: "${patient.id}", title: "title" }) {
          title,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.taskCreate)).toMatchObject({
        title: 'title',
      });
    });

    it('creates the relevant TaskEvent records', async () => {
      const mutation = `mutation {
        taskCreate(input: {
          patientId: "${patient.id}"
          title: "title"
          assignedToId: "${user.id}"
        }) {
          id,
          title,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const task = cloneDeep(result.data!.taskCreate);
      expect(task).toMatchObject({
        title: 'title',
      });

      const taskEvents = await TaskEvent.getTaskEvents(task.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents.total).toEqual(2);
      const expectedEventTypes = taskEvents.results.map(taskEvent => taskEvent.eventType);
      expect(expectedEventTypes).toEqual(expect.arrayContaining(['edit_assignee', 'create_task']));
    });
  });

  describe('taskDelete', () => {
    it('marks a task as deleted', async () => {
      const beforeDeletePatientTasks = await Task.getPatientTasks(patient.id, {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
      });

      expect(beforeDeletePatientTasks.results.map(task => task.id)).toContain(task1.id);

      const mutation = `mutation {
        taskDelete(input: { taskId: "${task1.id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.taskDelete)).toMatchObject({
        id: task1.id,
      });

      const afterDeletePatientTasks = await Task.getPatientTasks(patient.id, {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'desc',
      });

      expect(afterDeletePatientTasks.results.map(task => task.id)).not.toContain(task1.id);
    });

    it('creates the relevant TaskEvent records', async () => {
      const mutation = `mutation {
        taskDelete(input: { taskId: "${task1.id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const task = cloneDeep(result.data!.taskDelete);
      expect(task).toMatchObject({ id: task1.id });

      const taskEvents = await TaskEvent.getTaskEvents(task.id, {
        pageNumber: 0,
        pageSize: 10,
      });
      expect(taskEvents.total).toEqual(1);
      expect(taskEvents.results[0].eventType).toEqual('delete_task');
    });
  });
});
