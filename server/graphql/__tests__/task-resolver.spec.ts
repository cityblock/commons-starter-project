import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  createCBOReferral,
  createMockClinic,
  createMockUser,
  createPatient,
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  task1: Task;
  task2: Task;
  user: User;
  user2: User;
  patient: Patient;
  clinic: Clinic;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const dueAt = new Date().toISOString();
  const task1 = await Task.create(
    {
      title: 'Task 1 Title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
    },
    txn,
  );
  const task2 = await Task.create(
    {
      title: 'Task 2 Title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    },
    txn,
  );

  return {
    clinic,
    user,
    user2,
    patient,
    task1,
    task2,
  };
}

describe('task tests', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve task', () => {
    it('can fetch task', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user, patient } = await setup(txn);
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
        const result = await graphql(schema, query, null, { db, userRole, txn });
        expect(cloneDeep(result.data!.task)).toMatchObject({
          id: task1.id,
          title: 'Task 1 Title',
          description: 'description',
          createdBy: { id: user.id },
          assignedTo: { id: user.id },
          patient: { id: patient.id },
        });
      });
    });

    it('errors if a task cannot be found', async () => {
      await transaction(Task.knex(), async txn => {
        const fakeId = uuid();
        const query = `{ task(taskId: "${fakeId}") { id } }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });
        expect(result.errors![0].message).toMatch(`No such task: ${fakeId}`);
      });
    });
  });

  describe('resolve patient tasks', () => {
    it('resolves patient tasks', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient, task2 } = await setup(txn);
        const query = `{
          tasksForPatient(patientId: "${patient.id}", pageNumber: 0, pageSize: 1) {
            edges {
              node {
                id, title
              }
            }
          }
        }`;
        const result = await graphql(schema, query, null, { db, userRole, txn });

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
    });

    it('returns correct page information', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient, task1 } = await setup(txn);
        const query = `{
          tasksForPatient(
            patientId: "${patient.id}", pageNumber: 0, pageSize: 1, orderBy: titleAsc
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

        const result = await graphql(schema, query, null, { db, userRole, txn });

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
    });

    it('can alter sort order', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient, task2 } = await setup(txn);
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

        const result = await graphql(schema, query, null, { db, userRole, txn });
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
  });

  describe('taskEdit', () => {
    it('edits task', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user } = await setup(txn);
        const query = `mutation {
          taskEdit(input: { title: "new title", taskId: "${task1.id}" }) {
            title
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.taskEdit)).toMatchObject({
          title: 'new title',
        });
      });
    });

    it('creates the relevant TaskEvent records', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user, user2 } = await setup(txn);
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
          txn,
        });
        const task = cloneDeep(result.data!.taskEdit);
        const taskEvents = await TaskEvent.getTaskEvents(
          task.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
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
          txn,
        });
        const secondTask = cloneDeep(result2.data!.taskEdit);
        const taskEvents2 = await TaskEvent.getTaskEvents(
          secondTask.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents2.total).toEqual(2);
        expect(taskEvents2.results.map(taskEvent => taskEvent.eventType)).toContain(
          'edit_assignee',
        );

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
          txn,
        });
        const thirdTask = cloneDeep(result3.data!.taskEdit);
        const taskEvents3 = await TaskEvent.getTaskEvents(
          thirdTask.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents3.total).toEqual(3);
        expect(taskEvents3.results.map(taskEvent => taskEvent.eventType)).toContain(
          'edit_due_date',
        );

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
          txn,
        });
        const fourthTask = cloneDeep(result4.data!.taskEdit);
        const taskEvents4 = await TaskEvent.getTaskEvents(
          fourthTask.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents4.total).toEqual(4);
        expect(taskEvents4.results.map(taskEvent => taskEvent.eventType)).toContain('edit_title');

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
          txn,
        });
        const fifthTask = cloneDeep(result5.data!.taskEdit);
        const taskEvents5 = await TaskEvent.getTaskEvents(
          fifthTask.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents5.total).toEqual(5);
        expect(taskEvents5.results.map(taskEvent => taskEvent.eventType)).toContain(
          'edit_description',
        );

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
          txn,
        });
        const sixthTask = cloneDeep(result6.data!.taskEdit);
        const taskEvents6 = await TaskEvent.getTaskEvents(
          sixthTask.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents6.total).toEqual(10);
      });
    });
  });

  describe('taskComplete', () => {
    it('completes a task', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user } = await setup(txn);
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
          txn,
        });
        expect(result.data!.taskComplete.completedAt).not.toBeFalsy();
      });
    });

    it('creates the relevant TaskEvent model', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user } = await setup(txn);
        const query = `mutation {
          taskComplete(input: { taskId: "${task1.id}" }) {
            completedAt
          }
        }`;
        await graphql(schema, query, null, { db, userRole, userId: user.id, txn });
        const taskEvents = await TaskEvent.getTaskEvents(
          task1.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents.total).toEqual(1);
        expect(taskEvents.results[0].eventType).toEqual('complete_task');
      });
    });
  });

  describe('taskUncomplete', () => {
    it('uncompletes a task', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user } = await setup(txn);
        await Task.complete(task1.id, user.id, txn);

        const query = `mutation {
          taskUncomplete(input: { taskId: "${task1.id}" }) {
            completedAt
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        expect(result.data!.taskUncomplete.completedAt).toBeFalsy();
      });
    });

    it('creates the relevant TaskEvent model', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user } = await setup(txn);
        const query = `mutation {
          taskUncomplete(input: { taskId: "${task1.id}" }) {
            completedAt
          }
        }`;
        await graphql(schema, query, null, { db, userRole, userId: user.id, txn });
        const taskEvents = await TaskEvent.getTaskEvents(
          task1.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents.total).toEqual(1);
        expect(taskEvents.results[0].eventType).toEqual('uncomplete_task');
      });
    });
  });

  describe('taskCreate', () => {
    it('creates a new task', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const mutation = `mutation {
          taskCreate(input: { patientId: "${patient.id}", title: "title" }) {
            title,
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.taskCreate)).toMatchObject({
          title: 'title',
        });
      });
    });

    it('creates a new task with CBO referral', async () => {
      await transaction(Task.knex(), async txn => {
        const title = 'Defeat Night King';
        const { patient, user } = await setup(txn);
        const cboReferral = await createCBOReferral(txn);

        const mutation = `mutation {
          taskCreate(input: {
            patientId: "${patient.id}"
            title: "${title}"
            CBOReferralId: "${cboReferral.id}"
          }) {
            title
            CBOReferralId
            CBOReferral {
              id
              category {
                id
              }
              CBO {
                id
              }
            }
          }
        }`;

        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.taskCreate).toMatchObject({
          title,
          CBOReferralId: cboReferral.id,
          CBOReferral: {
            id: cboReferral.id,
            category: {
              id: cboReferral.categoryId,
            },
            CBO: {
              id: cboReferral.CBOId,
            },
          },
        });
      });
    });

    it('creates the relevant TaskEvent records', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient, user } = await setup(txn);
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
          txn,
        });
        const task = cloneDeep(result.data!.taskCreate);
        expect(task).toMatchObject({
          title: 'title',
        });

        const taskEvents = await TaskEvent.getTaskEvents(
          task.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents.total).toEqual(2);
        const expectedEventTypes = taskEvents.results.map(taskEvent => taskEvent.eventType);
        expect(expectedEventTypes).toEqual(
          expect.arrayContaining(['edit_assignee', 'create_task']),
        );
      });
    });
  });

  describe('taskDelete', () => {
    it('marks a task as deleted', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient, task1, user } = await setup(txn);
        const beforeDeletePatientTasks = await Task.getPatientTasks(
          patient.id,
          {
            pageNumber: 0,
            pageSize: 10,
            orderBy: 'createdAt',
            order: 'desc',
          },
          txn,
        );

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
          txn,
        });
        expect(cloneDeep(result.data!.taskDelete)).toMatchObject({
          id: task1.id,
        });

        const afterDeletePatientTasks = await Task.getPatientTasks(
          patient.id,
          {
            pageNumber: 0,
            pageSize: 10,
            orderBy: 'createdAt',
            order: 'desc',
          },
          txn,
        );

        expect(afterDeletePatientTasks.results.map(task => task.id)).not.toContain(task1.id);
      });
    });

    it('creates the relevant TaskEvent records', async () => {
      await transaction(Task.knex(), async txn => {
        const { task1, user } = await setup(txn);
        const mutation = `mutation {
          taskDelete(input: { taskId: "${task1.id}" }) {
            id,
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        const task = cloneDeep(result.data!.taskDelete);
        expect(task).toMatchObject({ id: task1.id });

        const taskEvents = await TaskEvent.getTaskEvents(
          task.id,
          {
            pageNumber: 0,
            pageSize: 10,
          },
          txn,
        );
        expect(taskEvents.total).toEqual(1);
        expect(taskEvents.results[0].eventType).toEqual('delete_task');
      });
    });
  });

  describe('tasksDueSoonForPatient', () => {
    it('retrieves a list of tasks due soon for a patient and user', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient1, user, task1 } = await setupUrgentTasks(txn);

        const query = `{
          tasksDueSoonForPatient(patientId: "${patient1.id}") {
            id
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.tasksDueSoonForPatient.length).toBe(1);
        expect(result.data!.tasksDueSoonForPatient[0].id).toBe(task1.id);
      });
    });
  });

  describe('tasksWithNotificationsForPatient', () => {
    it('retrieves a list of tasks due soon for a patient and user', async () => {
      await transaction(Task.knex(), async txn => {
        const { patient5, user, task } = await setupUrgentTasks(txn);

        const query = `{
          tasksWithNotificationsForPatient(patientId: "${patient5.id}") {
            id
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.tasksWithNotificationsForPatient.length).toBe(1);
        expect(result.data!.tasksWithNotificationsForPatient[0].id).toBe(task.id);
      });
    });
  });

  describe('taskIdsWithNotifications', () => {
    it('retrieves a list of task ids that have notifications for the current user', async () => {
      await transaction(Task.knex(), async txn => {
        const { user, task } = await setupUrgentTasks(txn);

        const query = `{
          taskIdsWithNotifications {
            id
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: user.id,
          txn,
        });

        expect(result.data!.taskIdsWithNotifications.length).toBe(1);
        expect(result.data!.taskIdsWithNotifications[0].id).toBe(task.id);
      });
    });
  });
});
