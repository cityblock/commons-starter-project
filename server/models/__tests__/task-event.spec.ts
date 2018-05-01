import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import Clinic from '../clinic';
import PatientGoal from '../patient-goal';
import ProgressNote from '../progress-note';
import Task from '../task';
import TaskEvent from '../task-event';
import User from '../user';

const userRole = 'physician';

describe('task event model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and retrieve a task event', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const patientGoal = await PatientGoal.create(
      { patientId: patient.id, title: 'goal title', userId: user.id },
      txn,
    );
    const task = await Task.create(
      {
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        patientGoalId: patientGoal.id,
      },
      txn,
    );
    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_assignee',
      },
      txn,
    );
    expect(taskEvent).toMatchObject({
      id: taskEvent.id,
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_assignee',
    });
    expect(await TaskEvent.get(taskEvent.id, txn)).toMatchObject({
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
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const patientGoal = await PatientGoal.create(
      { patientId: patient.id, title: 'goal title', userId: user.id },
      txn,
    );
    const task = await Task.create(
      {
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        patientGoalId: patientGoal.id,
      },
      txn,
    );
    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_assignee',
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
    const patientGoal = await PatientGoal.create(
      { patientId: patient.id, title: 'goal title', userId: user.id },
      txn,
    );
    const task = await Task.create(
      {
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        patientGoalId: patientGoal.id,
      },
      txn,
    );

    await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'add_comment',
      },
      txn,
    );
    const toBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_comment',
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
      results: [{ eventType: 'add_comment' }],
      total: 1,
    });
  });

  it('fetches all not deleted task events for a user', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
    const user2 = await User.create(createMockUser(11, clinic.id, userRole, 'b@c.com'), txn);
    const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
    const dueAt = new Date().toISOString();
    const patientGoal = await PatientGoal.create(
      { patientId: patient.id, title: 'goal title', userId: user.id },
      txn,
    );
    const task = await Task.create(
      {
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        patientGoalId: patientGoal.id,
      },
      txn,
    );

    await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'add_comment',
      },
      txn,
    );
    await TaskEvent.create(
      {
        taskId: task.id,
        userId: user2.id,
        eventType: 'delete_comment',
      },
      txn,
    );
    const toBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_comment',
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
    const patientGoal = await PatientGoal.create(
      { patientId: patient.id, title: 'goal title', userId: user.id },
      txn,
    );
    const task = await Task.create(
      {
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        patientGoalId: patientGoal.id,
      },
      txn,
    );

    const toNotBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'add_comment',
        progressNoteId: progressNote.id,
      },
      txn,
    );
    const toBeDeletedEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_comment',
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
    const patientGoal = await PatientGoal.create(
      { patientId: patient.id, title: 'goal title', userId: user.id },
      txn,
    );
    const task = await Task.create(
      {
        title: 'title',
        description: 'description',
        dueAt,
        patientId: patient.id,
        createdById: user.id,
        assignedToId: user.id,
        patientGoalId: patientGoal.id,
      },
      txn,
    );

    const taskEvent = await TaskEvent.create(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'complete_task',
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
