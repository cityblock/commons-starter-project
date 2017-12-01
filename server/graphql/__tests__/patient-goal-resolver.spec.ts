import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Clinic from '../../models/clinic';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientGoal from '../../models/patient-goal';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient goal resolver', () => {
  let db: Db;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;
  const userRole = 'admin';

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
      const title = 'Fix housing';
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title });
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
        title,
      });
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
      expect(cloneDeep(result.data!.patientGoalDelete).deletedAt).not.toBeFalsy();
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
