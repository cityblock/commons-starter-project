import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import { IEventNotificationNode } from 'schema';
import Db from '../../db';
import Clinic from '../../models/clinic';
import EventNotification from '../../models/event-notification';
import Patient from '../../models/patient';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { UserRole } from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  task: Task;
  taskEvent: TaskEvent;
  user: User;
  user2: User;
  patient: Patient;
  clinic: Clinic;
  dueAt: string;
}

async function setup(trx: Transaction, userRole?: UserRole): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), trx);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    trx,
  );
  const dueAt = new Date().toISOString();

  const task = await Task.create(
    {
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
    },
    trx,
  );

  const taskEvent = await TaskEvent.create(
    {
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
    },
    trx,
  );

  return {
    clinic,
    user,
    user2,
    patient,
    dueAt,
    task,
    taskEvent,
  };
}

describe('event notification tests', () => {
  const userRole = 'physician';
  const permissions = 'green';
  let txn = null as any;
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve event notifications for current user', () => {
    it('resolves all event notifications for the current user', async () => {
      const { user, user2, taskEvent } = await setup(txn, userRole);
      const notification1 = await EventNotification.create({ userId: user.id }, txn);
      const notification2 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const notification3 = await EventNotification.create(
        {
          userId: user2.id,
        },
        txn,
      );
      const notification4 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user2.id,
        },
        txn,
      );

      const query = `{
          eventNotificationsForCurrentUser(pageNumber: 0, pageSize: 10) {
            edges {
              node {
                id
              }
            }
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const fetchedNotifResults = result.data!.eventNotificationsForCurrentUser;
      const fetchedNotifs = fetchedNotifResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );

      expect(fetchedNotifs).toContain(notification1.id);
      expect(fetchedNotifs).toContain(notification2.id);
      expect(fetchedNotifs).not.toContain(notification3.id);
      expect(fetchedNotifs).not.toContain(notification4.id);
    });

    it('resolves only task event notifications for the current user', async () => {
      const { user, user2, taskEvent } = await setup(txn, userRole);
      const notification1 = await EventNotification.create({ userId: user.id }, txn);
      const notification2 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const notification3 = await EventNotification.create(
        {
          userId: user2.id,
        },
        txn,
      );
      const notification4 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user2.id,
        },
        txn,
      );

      const query = `{
          eventNotificationsForCurrentUser(
            pageNumber: 0, pageSize: 10, taskEventNotificationsOnly: true
          ) {
            edges {
              node {
                id
              }
            }
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const fetchedNotifResults = result.data!.eventNotificationsForCurrentUser;
      const fetchedNotifs = fetchedNotifResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );

      expect(fetchedNotifs).toContain(notification2.id);
      expect(fetchedNotifs).not.toContain(notification1.id);
      expect(fetchedNotifs).not.toContain(notification3.id);
      expect(fetchedNotifs).not.toContain(notification4.id);
    });

    it('does not resolve seen notifications', async () => {
      const { user, taskEvent } = await setup(txn, userRole);
      const notification1 = await EventNotification.create({ userId: user.id }, txn);
      const notification2 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const notification3 = await EventNotification.create({ userId: user.id }, txn);
      const notification4 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );

      await EventNotification.dismiss(notification1.id, txn);
      await EventNotification.dismiss(notification2.id, txn);

      const taskNotifsQuery = `{
          eventNotificationsForCurrentUser(
            pageNumber: 0, pageSize: 10, taskEventNotificationsOnly: true
          ) {
            edges {
              node {
                id
              }
            }
          }
        }`;
      const allNotifsQuery = `{
          eventNotificationsForCurrentUser(
            pageNumber: 0, pageSize: 10
          ) {
            edges {
              node {
                id
              }
            }
          }
        }`;
      const taskNotifsResult = await graphql(schema, taskNotifsQuery, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const allNotifsResult = await graphql(schema, allNotifsQuery, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      const fetchedTaskNotifResults = taskNotifsResult.data!.eventNotificationsForCurrentUser;
      const fetchedTaskNotifs = fetchedTaskNotifResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );

      const fetchedAllNotifsResults = allNotifsResult.data!.eventNotificationsForCurrentUser;
      const fetchedAllNotifs = fetchedAllNotifsResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );

      expect(fetchedTaskNotifs).toContain(notification4.id);
      expect(fetchedTaskNotifs).not.toContain(notification3.id);
      expect(fetchedTaskNotifs).not.toContain(notification2.id);
      expect(fetchedTaskNotifs).not.toContain(notification1.id);

      expect(fetchedAllNotifs).toContain(notification4.id);
      expect(fetchedAllNotifs).toContain(notification3.id);
      expect(fetchedAllNotifs).not.toContain(notification2.id);
      expect(fetchedAllNotifs).not.toContain(notification1.id);
    });
  });

  describe('resolve event notifications for task', () => {
    it('resolves all event notifications for a task', async () => {
      const { user, task, taskEvent } = await setup(txn, userRole);
      const notification1 = await EventNotification.create({ userId: user.id }, txn);
      const notification2 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );

      const query = `{
          eventNotificationsForTask(taskId: "${task.id}", pageNumber: 0, pageSize: 10) {
            edges {
              node {
                id
                taskEvent {
                  taskId
                }
              }
            }
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const fetchedNotifResults = result.data!.eventNotificationsForTask;
      const fetchedNotifs = fetchedNotifResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );
      expect(fetchedNotifs).not.toContain(notification1.id);
      expect(fetchedNotifs).toContain(notification2.id);
      expect(fetchedNotifResults.edges[0].node.taskEvent.taskId).toEqual(task.id);
    });

    it('does not resolve seen notifications for a task', async () => {
      const { user, task, taskEvent } = await setup(txn, userRole);
      const notification1 = await EventNotification.create({ userId: user.id }, txn);
      const notification2 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const notification3 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );

      await EventNotification.dismiss(notification2.id, txn);

      const query = `{
          eventNotificationsForTask(taskId: "${task.id}", pageNumber: 0, pageSize: 10) {
            edges {
              node {
                id
              }
            }
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const fetchedNotifResults = result.data!.eventNotificationsForTask;
      const fetchedNotifs = fetchedNotifResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );

      expect(fetchedNotifs).toContain(notification3.id);
      expect(fetchedNotifs).not.toContain(notification2.id);
      expect(fetchedNotifs).not.toContain(notification1.id);
    });
  });

  describe('dismiss event notification', () => {
    it('dismisses an event notification', async () => {
      const { user } = await setup(txn, userRole);
      const notification = await EventNotification.create({ userId: user.id }, txn);
      expect(notification.seenAt).toBeFalsy();

      const mutation = `mutation {
          eventNotificationDismiss(input: { eventNotificationId: "${notification.id}" }) {
            seenAt
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(result.data!.eventNotificationDismiss.seenAt).not.toBeFalsy();
      expect(result.data!.eventNotificationDismiss.seenAt).not.toBeFalsy();
    });
  });

  describe('dismiss event notifications for task of current user', () => {
    it('dismisses all event notifications on a task for the current user', async () => {
      const { user, task, taskEvent } = await setup(txn, userRole);
      const notification = await EventNotification.create(
        {
          userId: user.id,
          taskEventId: taskEvent.id,
        },
        txn,
      );
      expect(notification.seenAt).toBeFalsy();

      const mutation = `mutation {
          eventNotificationsForTaskDismiss(input: { taskId: "${task.id}" }) {
            seenAt
          }
        }`;

      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      const updatedNotifResults = result.data!.eventNotificationsForTaskDismiss;
      updatedNotifResults.every((notif: IEventNotificationNode) =>
        expect(notif).not.toHaveProperty('seenAt', null),
      );
    });

    it('does not dismiss notifications for other users', async () => {
      const { user, user2, task, taskEvent } = await setup(txn, userRole);
      const taskEvent2 = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user2.id,
          eventType: 'add_comment',
        },
        txn,
      );
      const notification = await EventNotification.create(
        {
          userId: user.id,
          taskEventId: taskEvent.id,
        },
        txn,
      );
      expect(notification.seenAt).toBeFalsy();
      const notification2 = await EventNotification.create(
        {
          userId: user2.id,
          taskEventId: taskEvent2.id,
        },
        txn,
      );
      expect(notification2.seenAt).toBeFalsy();

      const mutation = `mutation {
          eventNotificationsForTaskDismiss(input: { taskId: "${task.id}" }) {
            seenAt
          }
        }`;

      await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      const userNotifsQuery = `{
          eventNotificationsForCurrentUser(
            pageNumber: 0, pageSize: 10
          ) {
            edges {
              node {
                seenAt
              }
            }
          }
        }`;
      const userNotifsResult = await graphql(schema, userNotifsQuery, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const user2NotifsResult = await graphql(schema, userNotifsQuery, null, {
        db,
        permissions,
        userId: user2.id,
        txn,
      });

      const fetchedUserNotifsResults = userNotifsResult.data!.eventNotificationsForCurrentUser;
      const fetchedUser2NotifsResults = user2NotifsResult.data!.eventNotificationsForCurrentUser;
      const fetchedUser2Notifs = fetchedUser2NotifsResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.seenAt,
      );

      expect(fetchedUserNotifsResults.edges).toHaveLength(0);
      expect(fetchedUser2Notifs).toHaveLength(1);
      fetchedUser2Notifs.every((notif: IEventNotificationNode) => expect(notif).toBeNull());
    });

    it('does not dismiss notifications for other tasks', async () => {
      const { user, task, taskEvent, dueAt, patient } = await setup(txn, userRole);
      const task2 = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          priority: 'low',
        },
        txn,
      );
      const taskEvent2 = await TaskEvent.create(
        {
          taskId: task2.id,
          userId: user.id,
          eventType: 'add_comment',
        },
        txn,
      );
      const notification = await EventNotification.create(
        {
          userId: user.id,
          taskEventId: taskEvent.id,
        },
        txn,
      );
      expect(notification.seenAt).toBeFalsy();
      const notification2 = await EventNotification.create(
        {
          userId: user.id,
          taskEventId: taskEvent2.id,
        },
        txn,
      );
      expect(notification2.seenAt).toBeFalsy();

      const mutation = `mutation {
          eventNotificationsForTaskDismiss(input: { taskId: "${task.id}" }) {
            seenAt
          }
        }`;

      await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      const taskNotifsQuery = `{
          eventNotificationsForTask(taskId: "${task.id}", pageNumber: 0, pageSize: 10) {
            edges {
              node {
                seenAt
              }
            }
          }
        }`;
      const taskNotifsResult = await graphql(schema, taskNotifsQuery, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      const task2NotifsQuery = `{
          eventNotificationsForTask(taskId: "${task2.id}", pageNumber: 0, pageSize: 10) {
            edges {
              node {
                seenAt
              }
            }
          }
        }`;
      const task2NotifsResult = await graphql(schema, task2NotifsQuery, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });

      const fetchedTaskNotifsResults = taskNotifsResult.data!.eventNotificationsForTask;
      const fetchedTask2NotifsResults = task2NotifsResult.data!.eventNotificationsForTask;
      const fetchedTask2Notifs = fetchedTask2NotifsResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.seenAt,
      );

      expect(fetchedTaskNotifsResults.edges).toHaveLength(0);
      expect(fetchedTask2Notifs).toHaveLength(1);
      fetchedTask2Notifs.every((notif: IEventNotificationNode) => expect(notif).toBeNull());
    });
  });

  describe('dashboard notifications for a given task and user', () => {
    it('fetches the relevant notifications for a user and task', async () => {
      const taskSetup = await setupUrgentTasks(txn);

      const query = `{
          eventNotificationsForUserTask(taskId: "${taskSetup.task.id}") {
            id
            userId
          }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: taskSetup.user.id,
        txn,
      });

      expect(result.data!.eventNotificationsForUserTask[0].id).toBe(taskSetup.eventNotification.id);
      expect(result.data!.eventNotificationsForUserTask[0].userId).toBe(taskSetup.user.id);
    });
  });
});
