import Db from '../../db';
import {
  createMockPatient,
  createPatient,
} from '../../spec-helpers';
import Concern from '../concern';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientGoal from '../patient-goal';
import User from '../user';

const userRole = 'physician';

describe('patient goal model', () => {
  let db: Db;
  let patient: Patient;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

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

  it('should creates and get patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
    });
    expect(patientGoal.title).toEqual('title');
    expect(await PatientGoal.get(patientGoal.id)).toEqual(patientGoal);
  });

  it('creates a patient goal and links to goal template', async () => {
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });

    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      goalSuggestionTemplateId: goalSuggestionTemplate.id,
    });
    expect(patientGoal.goalSuggestionTemplateId).toEqual(goalSuggestionTemplate.id);
    expect(await PatientGoal.get(patientGoal.id)).toEqual(patientGoal);
  });

  it('creates a patient goal and links to concern', async () => {
    const concern = await Concern.create({ title: 'Housing' });
    const patientConcern = await PatientConcern.create({
      concernId: concern.id,
      patientId: patient.id,
      order: 1,
    });

    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
      patientConcernId: patientConcern.id,
    });
    expect(patientGoal.patientConcernId).toEqual(patientConcern.id);
    expect(await PatientGoal.get(patientGoal.id)).toEqual(patientGoal);
  });

  it('should throw an error if an patient goal does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(PatientGoal.get(fakeId))
      .rejects
      .toMatch('No such patientGoal: fakeId');
  });

  it('edits patient goal title', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
    });
    const patientGoalUpdated = await PatientGoal.update(patientGoal.id, { title: 'new title' });
    expect(patientGoalUpdated.title).toBe('new title');
  });

  it('deletes patient goal', async () => {
    const patientGoal = await PatientGoal.create({
      title: 'title',
      patientId: patient.id,
    });
    const deletedPatientGoal = await PatientGoal.delete(patientGoal.id);
    expect(deletedPatientGoal).not.toBeNull();
  });
});
