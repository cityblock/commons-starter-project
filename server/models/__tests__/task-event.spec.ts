import { transaction } from 'objection';
import { TaskEventTypes, UserRole } from 'schema';
import * as uuid from 'uuid/v4';
import { createMockClinic, createMockUser, createPatient, createTask } from '../../spec-helpers';
import Clinic from '../clinic';
import ProgressNote from '../progress-note';
import TaskEvent from '../task-event';
import User from '../user';

const userRole = 'physician' as UserRole;

describe('task event model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should create and retrieve a task event', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const task = await createTask({ userId: user.id, patientId: patient.id, dueAt }, txn);

    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_assignee' as TaskEventTypes,
      },
      txn,
    );
    expect(taskEvent).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee' as TaskEventTypes,
    });
    expect(await TaskEvent.get(taskEvent.id, txn)).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee' as TaskEventTypes,
    });
    expect(taskEvent.deletedAt).toBeFalsy();
    expect(taskEvent.createdAt).not.toBeFalsy();
    expect(taskEvent.updatedAt).not.toBeFalsy();
  });

  it('automatically opens a progress note on create', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const task = await createTask({ userId: user.id, patientId: patient.id, dueAt }, txn);

    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_assignee' as TaskEventTypes,
      },
      txn,
    );

    expect(taskEvent.progressNoteId).not.toBeFalsy();
  });

  it('throws an error when getting an invalid id', async () => {
    const fakeId = uuid();
    await expect(TaskEvent.get(fakeId, txn)).rejects.toMatch(`No such taskEvent: ${fakeId}`);
  });

  it('fetches all not deleted task events for a task', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const task = await createTask({ userId: user.id, patientId: patient.id, dueAt }, txn);

    await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'add_comment' as TaskEventTypes,
      },
      txn,
    );
    const toBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_comment' as TaskEventTypes,
      },
      txn,
    );

    // Make sure all events are returned
    const taskEvents = await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 }, txn);
    expect(taskEvents.total).toEqual(2);
    const taskEventTypes = taskEvents.results.map(t => t.eventType);
    expect(taskEventTypes).toContain('edit_comment');
    expect(taskEventTypes).toContain('add_comment');

    await TaskEvent.delete(toBeDeletedEvent.id, txn);

    // Make sure deleted event isn't returned
    expect(
      await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 }, txn),
    ).toMatchObject({
      results: [{ eventType: 'add_comment' as TaskEventTypes }],
      total: 1,
    });
  });

  it('fetches all not deleted task events for a user', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const task = await createTask({ userId: user.id, patientId: patient.id, dueAt }, txn);

    await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'add_comment' as TaskEventTypes,
      },
      txn,
    );
    await TaskEvent.create(
      {
        taskId: task.id,
        userId: user2.id,
        eventType: 'delete_comment' as TaskEventTypes,
      },
      txn,
    );
    const toBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_comment' as TaskEventTypes,
      },
      txn,
    );

    // Make sure all events are returned
    const taskEvents = await TaskEvent.getUserTaskEvents(
      user.id,
      { pageNumber: 0, pageSize: 10 },
      txn,
    );
    expect(taskEvents.total).toEqual(2);
    const taskEventTypes = taskEvents.results.map(t => t.eventType);
    expect(taskEventTypes).toContain('edit_comment');
    expect(taskEventTypes).toContain('add_comment');

    await TaskEvent.delete(toBeDeletedEvent.id, txn);

    // Make sure deleted event isn't returned
    expect(
      await TaskEvent.getUserTaskEvents(
        user.id,
        {
          pageNumber: 0,
          pageSize: 10,
        },
        txn,
      ),
    ).toMatchObject({
      results: [{ eventType: 'add_comment' }],
      total: 1,
    });
  });

  it('fetches all not deleted task events for a progress note', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const progressNote = await ProgressNote.autoOpenIfRequired(
      {
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const dueAt = new Date().toISOString();
    const task = await createTask({ userId: user.id, patientId: patient.id, dueAt }, txn);

    const toNotBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'add_comment' as TaskEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );
    const toBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_comment' as TaskEventTypes,
        progressNoteId: progressNote.id,
      },
      txn,
    );

    // Make sure all events are returned
    const taskEvents = await TaskEvent.getAllForProgressNote(progressNote.id, txn);
    const taskEventIds = taskEvents.map(event => event.id);
    expect(taskEvents.length).toEqual(2);
    expect(taskEventIds).toContain(toNotBeDeletedEvent.id);
    expect(taskEventIds).toContain(toBeDeletedEvent.id);

    await TaskEvent.delete(toBeDeletedEvent.id, txn);

    // Make sure deleted event isn't returned
    expect(await TaskEvent.getAllForProgressNote(progressNote.id, txn)).toMatchObject([
      { id: toNotBeDeletedEvent.id },
    ]);
  });

  it('deletes a task event', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const task = await createTask({ userId: user.id, patientId: patient.id, dueAt }, txn);

    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'complete_task' as TaskEventTypes,
      },
      txn,
    );

    expect(await TaskEvent.delete(taskEvent.id, txn)).toMatchObject({
      userId: user.id,
    });

    expect(
      await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 }, txn),
    ).toMatchObject({
      results: [],
      total: 0,
    });
  });
});
