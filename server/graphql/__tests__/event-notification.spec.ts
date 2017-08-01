import { graphql } from 'graphql';
import { IEventNotificationNode } from 'schema';
import Db from '../../db';
import EventNotification from '../../models/event-notification';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('event notification tests', () => {
  let db: Db = null as any;
  const userRole = 'physician';
  let task: Task = null as any;
  let taskEvent: TaskEvent = null as any;
  let user: User = null as any;
  let user2: User = null as any;
  let patient = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    user2 = await User.create({ email: 'b@c.com', userRole, homeClinicId: '1' });
    patient = await createPatient(createMockPatient(123), user.id);
    const dueAt = new Date().toUTCString();
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

  describe('resolve event notifications for user', () => {
    it('resolves all event notifications for a user', async () => {
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });
      const notification3 = await EventNotification.create({ userId: user2.id });
      const notification4 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user2.id,
      });

      const query = `{
        eventNotificationsForUser(userId: "${user.id}", pageNumber: 0, pageSize: 10) {
          edges {
            node {
              id
            }
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      const fetchedNotifResults = result.data!.eventNotificationsForUser;
      const fetchedNotifs = fetchedNotifResults.edges.map((notif: IEventNotificationNode) =>
        notif.node!.id,
      );

      expect(fetchedNotifs).toContain(notification1.id);
      expect(fetchedNotifs).toContain(notification2.id);
      expect(fetchedNotifs).not.toContain(notification3.id);
      expect(fetchedNotifs).not.toContain(notification4.id);
    });

    it('resolves only task event notifications for a user', async () => {
      const notification1 = await EventNotification.create({ userId: user.id });
      const notification2 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user.id,
      });
      const notification3 = await EventNotification.create({ userId: user2.id });
      const notification4 = await EventNotification.create({
        taskEventId: taskEvent.id,
        userId: user2.id,
      });

      const query = `{
        eventNotificationsForUser(
          userId: "${user.id}", pageNumber: 0, pageSize: 10, taskEventNotificationsOnly: true
        ) {
          edges {
            node {
              id
            }
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      const fetchedNotifResults = result.data!.eventNotificationsForUser;
      const fetchedNotifs = fetchedNotifResults.edges.map((notif: IEventNotificationNode) =>
        notif.node!.id,
      );

      expect(fetchedNotifs).toContain(notification2.id);
      expect(fetchedNotifs).not.toContain(notification1.id);
      expect(fetchedNotifs).not.toContain(notification3.id);
      expect(fetchedNotifs).not.toContain(notification4.id);
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
            }
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      const fetchedNotifResults = result.data!.eventNotificationsForTask;
      const fetchedNotifs = fetchedNotifResults.edges.map((notif: IEventNotificationNode) =>
        notif.node!.id,
      );

      expect(fetchedNotifs).not.toContain(notification1.id);
      expect(fetchedNotifs).toContain(notification2.id);
    });
  });
});
