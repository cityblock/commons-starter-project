import { format } from 'date-fns';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import CarePlanUpdateEvent from '../care-plan-update-event';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import Concern from '../concern';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import Task from '../task';
import TaskEvent from '../task-event';
import TaskFollower from '../task-follower';
import TaskTemplate from '../task-template';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  patient: Patient;
  user: User;
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );
  return { clinic, user, patient };
}

describe('patient goal model', () => {
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

  it('creates and gets patient goal', async () => {
    const { patient, user } = await setup(txn);
    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    expect(patientGoal.title).toEqual('title');
    expect(await PatientGoal.get(patientGoal.id, txn)).toMatchObject(patientGoal);
  });

  it('creates the correct CarePlanUpdateEvent when creating a patient goal', async () => {
    const { patient, user } = await setup(txn);

    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );
    expect(fetchedCarePlanUpdateEvents.total).toEqual(1);
    expect(fetchedCarePlanUpdateEvents.results[0].patientGoalId).toEqual(patientGoal.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('create_patient_goal');
  });

  it('creates a patient goal and links to goal template', async () => {
    const { patient, user } = await setup(txn);

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      {
        title: 'Fix housing',
      },
      txn,
    );

    const patientGoal = await PatientGoal.create(
      {
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
      },
      txn,
    );

    expect(patientGoal.goalSuggestionTemplateId).toBe(goalSuggestionTemplate.id);
    expect(patientGoal.title).toBe(goalSuggestionTemplate.title);
    expect(await PatientGoal.get(patientGoal.id, txn)).toMatchObject(patientGoal);
  });

  it('creates tasks when taskTemplates are provided as input', async () => {
    const { patient, user } = await setup(txn);

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      { title: 'Fix housing' },
      txn,
    );

    const taskTemplate = await TaskTemplate.create(
      {
        title: 'Task 1',
        priority: 'high',
        repeating: false,
        completedWithinInterval: 'week',
        completedWithinNumber: 1,
        careTeamAssigneeRole: 'physician',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      },
      txn,
    );

    const createdPatientGoal = await PatientGoal.create(
      {
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
        taskTemplateIds: [taskTemplate.id],
      },
      txn,
    );

    const fetchedTasks = await Task.getPatientTasks(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      },
      txn,
    );
    const fetchedTaskEvents = await TaskEvent.getUserTaskEvents(
      user.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );
    expect(fetchedTasks.total).toEqual(1);
    expect(fetchedTasks.results[0].title).toEqual(taskTemplate.title);
    expect(fetchedTasks.results[0].patientGoalId).toEqual(createdPatientGoal.id);
    expect(fetchedTaskEvents.total).toEqual(2);
    const expectedEventTypes = fetchedTaskEvents.results.map(taskEvent => taskEvent.eventType);
    expect(expectedEventTypes).toEqual(expect.arrayContaining(['edit_assignee', 'create_task']));
  });

  it('correctly assigns tasks when taskTemplates have an default assignee role', async () => {
    const { patient, user, clinic } = await setup(txn);

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      { title: 'Fix housing' },
      txn,
    );
    const user2 = await User.create(
      createMockUser(11, clinic.id, 'healthCoach', 'care@care2.com'),
      txn,
    );

    await CareTeam.create({ userId: user2.id, patientId: patient.id }, txn);

    const taskTemplate = await TaskTemplate.create(
      {
        title: 'Task 1',
        priority: 'high',
        repeating: false,
        careTeamAssigneeRole: 'healthCoach',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      },
      txn,
    );

    await PatientGoal.create(
      {
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
        taskTemplateIds: [taskTemplate.id],
      },
      txn,
    );

    const fetchedTasks = await Task.getPatientTasks(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      },
      txn,
    );
    expect(fetchedTasks.results[0].assignedTo).toMatchObject(user2);
  });

  it('does not assign tasks when there is no care team member for assigned role', async () => {
    const { patient, user } = await setup(txn);

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      { title: 'Fix housing' },
      txn,
    );

    const taskTemplate = await TaskTemplate.create(
      {
        title: 'Task 1',
        priority: 'high',
        repeating: false,
        careTeamAssigneeRole: 'healthCoach',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      },
      txn,
    );

    await PatientGoal.create(
      {
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
        taskTemplateIds: [taskTemplate.id],
      },
      txn,
    );

    const fetchedTasks = await Task.getPatientTasks(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      },
      txn,
    );

    expect(fetchedTasks.results[0].assignedTo).toBe(null);
  });

  it('correctly sets dueAt when taskTemplates have interval and number set', async () => {
    const { patient, user } = await setup(txn);

    const oldDate = Date.now;
    Date.now = jest.fn(() => 1501632000000);

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      { title: 'Fix housing' },
      txn,
    );

    const taskTemplate = await TaskTemplate.create(
      {
        title: 'Task 1',
        priority: 'high',
        repeating: false,
        careTeamAssigneeRole: 'healthCoach',
        completedWithinInterval: 'week',
        completedWithinNumber: 2,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      },
      txn,
    );

    await PatientGoal.create(
      {
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
        taskTemplateIds: [taskTemplate.id],
      },
      txn,
    );

    const fetchedTasks = await Task.getPatientTasks(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      },
      txn,
    );

    expect(format(fetchedTasks.results[0].dueAt as string, 'MM/DD/YYYY')).toEqual('08/16/2017');

    Date.now = oldDate;
  });

  it('does not create tasks for invalid taskTemplates that are provided as input', async () => {
    const { patient, user } = await setup(txn);

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      { title: 'Fix housing' },
      txn,
    );

    const taskTemplate = await TaskTemplate.create(
      {
        title: 'Task 1',
        priority: 'high',
        repeating: false,
        completedWithinInterval: 'week',
        completedWithinNumber: 1,
        careTeamAssigneeRole: 'physician',
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
      },
      txn,
    );

    await PatientGoal.create(
      {
        title: 'Patient Goal',
        patientId: patient.id,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        userId: user.id,
        taskTemplateIds: [`${taskTemplate.id}-but-fake`],
      },
      txn,
    );

    const fetchedTasks = await Task.getPatientTasks(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      },
      txn,
    );
    const fetchedTaskEvents = await TaskEvent.getUserTaskEvents(
      user.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );

    expect(fetchedTasks.total).toEqual(0);
    expect(fetchedTaskEvents.total).toEqual(0);
  });

  it('creates a patient goal and links to concern', async () => {
    const { patient, user } = await setup(txn);

    const concern = await Concern.create({ title: 'Housing' }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        order: 1,
        userId: user.id,
      },
      txn,
    );

    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        patientConcernId: patientConcern.id,
        userId: user.id,
      },
      txn,
    );
    expect(patientGoal.patientConcernId).toEqual(patientConcern.id);
    expect(await PatientGoal.get(patientGoal.id, txn)).toMatchObject(patientGoal);
  });

  it('should throw an error if an patient goal does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(PatientGoal.get(fakeId, txn)).rejects.toMatch(`No such patientGoal: ${fakeId}`);
  });

  it('gets a patient goal', async () => {
    const { patient, user } = await setup(txn);

    const concern = await Concern.create({ title: 'Housing' }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        order: 1,
        userId: user.id,
      },
      txn,
    );
    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        patientConcernId: patientConcern.id,
        userId: user.id,
      },
      txn,
    );
    const incompleteTask = await Task.create(
      {
        title: 'Incomplete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const completeTask = await Task.create(
      {
        title: 'Complete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const deletedTask = await Task.create(
      {
        title: 'Deleted Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );

    await Task.complete(completeTask.id, user.id, txn);
    await Task.delete(deletedTask.id, txn);

    const fetchedPatientGoal = await PatientGoal.get(patientGoal.id, txn);
    const taskIds = fetchedPatientGoal.tasks.map(task => task.id);

    expect(fetchedPatientGoal.id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
    expect(taskIds).not.toContain(deletedTask.id);
  });

  it('get goals for a patient', async () => {
    const { patient, user } = await setup(txn);

    const concern = await Concern.create({ title: 'Housing' }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        order: 1,
        userId: user.id,
      },
      txn,
    );
    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        patientConcernId: patientConcern.id,
        userId: user.id,
      },
      txn,
    );
    const incompleteTask = await Task.create(
      {
        title: 'Incomplete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const completeTask = await Task.create(
      {
        title: 'Complete Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const deletedTask = await Task.create(
      {
        title: 'Deleted Task',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    await Task.complete(completeTask.id, user.id, txn);
    await Task.delete(deletedTask.id, txn);

    const patientGoals = await PatientGoal.getForPatient(patient.id, txn);
    const taskIds = patientGoals[0].tasks.map(task => task.id);

    expect(patientGoals.length).toEqual(1);
    expect(patientGoals[0].id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
    expect(taskIds).not.toContain(deletedTask.id);
  });

  it('get task followers for goals for a patient', async () => {
    const { patient, user } = await setup(txn);

    const concern = await Concern.create({ title: 'Housing' }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId: patient.id,
        order: 1,
        userId: user.id,
      },
      txn,
    );
    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        patientConcernId: patientConcern.id,
        userId: user.id,
      },
      txn,
    );
    const task1 = await Task.create(
      {
        title: 'Task 1',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );
    const task2 = await Task.create(
      {
        title: 'Task 2',
        patientId: patient.id,
        patientGoalId: patientGoal.id,
        createdById: user.id,
      },
      txn,
    );

    // Ensure task followers are loaded correctly
    await TaskFollower.followTask({ userId: user.id, taskId: task1.id }, txn);

    await TaskFollower.followTask({ userId: user.id, taskId: task2.id }, txn);
    await TaskFollower.unfollowTask({ userId: user.id, taskId: task2.id }, txn);

    const patientGoals = await PatientGoal.getForPatient(patient.id, txn);

    expect(patientGoals[0].tasks[0].followers[0].id).toEqual(user.id);
    expect(patientGoals[0].tasks[1].followers).toEqual([]);
  });

  it('edits patient goal title', async () => {
    const { patient, user } = await setup(txn);

    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const patientGoalUpdated = await PatientGoal.update(
      patientGoal.id,
      {
        title: 'new title',
      },
      user.id,
      txn,
    );
    expect(patientGoalUpdated.title).toBe('new title');
  });

  it('creates the correct CarePlanUpdateEvent when editing a patient goal', async () => {
    const { patient, user } = await setup(txn);

    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    await PatientGoal.update(
      patientGoal.id,
      {
        title: 'new title',
      },
      user.id,
      txn,
    );
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for edit
    const expectedEventTypes = fetchedCarePlanUpdateEvents.results.map(
      taskEvent => taskEvent.eventType,
    );
    expect(expectedEventTypes).toEqual(expect.arrayContaining(['edit_patient_goal']));
  });

  it('deletes patient goal', async () => {
    const { patient, user } = await setup(txn);

    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    const deletedPatientGoal = await PatientGoal.delete(patientGoal.id, user.id, txn);
    expect(deletedPatientGoal).not.toBeFalsy();
  });

  it('creates the correct CarePlanUpdateEvent when deleting a patient goal', async () => {
    const { patient, user } = await setup(txn);

    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );
    await PatientGoal.delete(patientGoal.id, user.id, txn);

    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(
      patient.id,
      {
        pageNumber: 0,
        pageSize: 10,
      },
      txn,
    );

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for delete
    const expectedEventTypes = fetchedCarePlanUpdateEvents.results.map(
      taskEvent => taskEvent.eventType,
    );
    expect(expectedEventTypes).toEqual(expect.arrayContaining(['delete_patient_goal']));
  });

  it('gets associated patient id for a patient goal', async () => {
    const { patient, user } = await setup(txn);
    const patientGoal = await PatientGoal.create(
      {
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      },
      txn,
    );

    const fetchedPatientId = await PatientGoal.getPatientIdForResource(patientGoal.id, txn);

    expect(fetchedPatientId).toBe(patient.id);
  });
});
