import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import EventNotification from '../event-notification';
import Patient from '../patient';
import Task from '../task';
import TaskEvent from '../task-event';
import User from '../user';

const userRole = 'physician';

describe('task event model', () => {
  let db: Db = null as any;
  let user: User = null as any;
  let user2: User = null as any;
  let patient: Patient = null as any;
  let task: Task = null as any;
  let taskEvent: TaskEvent = null as any;

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
    taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches by id', async () => {
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

  it('marks as deleted', async () => {
    const eventNotification = await EventNotification.create({
      taskEventId: taskEvent.id,
      userId: user.id,
    });
    expect(eventNotification.deletedAt).toBeUndefined(); // TODO: huh? why is this not null?

    const deletedNotification = await EventNotification.delete(eventNotification.id);
    expect(deletedNotification.deletedAt).not.toBeNull();
  });
});
