import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { CompletedWithinInterval, Priority, UserRole } from 'schema';
import patientGoalCreate from '../../../app/graphql/queries/patient-goal-create-mutation.graphql';
import patientGoalDelete from '../../../app/graphql/queries/patient-goal-delete-mutation.graphql';

import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Patient from '../../models/patient';
import PatientConcern from '../../models/patient-concern';
import PatientGoal from '../../models/patient-goal';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  patient: Patient;
  user: User;
  patientConcern: PatientConcern;
}

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
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
  return { patient, user, patientConcern };
}

describe('patient goal resolver', () => {
  let txn = null as any;

  const patientGoalCreateMutation = print(patientGoalCreate);
  const patientGoalDeleteMutation = print(patientGoalDelete);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve patient goal', () => {
    it('fetches a patient goal', async () => {
      const { patient, user, patientConcern } = await setup(txn);
      const patientGoal = await PatientGoal.create(
        {
          title: 'title',
          patientId: patient.id,
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const query = `{ patientGoal(patientGoalId: "${patientGoal.id}") {
          patientId title
        } }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.patientGoal)).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
    });
  });

  describe('patient goal create', () => {
    it('creates a patient goal', async () => {
      const { patient, user, patientConcern } = await setup(txn);
      const result = await graphql(
        schema,
        patientGoalCreateMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        { patientId: patient.id, title: 'title', patientConcernId: patientConcern.id },
      );
      expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
        patientId: patient.id,
        title: 'title',
      });
    });

    it('creates a patient goal and tasks', async () => {
      const { patient, user, patientConcern } = await setup(txn);
      const title = 'Fix housing';
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title }, txn);
      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Task 1',
          priority: 'high' as Priority,
          repeating: false,
          completedWithinInterval: 'week' as CompletedWithinInterval,
          completedWithinNumber: 1,
          careTeamAssigneeRole: 'Primary_Care_Physician' as UserRole,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
        txn,
      );

      const result = await graphql(
        schema,
        patientGoalCreateMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        {
          patientId: patient.id,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          taskTemplateIds: [taskTemplate.id],
          patientConcernId: patientConcern.id,
        },
      );
      expect(cloneDeep(result.data!.patientGoalCreate)).toMatchObject({
        patientId: patient.id,
        title,
      });
    });
  });

  describe('patient goal Edit', () => {
    it('edits a patient goal', async () => {
      const { patient, user, patientConcern } = await setup(txn);
      const patientGoal = await PatientGoal.create(
        {
          patientId: patient.id,
          title: 'title',
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const mutation = `mutation {
          patientGoalEdit(input: { title: "better title", patientGoalId: "${
            patientGoal.id
          }", patientConcernId: "${patientConcern.id}" }) {
            title
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.patientGoalEdit)).toMatchObject({
        title: 'better title',
      });
    });
  });

  describe('patient goal delete', () => {
    it('deletes a patient goal', async () => {
      const { patient, user, patientConcern } = await setup(txn);
      const patientGoal = await PatientGoal.create(
        {
          patientId: patient.id,
          title: 'title',
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const result = await graphql(
        schema,
        patientGoalDeleteMutation,
        null,
        { permissions, userId: user.id, testTransaction: txn },
        { patientGoalId: patientGoal.id },
      );
      expect(cloneDeep(result.data!.patientGoalDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('patient goals for patient', () => {
    it('returns patient goals for patient', async () => {
      const { patient, user, patientConcern } = await setup(txn);

      await PatientGoal.create(
        {
          patientId: patient.id,
          title: 'title',
          userId: user.id,
          patientConcernId: patientConcern.id,
        },
        txn,
      );
      const query = `{
          patientGoals(patientId: "${patient.id}") { patientId, title }
        }`;

      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
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
