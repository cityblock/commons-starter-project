import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Concern from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import Task from '../task';
import User from '../user';

const userRole = 'physician';

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
      homeClinicId: '1',
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
    });
    expect(patientConcern.order).toEqual(1);
    expect(await PatientConcern.get(patientConcern.id)).toEqual(patientConcern);
    expect(await PatientConcern.getForPatient(patient.id)).toEqual([patientConcern]);
  });

  it('gets a concern and associated goals/tasks', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
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
    });
    expect(await PatientConcern.getForPatient(patient.id)).toEqual([patientConcern]);
  });

  it('gets concerns associated with a patient and loads correct goals/tasks', async () => {
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
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
    });
    await PatientConcern.create({
      concernId: concern2.id,
      patientId: patient.id,
    });
    await PatientConcern.create({
      concernId: concern.id,
      patientId: patient2.id,
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
    const fakeId = 'fakeId';
    await expect(PatientConcern.get(fakeId)).rejects.toMatch('No such patient concern: fakeId');
  });

  it('edits patient concern', async () => {
    const patientAnswer = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
    });
    const completedAt = new Date().toUTCString();
    const patientAnswerUpdated = await PatientConcern.update(patientAnswer.id, {
      completedAt,
    });
    expect(patientAnswerUpdated.completedAt).not.toBeNull();
  });

  it('deletes patient concern', async () => {
    const patientAnswer = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
    });
    const deletedPatientAnswer = await PatientConcern.delete(patientAnswer.id);
    expect(deletedPatientAnswer).not.toBeNull();
  });
});
