import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import ProgressNote from '../progress-note';
import Task from '../task';
import TaskEvent from '../task-event';
import User from '../user';

const userRole = 'physician';

describe('task event model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task event', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(taskEvent).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(await TaskEvent.get(taskEvent.id)).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(taskEvent.deletedAt).toBeFalsy();
    expect(taskEvent.createdAt).not.toBeFalsy();
    expect(taskEvent.updatedAt).not.toBeFalsy();
  });

  it('automatically opens a progress note on create', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });
    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });

    expect(taskEvent.progressNoteId).not.toBeFalsy();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(TaskEvent.get(fakeId)).rejects.toMatch(`No such taskEvent: ${fakeId}`);
  });

  it('fetches all not deleted task events for a task', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
    });
    const toBeDeletedEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_comment',
    });

    // Make sure all events are returned
    expect(await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 })).toMatchObject({
      results: [
        {
          eventType: 'edit_comment',
        },
        {
          eventType: 'add_comment',
        },
      ],
      total: 2,
    });

    await TaskEvent.delete(toBeDeletedEvent.id);

    // Make sure deleted event isn't returned
    expect(await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 })).toMatchObject({
      results: [{ eventType: 'add_comment' }],
      total: 1,
    });
  });

  it('fetches all not deleted task events for a user', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
    });
    await TaskEvent.create({
      taskId: task.id,
      userId: user2.id,
      eventType: 'delete_comment',
    });
    const toBeDeletedEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_comment',
    });

    // Make sure all events are returned
    expect(
      await TaskEvent.getUserTaskEvents(user.id, {
        pageNumber: 0,
        pageSize: 10,
      }),
    ).toMatchObject({
      results: [
        {
          eventType: 'edit_comment',
        },
        {
          eventType: 'add_comment',
        },
      ],
      total: 2,
    });

    await TaskEvent.delete(toBeDeletedEvent.id);

    // Make sure deleted event isn't returned
    expect(
      await TaskEvent.getUserTaskEvents(user.id, {
        pageNumber: 0,
        pageSize: 10,
      }),
    ).toMatchObject({
      results: [{ eventType: 'add_comment' }],
      total: 1,
    });
  });

  it('fetches all not deleted task events for a progress note', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const progressNote = await ProgressNote.autoOpenIfRequired({
      patientId: patient.id,
      userId: user.id,
    });
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    const toNotBeDeletedEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'add_comment',
      progressNoteId: progressNote.id,
    });
    const toBeDeletedEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_comment',
      progressNoteId: progressNote.id,
    });

    // Make sure all events are returned
    const taskEvents = await TaskEvent.getAllForProgressNote(progressNote.id);
    const taskEventIds = taskEvents.map(event => event.id);
    expect(taskEvents.length).toEqual(2);
    expect(taskEventIds).toContain(toNotBeDeletedEvent.id);
    expect(taskEventIds).toContain(toBeDeletedEvent.id);

    await TaskEvent.delete(toBeDeletedEvent.id);

    // Make sure deleted event isn't returned
    expect(await TaskEvent.getAllForProgressNote(progressNote.id)).toMatchObject([
      { id: toNotBeDeletedEvent.id },
    ]);
  });

  it('deletes a task event', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, userRole));
    const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    const dueAt = new Date().toISOString();
    const task = await Task.create({
      title: 'title',
      description: 'description',
      dueAt,
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
    });

    const taskEvent = await TaskEvent.create({
      taskId: task.id,
      userId: user.id,
      eventType: 'complete_task',
    });

    expect(await TaskEvent.delete(taskEvent.id)).toMatchObject({
      userId: user.id,
    });

    expect(await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 })).toMatchObject({
      results: [],
      total: 0,
    });
  });
});
