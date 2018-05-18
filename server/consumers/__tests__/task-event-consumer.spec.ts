import { transaction, Transaction } from 'objection';
import { Priority, TaskEventTypes, UserRole } from 'schema';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import Task from '../../models/task';
import TaskEvent from '../../models/task-event';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import { processTaskEvent } from '../task-event-consumer';

interface ISetup {
  user: User;
  task: Task;
}

const setup = async (txn: Transaction): Promise<ISetup> => {
  const clinic = await Clinic.create(createMockClinic(), txn);

  const user = await User.create(createMockUser(11, clinic.id, 'physician' as UserRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const concern = await Concern.create({ title: 'Night King brought the Wall down' }, txn);
  const patientConcern = await PatientConcern.create(
    {
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    },
    txn,
  );
  const patientGoal = await PatientGoal.create(
    {
      title: 'patient goal',
      patientId: patient.id,
      userId: user.id,
      patientConcernId: patientConcern.id,
    },
    txn,
  );
  const task = await Task.create(
    {
      title: 'title',
      description: 'description',
      dueAt: new Date().toISOString(),
      patientId: patient.id,
      createdById: user.id,
      assignedToId: user.id,
      priority: 'high' as Priority,
      patientGoalId: patientGoal.id,
    },
    txn,
  );

  return { user, task };
};

describe('Task Event Consumer', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(TaskEvent.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should create a task event', async () => {
    const { user, task } = await setup(txn);

    await processTaskEvent(
      {
        taskId: task.id,
        userId: user.id,
        eventType: 'edit_title' as TaskEventTypes,
      },
      txn,
    );

    const taskEvents = await TaskEvent.getTaskEvents(task.id, { pageNumber: 0, pageSize: 10 }, txn);

    expect(taskEvents.total).toBe(1);
    expect(taskEvents.results[0]).toMatchObject({
      taskId: task.id,
      userId: user.id,
      eventType: 'edit_title',
    });
  });
});
