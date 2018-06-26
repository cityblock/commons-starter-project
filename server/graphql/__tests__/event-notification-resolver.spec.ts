import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import { IEventNotificationNode, Priority, TaskEventTypes, UserRole } from 'schema';

import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import EventNotification from '../../models/event-notification';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
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
  patientGoal: PatientGoal;
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
  const concern = await Concern.create({ title: 'Concern Title' }, trx);
  const patientConcern = await PatientConcern.create(
    {
      patientId: patient.id,
      concernId: concern.id,
      userId: user.id,
    },
    trx,
  );
  const patientGoal = await PatientGoal.create(
    {
      patientId: patient.id,
      title: 'goal title',
      userId: user.id,
      patientConcernId: patientConcern.id,
    },
    trx,
  );
  const task = await Task.create(
    {
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low' as Priority,
      patientGoalId: patientGoal.id,
    },
    trx,
  );

  const taskEvent = await TaskEvent.create(
    {
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment' as TaskEventTypes,
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
    patientGoal,
  };
}

describe('event notification tests', () => {
  const userRole = 'Pharmacist' as UserRole;
  const permissions = 'green';
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      const allNotifsResult = await graphql(schema, allNotifsQuery, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
          eventType: 'add_comment' as TaskEventTypes,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      const user2NotifsResult = await graphql(schema, userNotifsQuery, null, {
        permissions,
        userId: user2.id,
        testTransaction: txn,
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
      const { user, task, taskEvent, dueAt, patient, patientGoal } = await setup(txn, userRole);
      const task2 = await Task.create(
        {
          title: 'title',
          description: 'description',
          dueAt,
          patientId: patient.id,
          createdById: user.id,
          assignedToId: user.id,
          priority: 'low' as Priority,
          patientGoalId: patientGoal.id,
        },
        txn,
      );
      const taskEvent2 = await TaskEvent.create(
        {
          taskId: task2.id,
          userId: user.id,
          eventType: 'add_comment' as TaskEventTypes,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        permissions,
        userId: user.id,
        testTransaction: txn,
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
        testTransaction: txn,
      });

      expect(result.data!.eventNotificationsForUserTask[0].id).toBe(taskSetup.eventNotification.id);
      expect(result.data!.eventNotificationsForUserTask[0].userId).toBe(taskSetup.user.id);
    });
  });
});
