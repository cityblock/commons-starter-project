import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import CarePlanUpdateEvent from '../care-plan-update-event';
import Concern from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import Task from '../task';
import User from '../user';

const userRole = 'physician';
const homeClinicId = uuid();

describe('patient concern model', () => {
  let db: Db;
  let concern: Concern;
  let patient: Patient;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    concern = await Concern.create({
      title: 'Housing',
    });
    user = await User.create({
      email: 'care@care.com',
      userRole,
      homeClinicId,
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should create and get a patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    expect(patientConcern.order).toEqual(1);
    expect(await PatientConcern.get(patientConcern.id)).toEqual(patientConcern);
    expect(await PatientConcern.getForPatient(patient.id)).toEqual([patientConcern]);
  });

  it('creates the correct CarePlanUpdateEvent when creating a patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedCarePlanUpdateEvents.total).toEqual(1);
    expect(fetchedCarePlanUpdateEvents.results[0].patientConcernId).toEqual(patientConcern.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('create_patient_concern');
  });

  it('gets a concern and associated goals/tasks', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    const patientGoal = await PatientGoal.create({
      title: 'Goal Title',
      patientConcernId: patientConcern.id,
      patientId: patient.id,
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

    const fetchedConcern = await PatientConcern.get(patientConcern.id);
    const fetchedPatientGoal = fetchedConcern!.patientGoals[0];
    const { tasks } = fetchedPatientGoal;
    const taskIds = tasks.map(task => task.id);
    expect(fetchedPatientGoal.id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
  });

  it('gets concerns associated with a patient ', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    expect(await PatientConcern.getForPatient(patient.id)).toEqual([patientConcern]);
  });

  it('gets concerns associated with a patient and loads correct goals/tasks', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    const patientGoal = await PatientGoal.create({
      title: 'Goal Title',
      patientConcernId: patientConcern.id,
      patientId: patient.id,
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

    const fetchedConcerns = await PatientConcern.getForPatient(patient.id);
    const fetchedPatientGoal = fetchedConcerns[0].patientGoals[0];
    const { tasks } = fetchedPatientGoal;
    const taskIds = tasks.map(task => task.id);
    expect(fetchedPatientGoal.id).toEqual(patientGoal.id);
    expect(taskIds).toContain(incompleteTask.id);
    expect(taskIds).not.toContain(completeTask.id);
  });

  it('auto increments "order" on create', async () => {
    const concern2 = await Concern.create({
      title: 'Food',
    });
    const patient2 = await createPatient(createMockPatient(456), user.id);
    await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    await PatientConcern.create({
      concernId: concern2.id,
      patientId: patient.id,
      userId: user.id,
    });
    await PatientConcern.create({
      concernId: concern.id,
      patientId: patient2.id,
      userId: user.id,
    });

    const patient1Concerns = await PatientConcern.getForPatient(patient.id);
    const patient2Concerns = await PatientConcern.getForPatient(patient2.id);

    expect(patient1Concerns.length).toEqual(2);
    expect(patient1Concerns[0].order).toEqual(1);
    expect(patient1Concerns[1].order).toEqual(2);

    expect(patient2Concerns.length).toEqual(1);
    expect(patient2Concerns[0].order).toEqual(1);
  });

  it('should throw an error if a patient concern does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(PatientConcern.get(fakeId)).rejects.toMatch(`No such patient concern: ${fakeId}`);
  });

  it('edits patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    const completedAt = new Date().toISOString();
    const patientConcernUpdated = await PatientConcern.update(
      patientConcern.id,
      {
        completedAt,
      },
      user.id,
    );
    expect(patientConcernUpdated.completedAt).not.toBeNull();
  });

  it('creates the correct CarePlanUpdateEvent when editing a patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    const completedAt = new Date().toISOString();
    await PatientConcern.update(
      patientConcern.id,
      {
        completedAt,
      },
      user.id,
    );
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for edit
    expect(fetchedCarePlanUpdateEvents.results[0].patientConcernId).toEqual(patientConcern.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('edit_patient_concern');
  });

  it('deletes patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    const deletedPatientConcern = await PatientConcern.delete(patientConcern.id, user.id);
    expect(deletedPatientConcern).not.toBeNull();
  });

  it('creates the correct CarePlanUpdateEvent when deleting a patient concern', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      userId: user.id,
    });
    await PatientConcern.delete(patientConcern.id, user.id);
    const fetchedCarePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patient.id, {
      pageNumber: 0,
      pageSize: 10,
    });

    expect(fetchedCarePlanUpdateEvents.total).toEqual(2); // One for create and one for delete
    expect(fetchedCarePlanUpdateEvents.results[0].patientConcernId).toEqual(patientConcern.id);
    expect(fetchedCarePlanUpdateEvents.results[0].eventType).toEqual('delete_patient_concern');
  });
});
