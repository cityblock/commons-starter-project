import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  setupUrgentTasks,
} from '../../spec-helpers';
import Clinic from '../clinic';
import EventNotification from '../event-notification';
import Patient from '../patient';
import Task from '../task';
import TaskEvent from '../task-event';
import TaskFollower from '../task-follower';
import User from '../user';

const userRole = 'physician';

describe('task event model', () => {
  let user: User;
  let user2: User;
  let patient: Patient;
  let task: Task;
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());

    user = await User.create(createMockUser(11, clinic.id, userRole));
    user2 = await User.create(createMockUser(11, clinic.id, userRole, 'care@care2.com'));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt: new Date().toISOString(),
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
    const fakeId = uuid();
    await expect(EventNotification.get(fakeId)).rejects.toMatch(
      `No such eventNotification: ${fakeId}`,
    );
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
    const eventNotification2 = await EventNotification.create({
      userId: user.id,
    });

    const fetchedEventNotification1 = await EventNotification.get(eventNotification1.id);
    const fetchedEventNotification2 = await EventNotification.get(eventNotification2.id);

    expect(fetchedEventNotification1.user.id).toEqual(user.id);
    expect(fetchedEventNotification1.taskEvent.id).toEqual(taskEvent.id);

    expect(fetchedEventNotification2.user.id).toEqual(user.id);
    expect(fetchedEventNotification2.taskEvent).toBeFalsy();
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
      pageNumber: 0,
      pageSize: 10,
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
      pageNumber: 0,
      pageSize: 10,
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
      pageNumber: 0,
      pageSize: 10,
    });
    const fetchedIds = fetchedNotifications.results.map(result => result.id);

    expect(fetchedNotifications.total).toEqual(1);
    expect(fetchedIds).toContain(taskNotification.id);
    expect(fetchedIds).not.toContain(nonTaskNotification);
  });

  it('creates notifications for all necessary users for a task', async () => {
    const user3 = await User.create(createMockUser(11, clinic.id, userRole, 'care@care3.com'));
    const user4 = await User.create(createMockUser(11, clinic.id, userRole, 'care@care4.com'));
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
      pageNumber: 0,
      pageSize: 10,
    });
    const user2Notifs = await EventNotification.getUserTaskEventNotifications(user2.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    const user3Notifs = await EventNotification.getUserTaskEventNotifications(user3.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    const user4Notifs = await EventNotification.getUserTaskEventNotifications(user4.id, {
      pageNumber: 0,
      pageSize: 10,
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
    expect(eventNotification.deletedAt).toBeFalsy(); // TODO: huh? why is this not null?

    const deletedNotification = await EventNotification.delete(eventNotification.id);
    expect(deletedNotification.deletedAt).not.toBeFalsy();
  });

  it('updates a notification', async () => {
    const eventNotification = await EventNotification.create({
      userId: user.id,
    });

    expect(eventNotification.seenAt).toBeFalsy();

    await EventNotification.update(eventNotification.id, {
      seenAt: new Date().toISOString(),
    });
    const fetchedNotification = await EventNotification.get(eventNotification.id);

    expect(fetchedNotification.seenAt).not.toBeFalsy();
    expect(fetchedNotification.seenAt).not.toBeFalsy();
  });

  describe('notifications for user and task in dashboard', () => {
    it('returns notifications for a given user and task', async () => {
      await transaction(EventNotification.knex(), async txn => {
        const setup = await setupUrgentTasks(txn);
        const result = await EventNotification.getForUserTask(setup.task.id, setup.user.id, txn);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(setup.eventNotification.id);
        expect(result[0].taskEvent.taskId).toBe(setup.task.id);
      });
    });
  });
});
