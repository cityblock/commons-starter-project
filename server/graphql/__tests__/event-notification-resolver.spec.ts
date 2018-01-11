import { graphql } from 'graphql';
import { transaction } from 'objection';
import { IEventNotificationNode } from 'schema';
import Db from '../../db';
import Clinic from '../../models/clinic';
import EventNotification from '../../models/event-notification';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('event notification tests', () => {
  let db: Db;
  const userRole = 'physician';
  let task: Task;
  let taskEvent: TaskEvent;
  let user: User;
  let user2: User;
  let patient;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'low',
    });
    taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve event notifications for current user', () => {
    it('resolves all event notifications for the current user', async () => {
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });
      const notification3 = await EventNotification.create({
        userId: user2.id,
      });
      const notification4 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user2.id,
      });

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
        userRole,
        userId: user.id,
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
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });
      const notification3 = await EventNotification.create({
        userId: user2.id,
      });
      const notification4 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user2.id,
      });

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
        userRole,
        userId: user.id,
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
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });
      const notification3 = await EventNotification.create({ userId: user.id });
      const notification4 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });

      await EventNotification.update(notification1.id, {
        seenAt: new Date().toISOString(),
      });
      await EventNotification.update(notification2.id, {
        seenAt: new Date().toISOString(),
      });

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
        userRole,
        userId: user.id,
      });
      const allNotifsResult = await graphql(schema, allNotifsQuery, null, {
        db,
        userRole,
        userId: user.id,
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
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });

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
        userRole,
        userId: user.id,
      });
      const fetchedNotifResults = result.data!.eventNotificationsForTask;
      const fetchedNotifs = fetchedNotifResults.edges.map(
        (notif: IEventNotificationNode) => notif.node!.id,
      );
      expect(fetchedNotifs).not.toContain(notification1.id);
      expect(fetchedNotifs).toContain(notification2.id);
      expect(fetchedNotifResults.edges[0].node.taskEvent.taskId).toEqual(task.id);
    });

    it('does not resolve sen notifications for a task', async () => {
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });
      const notification3 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });

      await EventNotification.update(notification2.id, {
        seenAt: new Date().toISOString(),
      });

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
        userRole,
        userId: user.id,
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
      const notification = await EventNotification.create({ userId: user.id });
      expect(notification.seenAt).toBeFalsy();

      const mutation = `mutation {
        eventNotificationDismiss(input: { eventNotificationId: "${notification.id}" }) {
          seenAt
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(result.data!.eventNotificationDismiss.seenAt).not.toBeFalsy();
      expect(result.data!.eventNotificationDismiss.seenAt).not.toBeFalsy();
    });
  });

  describe('dashboard notifications for a given task and user', () => {
    it('fetches the relevant notifications for a user and task', async () => {
      await transaction(EventNotification.knex(), async txn => {
        const setup = await setupUrgentTasks(txn);

        const query = `{
          eventNotificationsForUserTask(taskId: "${setup.task.id}") {
            id
            userId
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: setup.user.id,
          txn,
        });

        expect(result.data!.eventNotificationsForUserTask[0].id).toBe(setup.eventNotification.id);
        expect(result.data!.eventNotificationsForUserTask[0].userId).toBe(setup.user.id);
      });
    });
  });
});
