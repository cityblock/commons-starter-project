import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Concern from '../../models/concern';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient goal resolver', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  const userRole = 'admin';

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

  describe('resolve patient goal', () => {
    it('fetches a patient goal', async () => {
      const patientGoal = await PatientGoal.create({
        title: 'title',
        patientId: patient.id,
        userId: user.id,
      });
      const query = `{ patientGoal(patientGoalId: "${patientGoal.id}") {
        patientId title
       } }`;
      const result = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result.data!.patientGoal)).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
    });
  });

  describe('patient goal create', () => {
    it('creates a patient goal', async () => {
      const mutation = `mutation {
        patientGoalCreate(
          input: { patientId: "${patient.id}", title: "title" }
        ) {
          patientId, title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
    });

    it('creates a patient goal and tasks', async () => {
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

      const mutation = `mutation {
        patientGoalCreate(
          input: {
            patientId: "${patient.id}",
            title: "title",
            goalSuggestionTemplateId: "${goalSuggestionTemplate.id}",
            taskTemplateIds: ["${taskTemplate.id}"]
          }
        ) {
          patientId, title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
    });

    it('creates a concern and patientConcern if a concernTitle is passed in', async () => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });

      const mutation = `mutation {
        patientGoalCreate(
          input: {
            patientId: "${patient.id}",
            title: "title",
            goalSuggestionTemplateId: "${goalSuggestionTemplate.id}",
            concernTitle: "Brand new concern"
          }
        ) {
          patientId, patientConcernId, title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      const clonedGoal = cloneDeep(result.data!.patientGoalCreate);
      const fetchedConcerns = await Concern.getAll();
      const fetchedPatientConcerns = await PatientConcern.getForPatient(patient.id);

      expect(clonedGoal).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
      expect(fetchedConcerns[0].title).toEqual('Brand new concern');
      expect(clonedGoal.patientConcernId).not.toBeNull();
      expect(fetchedPatientConcerns[0].concernId).toEqual(fetchedConcerns[0].id);
    });

    it('creates a patientConcern if a concernId is passed in', async () => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });
      const concern = await Concern.create({ title: 'New Concern' });

      const mutation = `mutation {
        patientGoalCreate(
          input: {
            patientId: "${patient.id}",
            title: "title",
            goalSuggestionTemplateId: "${goalSuggestionTemplate.id}",
            concernId: "${concern.id}"
          }
        ) {
          patientId, patientConcernId, title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      const clonedGoal = cloneDeep(result.data!.patientGoalCreate);
      const fetchedPatientConcerns = await PatientConcern.getForPatient(patient.id);

      expect(clonedGoal).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
      expect(clonedGoal.patientConcernId).not.toBeNull();
      expect(fetchedPatientConcerns[0].concernId).toEqual(concern.id);
    });

    it('correctly sets patientConcern to active or inactive', async () => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });
      const concern = await Concern.create({ title: 'New Concern' });
      const startedAt = new Date().toISOString();

      const mutation = `mutation {
        patientGoalCreate(
          input: {
            patientId: "${patient.id}",
            title: "title",
            goalSuggestionTemplateId: "${goalSuggestionTemplate.id}",
            concernId: "${concern.id}"
            startedAt: "${startedAt}"
          }
        ) {
          patientId, patientConcernId, title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      const clonedGoal = cloneDeep(result.data!.patientGoalCreate);
      const fetchedPatientConcerns = await PatientConcern.getForPatient(patient.id);

      expect(clonedGoal).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
      expect(clonedGoal.patientConcernId).not.toBeNull();
      expect(fetchedPatientConcerns[0].concernId).toEqual(concern.id);
      expect(fetchedPatientConcerns[0].startedAt).not.toBeNull();
    });
  });

  describe('patient goal Edit', () => {
    it('edits a patient goal', async () => {
      const patientGoal = await PatientGoal.create({
        patientId: patient.id,
        title: 'title',
        userId: user.id,
      });
      const mutation = `mutation {
        patientGoalEdit(input: { title: "better title", patientGoalId: "${patientGoal.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientGoalEdit)).toMatchObject({
        title: 'better title',
      });
    });
  });

  describe('patient goal delete', () => {
    it('deletes a patient goal', async () => {
      const patientGoal = await PatientGoal.create({
        patientId: patient.id,
        title: 'title',
        userId: user.id,
      });
      const mutation = `mutation {
        patientGoalDelete(input: { patientGoalId: "${patientGoal.id}" }) {
          deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientGoalDelete).deletedAt).not.toBeNull();
    });
  });

  describe('patient goals for patient', () => {
    it('returns patient goals for patient', async () => {
      await PatientGoal.create({
        patientId: patient.id,
        title: 'title',
        userId: user.id,
      });
      const query = `{
        patientGoals(patientId: "${patient.id}") { patientId, title }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.patientGoals)).toMatchObject([
        {
          patientId: patient.id,
          title: 'title',
        },
      ]);
    });
  });
});
