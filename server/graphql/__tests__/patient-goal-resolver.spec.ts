import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Patient from '../../models/patient';
import PatientGoal from '../../models/patient-goal';
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
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
    });
  });

  describe('patient goal Edit', () => {
    it('edits a patient goal', async () => {
      const patientGoal = await PatientGoal.create({
        patientId: patient.id,
        title: 'title',
      });
      const mutation = `mutation {
        patientGoalEdit(input: { title: "better title", patientGoalId: "${patientGoal.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
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
      });
      const mutation = `mutation {
        patientGoalDelete(input: { patientGoalId: "${patientGoal.id}" }) {
          deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.patientGoalDelete).deletedAt).not.toBeNull();
    });
  });

  describe('patient goals for patient', () => {
    it('returns patient goals for patient', async () => {
      await PatientGoal.create({
        patientId: patient.id,
        title: 'title',
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
