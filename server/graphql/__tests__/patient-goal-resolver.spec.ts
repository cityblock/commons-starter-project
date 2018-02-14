import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientGoal from '../../models/patient-goal';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return { patient, user };
}

describe('patient goal resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient goal', () => {
    it('fetches a patient goal', async () => {
      await transaction(PatientGoal.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const patientGoal = await PatientGoal.create(
          {
            title: 'title',
            patientId: patient.id,
            userId: user.id,
          },
          txn,
        );
        const query = `{ patientGoal(patientGoalId: "${patientGoal.id}") {
          patientId title
        } }`;
        const result = await graphql(schema, query, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.patientGoal)).toMatchObject({
          patientId: patient.id,
          title: 'title',
        });
      });
    });
  });

  describe('patient goal create', () => {
    it('creates a patient goal', async () => {
      await transaction(PatientGoal.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const mutation = `mutation {
          patientGoalCreate(
            input: { patientId: "${patient.id}", title: "title" }
          ) {
            patientId, title
          }
        }`;
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
          patientId: patient.id,
          title: 'title',
        });
      });
    });

    it('creates a patient goal and tasks', async () => {
      await transaction(PatientGoal.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const title = 'Fix housing';
        const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title }, txn);
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
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
          patientId: patient.id,
          title,
        });
      });
    });
  });

  describe('patient goal Edit', () => {
    it('edits a patient goal', async () => {
      await transaction(PatientGoal.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const patientGoal = await PatientGoal.create(
          {
            patientId: patient.id,
            title: 'title',
            userId: user.id,
          },
          txn,
        );
        const mutation = `mutation {
          patientGoalEdit(input: { title: "better title", patientGoalId: "${patientGoal.id}" }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientGoalEdit)).toMatchObject({
          title: 'better title',
        });
      });
    });
  });

  describe('patient goal delete', () => {
    it('deletes a patient goal', async () => {
      await transaction(PatientGoal.knex(), async txn => {
        const { patient, user } = await setup(txn);
        const patientGoal = await PatientGoal.create(
          {
            patientId: patient.id,
            title: 'title',
            userId: user.id,
          },
          txn,
        );
        const mutation = `mutation {
          patientGoalDelete(input: { patientGoalId: "${patientGoal.id}" }) {
            deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, { permissions, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientGoalDelete).deletedAt).not.toBeFalsy();
      });
    });
  });

  describe('patient goals for patient', () => {
    it('returns patient goals for patient', async () => {
      await transaction(PatientGoal.knex(), async txn => {
        const { patient, user } = await setup(txn);
        await PatientGoal.create(
          {
            patientId: patient.id,
            title: 'title',
            userId: user.id,
          },
          txn,
        );
        const query = `{
          patientGoals(patientId: "${patient.id}") { patientId, title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
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
});
