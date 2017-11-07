import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
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
import TaskTemplate from '../task-template';
import User from '../user';

const userRole = 'physician';

describe('patient goal model', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      userId: user.id,
    });
    expect(patientGoal.title).toEqual('title');
    expect(await PatientGoal.get(patientGoal.id)).toMatchObject(patientGoal);
  });

  it('creates the correct CarePlanUpdateEvent when creating a patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      userId: user.id,
    });
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });
    expect(fetchedCarePlanUpdateEvents.total).toEqual(1);
    expect(fetchedCarePlanUpdateEvents.results[0].patientGoalId).toEqual(patientGoal.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('create_patient_goal');
  });

  it('creates a patient goal and links to goal template', async () => {
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({
      title: 'Fix housing',
    });

    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      userId: user.id,
    });
    expect(patientGoal.goalSuggestionTemplateId).toEqual(goalSuggestionTemplate.id);
    expect(await PatientGoal.get(patientGoal.id)).toMatchObject(patientGoal);
  });

  it('creates tasks when taskTemplates are provided as input', async () => {
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });

    const taskTemplate = await TaskTemplate.create({
      title: 'Task 1',
      priority: 'high',
      repeating: false,
      completedWithinInterval: 'week',
      completedWithinNumber: 1,
      careTeamAssigneeRole: 'physician',
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });

    const createdPatientGoal = await PatientGoal.create({
      title: 'Patient Goal',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      userId: user.id,
      taskTemplateIds: [taskTemplate.id],
    });

    const fetchedTasks = await Task.getPatientTasks(patient.id, {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'asc',
    });
    const fetchedTaskEvents = await TaskEvent.getUserTaskEvents(user.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedTasks.total).toEqual(1);
    expect(fetchedTasks.results[0].title).toEqual(taskTemplate.title);
    expect(fetchedTasks.results[0].patientGoalId).toEqual(createdPatientGoal.id);
    expect(fetchedTaskEvents.total).toEqual(2);
    const expectedEventTypes = fetchedTaskEvents.results.map(taskEvent => taskEvent.eventType);
    expect(expectedEventTypes).toEqual(expect.arrayContaining(['edit_assignee', 'create_task']));
  });

  it('correctly assigns tasks when taskTemplates have an default assignee role', async () => {
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });
    const user2 = await User.create(createMockUser(11, clinic.id, 'healthCoach', 'care@care2.com'));

    await CareTeam.create({ userId: user2.id, patientId: patient.id });

    const taskTemplate = await TaskTemplate.create({
      title: 'Task 1',
      priority: 'high',
      repeating: false,
      careTeamAssigneeRole: 'healthCoach',
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });

    await PatientGoal.create({
      title: 'Patient Goal',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      userId: user.id,
      taskTemplateIds: [taskTemplate.id],
    });

    const fetchedTasks = await Task.getPatientTasks(patient.id, {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'asc',
    });

    expect(fetchedTasks.results[0].assignedTo).toMatchObject(user2);
  });

  it('does not assign tasks when there is no care team member for assigned role', async () => {
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });

    const taskTemplate = await TaskTemplate.create({
      title: 'Task 1',
      priority: 'high',
      repeating: false,
      careTeamAssigneeRole: 'healthCoach',
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });

    await PatientGoal.create({
      title: 'Patient Goal',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      userId: user.id,
      taskTemplateIds: [taskTemplate.id],
    });

    const fetchedTasks = await Task.getPatientTasks(patient.id, {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'asc',
    });

    expect(fetchedTasks.results[0].assignedTo).toBe(null);
  });

  it('correctly sets dueAt when taskTemplates have interval and number set', async () => {
    const oldDate = Date.now;
    Date.now = jest.fn(() => 1500494779252);
    const twoWeeksFromNow = Date.now() + 12096e5;

    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });

    const taskTemplate = await TaskTemplate.create({
      title: 'Task 1',
      priority: 'high',
      repeating: false,
      careTeamAssigneeRole: 'healthCoach',
      completedWithinInterval: 'week',
      completedWithinNumber: 2,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });

    await PatientGoal.create({
      title: 'Patient Goal',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      userId: user.id,
      taskTemplateIds: [taskTemplate.id],
    });

    const fetchedTasks = await Task.getPatientTasks(patient.id, {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'asc',
    });

    expect(fetchedTasks.results[0].dueAt.valueOf()).toEqual(twoWeeksFromNow);

    Date.now = oldDate;
  });

  it('does not create tasks for invalid taskTemplates that are provided as input', async () => {
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });

    const taskTemplate = await TaskTemplate.create({
      title: 'Task 1',
      priority: 'high',
      repeating: false,
      completedWithinInterval: 'week',
      completedWithinNumber: 1,
      careTeamAssigneeRole: 'physician',
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });

    await PatientGoal.create({
      title: 'Patient Goal',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
      userId: user.id,
      taskTemplateIds: [`${taskTemplate.id}-but-fake`],
    });

    const fetchedTasks = await Task.getPatientTasks(patient.id, {
      pageNumber: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      order: 'asc',
    });
    const fetchedTaskEvents = await TaskEvent.getUserTaskEvents(user.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedTasks.total).toEqual(0);
    expect(fetchedTaskEvents.total).toEqual(0);
  });

  it('creates a patient goal and links to concern', async () => {
    const concern = await Concern.create({ title: 'Housing' });
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
      userId: user.id,
    });

    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      patientConcernId: patientConcern.id,
      userId: user.id,
    });
    expect(patientGoal.patientConcernId).toEqual(patientConcern.id);
    expect(await PatientGoal.get(patientGoal.id)).toMatchObject(patientGoal);
  });

  it('should throw an error if an patient goal does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(PatientGoal.get(fakeId)).rejects.toMatch(`No such patientGoal: ${fakeId}`);
  });

  it('gets a patient goal', async () => {
    const concern = await Concern.create({ title: 'Housing' });
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
      userId: user.id,
    });
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      patientConcernId: patientConcern.id,
      userId: user.id,
    });
    const incompleteTask = await Task.create({
      title: 'Incomplete Task',
      patientId: patient.id,
      patientGoalId: patientGoal.id,
      createdById: user.id,
    });
    const completeTask = await Task.create({
      title: 'Complete Task',
      patientId: patient.id,
      patientGoalId: patientGoal.id,
      createdById: user.id,
    });

    await Task.complete(completeTask.id, user.id);

    const fetchedPatientGoal = await PatientGoal.get(patientGoal.id);
    const taskIds = fetchedPatientGoal!.tasks.map(task => task.id);

    expect(fetchedPatientGoal!.id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
  });

  it('get goals for a patient', async () => {
    const concern = await Concern.create({ title: 'Housing' });
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
      userId: user.id,
    });
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      patientConcernId: patientConcern.id,
      userId: user.id,
    });
    const incompleteTask = await Task.create({
      title: 'Incomplete Task',
      patientId: patient.id,
      patientGoalId: patientGoal.id,
      createdById: user.id,
    });
    const completeTask = await Task.create({
      title: 'Complete Task',
      patientId: patient.id,
      patientGoalId: patientGoal.id,
      createdById: user.id,
    });

    await Task.complete(completeTask.id, user.id);

    const patientGoals = await PatientGoal.getForPatient(patient.id);
    const taskIds = patientGoals[0].tasks.map(task => task.id);

    expect(patientGoals.length).toEqual(1);
    expect(patientGoals[0].id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
  });

  it('edits patient goal title', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      userId: user.id,
    });
    const patientGoalUpdated = await PatientGoal.update(
      patientGoal.id,
      {
        title: 'new title',
      },
      user.id,
    );
    expect(patientGoalUpdated.title).toBe('new title');
  });

  it('creates the correct CarePlanUpdateEvent when editing a patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      userId: user.id,
    });
    await PatientGoal.update(
      patientGoal.id,
      {
        title: 'new title',
      },
      user.id,
    );
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for edit
    expect(fetchedCarePlanUpdateEvents.results[0].patientGoalId).toEqual(patientGoal.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('edit_patient_goal');
  });

  it('deletes patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      userId: user.id,
    });
    const deletedPatientGoal = await PatientGoal.delete(patientGoal.id, user.id);
    expect(deletedPatientGoal).not.toBeNull();
  });

  it('creates the correct CarePlanUpdateEvent when deleting a patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      userId: user.id,
    });
    await PatientGoal.delete(patientGoal.id, user.id);

    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for delete
    expect(fetchedCarePlanUpdateEvents.results[0].patientGoalId).toEqual(patientGoal.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('delete_patient_goal');
  });
});
