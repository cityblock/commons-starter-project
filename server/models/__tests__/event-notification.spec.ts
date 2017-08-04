import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import EventNotification from '../event-notification';
import Patient from '../patient';
import Task from '../task';
import TaskEvent from '../task-event';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

describe('task event model', () => {
  let db: Db = null as any;
  let user: User = null as any;
  let user2: User = null as any;
  let patient: Patient = null as any;
  let task: Task = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    user = await User.create({
      email: 'care@care.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole,
      homeClinicId: '1',
    });
    user2 = await User.create({
      email: 'care2@care.com',
      firstName: 'Dan2',
      lastName: 'Plant2',
      userRole,
      homeClinicId: '1',
    });
    patient = await createPatient(createMockPatient(123), user.id);
    task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt: new Date().toUTCString(),
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches by id', async () => {
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    const eventNotification = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });

    const fetchedEventNotification = await EventNotification.get(eventNotification.id);
    expect(fetchedEventNotification.userId).toEqual(user.id);
    expect(fetchedEventNotification.taskEventId).toEqual(taskEvent.id);
  });

  it('throws an error when fetching by an invalid id', async () => {
    const fakeId = 'fakeId';
    await expect(EventNotification.get(fakeId))
      .rejects
      .toMatch('No such eventNotification: fakeId');
  });

  it('sets up the correct associations when created', async () => {
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    const eventNotification1 = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    const eventNotification2 = await EventNotification.create({ userId: user.id });

    const fetchedEventNotification1 = await EventNotification.get(eventNotification1.id);
    const fetchedEventNotification2 = await EventNotification.get(eventNotification2.id);

    expect(fetchedEventNotification1.user.id).toEqual(user.id);
    expect(fetchedEventNotification1.task.id).toEqual(task.id);
    expect(fetchedEventNotification1.taskEvent.id).toEqual(taskEvent.id);

    expect(fetchedEventNotification2.user.id).toEqual(user.id);
    expect(fetchedEventNotification2.task).toBeNull();
    expect(fetchedEventNotification2.taskEvent).toBeNull();
  });

  it('fetches for a given user', async () => {
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    const eventNotification1 = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    const eventNotification2 = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    const eventNotification3 = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user2.id,
    });

    const fetchedNotifications = await EventNotification.getUserEventNotifications(user.id, {
      pageNumber: 0, pageSize: 10,
    });
    const fetchedIds = fetchedNotifications.results.map(result => result.id);

    expect(fetchedNotifications.total).toEqual(2);
    expect(fetchedIds).toContain(eventNotification1.id);
    expect(fetchedIds).toContain(eventNotification2.id);
    expect(fetchedIds).not.toContain(eventNotification3.id);
  });

  it('fetches only task notifications for a given user', async () => {
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    const taskNotification = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    const nonTaskNotification = await EventNotification.create({
      userId: user.id,
    });
    const differentUserTaskNotification = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user2.id,
    });

    const fetchedNotifications = await EventNotification.getUserTaskEventNotifications(user.id, {
      pageNumber: 0, pageSize: 10,
    });
    const fetchedIds = fetchedNotifications.results.map(result => result.id);

    expect(fetchedNotifications.total).toEqual(1);
    expect(fetchedIds).toContain(taskNotification.id);
    expect(fetchedIds).not.toContain(nonTaskNotification.id);
    expect(fetchedIds).not.toContain(differentUserTaskNotification.id);
  });

  it('fetches for a given task', async () => {
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    const taskNotification = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    const nonTaskNotification = await EventNotification.create({
      userId: user.id,
    });

    const fetchedNotifications = await EventNotification.getTaskEventNotifications(task.id, {
      pageNumber: 0, pageSize: 10,
    });
    const fetchedIds = fetchedNotifications.results.map(result => result.id);

    expect(fetchedNotifications.total).toEqual(1);
    expect(fetchedIds).toContain(taskNotification.id);
    expect(fetchedIds).not.toContain(nonTaskNotification);
  });

  it('creates notifications for all necessary users for a task', async () => {
    const user3 = await User.create({
      email: 'care@care3.com',
      firstName: 'Dan3',
      lastName: 'Plant3',
      userRole,
      homeClinicId: '1',
    });
    const user4 = await User.create({
      email: 'care@care4.com',
      firstName: 'Dan4',
      lastName: 'Plant4',
      userRole,
      homeClinicId: '1',
    });
    await TaskFollower.followTask({ userId: user2.id, taskId: task.id });
    await TaskFollower.followTask({ userId: user3.id, taskId: task.id });
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user2.id,
      eventType: 'add_follower',
      skipNotifsCreate: true,
    });
    await EventNotification.createTaskNotifications({
      initiatingUserId: user2.id,
      taskEventId: taskEvent.id,
      taskId: task.id,
    });

    const userNotifs = await EventNotification.getUserTaskEventNotifications(user.id, {
      pageNumber: 0, pageSize: 10,
    });
    const user2Notifs = await EventNotification.getUserTaskEventNotifications(user2.id, {
      pageNumber: 0, pageSize: 10,
    });
    const user3Notifs = await EventNotification.getUserTaskEventNotifications(user3.id, {
      pageNumber: 0, pageSize: 10,
    });
    const user4Notifs = await EventNotification.getUserTaskEventNotifications(user4.id, {
      pageNumber: 0, pageSize: 10,
    });

    expect(userNotifs.total).toEqual(1);
    expect(user2Notifs.total).toEqual(0);
    expect(user3Notifs.total).toEqual(1);
    expect(user4Notifs.total).toEqual(0);
  });

  it('marks as deleted', async () => {
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    const eventNotification = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    expect(eventNotification.deletedAt).toBeUndefined(); // TODO: huh? why is this not null?

    const deletedNotification = await EventNotification.delete(eventNotification.id);
    expect(deletedNotification.deletedAt).not.toBeNull();
  });

  it('updates a notification', async () => {
    const eventNotification = await EventNotification.create({ userId: user.id });

    expect(eventNotification.seenAt).toBeUndefined();

    await EventNotification.update(eventNotification.id, { seenAt: new Date().toISOString() });
    const fetchedNotification = await EventNotification.get(eventNotification.id);

    expect(fetchedNotification.seenAt).not.toBeUndefined();
    expect(fetchedNotification.seenAt).not.toBeNull();
  });
});
