import { transaction, Transaction } from 'objection';
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

interface ISetup {
  user: User;
  user2: User;
  patient: Patient;
  task: Task;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic());

  const user = await User.create(createMockUser(11, clinic.id, userRole));
  const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'care@care2.com'));
  const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  const task = await Task.create({
    title: 'title',
    description: 'description',
    dueAt: new Date().toISOString(),
    patientId: patient.id,
    createdById: user.id,
    assignedToId: user.id,
  });
  return { clinic, user, user2, patient, task };
}

describe('task event model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches by id', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, task } = await setup(txn);
      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
        },
        txn,
      );
      const eventNotification = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );

      const fetchedEventNotification = await EventNotification.get(eventNotification.id, txn);
      expect(fetchedEventNotification.userId).toEqual(user.id);
      expect(fetchedEventNotification.taskEventId).toEqual(taskEvent.id);
    });
  });

  it('throws an error when fetching by an invalid id', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const fakeId = uuid();
      await expect(EventNotification.get(fakeId, txn)).rejects.toMatch(
        `No such eventNotification: ${fakeId}`,
      );
    });
  });

  it('sets up the correct associations when created', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, task } = await setup(txn);

      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
        },
        txn,
      );
      const eventNotification1 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const eventNotification2 = await EventNotification.create(
        {
          userId: user.id,
        },
        txn,
      );

      const fetchedEventNotification1 = await EventNotification.get(eventNotification1.id, txn);
      const fetchedEventNotification2 = await EventNotification.get(eventNotification2.id, txn);

      expect(fetchedEventNotification1.user.id).toEqual(user.id);
      expect(fetchedEventNotification1.taskEvent.id).toEqual(taskEvent.id);

      expect(fetchedEventNotification2.user.id).toEqual(user.id);
      expect(fetchedEventNotification2.taskEvent).toBeFalsy();
    });
  });

  it('fetches for a given user', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, user2, task } = await setup(txn);

      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
        },
        txn,
      );
      const eventNotification1 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const eventNotification2 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const eventNotification3 = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user2.id,
        },
        txn,
      );

      const fetchedNotifications = await EventNotification.getUserEventNotifications(
        user.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const fetchedIds = fetchedNotifications.results.map(result => result.id);

      expect(fetchedNotifications.total).toEqual(2);
      expect(fetchedIds).toContain(eventNotification1.id);
      expect(fetchedIds).toContain(eventNotification2.id);
      expect(fetchedIds).not.toContain(eventNotification3.id);
    });
  });

  it('fetches only task notifications for a given user', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, task, user2 } = await setup(txn);

      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
        },
        txn,
      );
      const taskNotification = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const nonTaskNotification = await EventNotification.create(
        {
          userId: user.id,
        },
        txn,
      );
      const differentUserTaskNotification = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user2.id,
        },
        txn,
      );

      const fetchedNotifications = await EventNotification.getUserTaskEventNotifications(
        user.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const fetchedIds = fetchedNotifications.results.map(result => result.id);

      expect(fetchedNotifications.total).toEqual(1);
      expect(fetchedIds).toContain(taskNotification.id);
      expect(fetchedIds).not.toContain(nonTaskNotification.id);
      expect(fetchedIds).not.toContain(differentUserTaskNotification.id);
    });
  });

  it('fetches for a given task', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, task } = await setup(txn);

      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
        },
        txn,
      );
      const taskNotification = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      const nonTaskNotification = await EventNotification.create(
        {
          userId: user.id,
        },
        txn,
      );

      const fetchedNotifications = await EventNotification.getTaskEventNotifications(
        task.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const fetchedIds = fetchedNotifications.results.map(result => result.id);

      expect(fetchedNotifications.total).toEqual(1);
      expect(fetchedIds).toContain(taskNotification.id);
      expect(fetchedIds).not.toContain(nonTaskNotification);
    });
  });

  it('creates notifications for all necessary users for a task', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, clinic, user2, task } = await setup(txn);

      const user3 = await User.create(
        createMockUser(15, clinic.id, userRole, 'care@care3.com'),
        txn,
      );
      const user4 = await User.create(
        createMockUser(16, clinic.id, userRole, 'care@care4.com'),
        txn,
      );
      await TaskFollower.followTask({ userId: user2.id, taskId: task.id }, txn);
      await TaskFollower.followTask({ userId: user3.id, taskId: task.id }, txn);
      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user2.id,
          eventType: 'add_follower',
          skipNotifsCreate: true,
        },
        txn,
      );
      await EventNotification.createTaskNotifications(
        {
          initiatingUserId: user2.id,
          taskEventId: taskEvent.id,
          taskId: task.id,
        },
        txn,
      );

      const userNotifs = await EventNotification.getUserTaskEventNotifications(
        user.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const user2Notifs = await EventNotification.getUserTaskEventNotifications(
        user2.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const user3Notifs = await EventNotification.getUserTaskEventNotifications(
        user3.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );
      const user4Notifs = await EventNotification.getUserTaskEventNotifications(
        user4.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      );

      expect(userNotifs.total).toEqual(1);
      expect(user2Notifs.total).toEqual(0);
      expect(user3Notifs.total).toEqual(1);
      expect(user4Notifs.total).toEqual(0);
    });
  });

  it('marks as deleted', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user, task } = await setup(txn);

      const taskEvent = await TaskEvent.create(
        {
          taskId: task.id,
          userId: user.id,
          eventType: 'edit_assignee',
        },
        txn,
      );
      const eventNotification = await EventNotification.create(
        {
          taskEventId: taskEvent.id,
          userId: user.id,
        },
        txn,
      );
      expect(eventNotification.deletedAt).toBeFalsy(); // TODO: huh? why is this not null?

      const deletedNotification = await EventNotification.delete(eventNotification.id, txn);
      expect(deletedNotification.deletedAt).not.toBeFalsy();
    });
  });

  it('updates a notification', async () => {
    await transaction(TaskEvent.knex(), async txn => {
      const { user } = await setup(txn);

      const eventNotification = await EventNotification.create(
        {
          userId: user.id,
        },
        txn,
      );

      expect(eventNotification.seenAt).toBeFalsy();

      await EventNotification.dismiss(eventNotification.id, txn);
      const fetchedNotification = await EventNotification.get(eventNotification.id, txn);

      expect(fetchedNotification.seenAt).not.toBeFalsy();
      expect(fetchedNotification.seenAt).not.toBeFalsy();
    });
  });

  describe('notifications for user and task in dashboard', () => {
    it('returns notifications for a given user and task', async () => {
      await transaction(EventNotification.knex(), async txn => {
        const setupResult = await setupUrgentTasks(txn);
        const result = await EventNotification.getForUserTask(
          setupResult.task.id,
          setupResult.user.id,
          txn,
        );

        expect(result.length).toBe(1);
        expect(result[0].id).toBe(setupResult.eventNotification.id);
        expect(result[0].taskEvent.taskId).toBe(setupResult.task.id);
      });
    });
  });
});
