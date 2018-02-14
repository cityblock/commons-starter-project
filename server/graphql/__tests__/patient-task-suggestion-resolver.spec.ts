import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { CBO_REFERRAL_ACTION_TITLE } from '../../../shared/constants';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import Patient from '../../models/patient';
import PatientTaskSuggestion from '../../models/patient-task-suggestion';
import Question from '../../models/question';
import Task from '../../models/task';
import TaskSuggestion from '../../models/task-suggestion';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import {
  createCBOCategory,
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
  taskTemplate: TaskTemplate;
  answer: Answer;
}

const userRole = 'admin';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);

  await Concern.create({ title: 'Concern' }, txn);
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing',
      repeating: false,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    },
    txn,
  );
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown',
      type: 'riskArea',
      riskAreaId: riskArea.id,
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  await TaskSuggestion.create(
    {
      answerId: answer.id,
      taskTemplateId: taskTemplate.id,
    },
    txn,
  );
  const patient = await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      userId: user.id,
    },
    txn,
  );

  return {
    user,
    patient,
    taskTemplate,
    answer,
  };
}

describe('patient task suggestion resolver tests', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolvePatientTaskSuggestions', () => {
    it('can get patient task suggestions for a patient', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
        const { user, patient, taskTemplate } = await setup(txn);
        const suggestion = await PatientTaskSuggestion.create(
          {
            patientId: patient.id,
            taskTemplateId: taskTemplate.id,
          },
          txn,
        );

        const query = `{
          patientTaskSuggestions(patientId: "${patient.id}") {
            id
            patient {
              id
            }
            taskTemplate {
              id
            }
          }
        }`;
        const result = await graphql(schema, query, null, { db, userRole, userId: user.id, txn });
        expect(cloneDeep(result.data!.patientTaskSuggestions)).toMatchObject([
          {
            id: suggestion.id,
            patient: {
              id: patient.id,
            },
            taskTemplate: {
              id: taskTemplate.id,
            },
          },
        ]);
      });
    });
  });

  describe('patientTaskSuggestionDismiss', () => {
    it('dismisses a carePlanSuggestion', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
        const { user, patient, taskTemplate } = await setup(txn);
        const suggestion = await PatientTaskSuggestion.create(
          {
            patientId: patient.id,
            taskTemplateId: taskTemplate.id,
          },
          txn,
        );

        const mutation = `mutation {
          patientTaskSuggestionDismiss(
            input: { patientTaskSuggestionId: "${suggestion.id}", dismissedReason: "Because" }
          ) {
            taskTemplateId
            dismissedById
            dismissedReason
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          userRole,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.patientTaskSuggestionDismiss)).toMatchObject({
          taskTemplateId: taskTemplate.id,
          dismissedById: user.id,
          dismissedReason: 'Because',
        });
      });
    });
  });

  describe('patientTaskSuggestionAccept', () => {
    it('accepts a patient task suggestion and creates new task', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
        const { user, patient, taskTemplate } = await setup(txn);
        const suggestion = await PatientTaskSuggestion.create(
          {
            patientId: patient.id,
            taskTemplateId: taskTemplate.id,
          },
          txn,
        );
        expect(suggestion.acceptedAt).toBeFalsy();
        const tasks = await Task.getPatientTasks(
          patient.id,
          {
            pageNumber: 0,
            pageSize: 10,
            orderBy: 'createdAt',
            order: 'asc',
          },
          txn,
        );
        expect(tasks.total).toBe(0);

        const mutation = `mutation {
          patientTaskSuggestionAccept(
            input: { patientTaskSuggestionId: "${suggestion.id}" }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation, null, { db, userRole, userId: user.id, txn });

        const fetchedSuggestion = await PatientTaskSuggestion.get(suggestion.id, txn);
        expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();

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

        expect(fetchedTasks.total).toBe(1);
        expect(fetchedTasks.results[0].CBOReferralId).toBeFalsy();
      });
    });

    it('accepts a patient CBO task suggestion and creates new task', async () => {
      await transaction(PatientTaskSuggestion.knex(), async txn => {
        const { user, patient, answer } = await setup(txn);
        const CBOCategory = await createCBOCategory(txn);
        const taskTemplateCBO = await TaskTemplate.create(
          {
            title: 'Refer to Dragon Training',
            repeating: false,
            priority: 'high',
            careTeamAssigneeRole: 'physician',
            CBOCategoryId: CBOCategory.id,
          },
          txn,
        );
        await TaskSuggestion.create(
          {
            answerId: answer.id,
            taskTemplateId: taskTemplateCBO.id,
          },
          txn,
        );

        const suggestion = await PatientTaskSuggestion.create(
          {
            patientId: patient.id,
            taskTemplateId: taskTemplateCBO.id,
          },
          txn,
        );
        expect(suggestion.acceptedAt).toBeFalsy();
        const tasks = await Task.getPatientTasks(
          patient.id,
          {
            pageNumber: 0,
            pageSize: 10,
            orderBy: 'createdAt',
            order: 'asc',
          },
          txn,
        );
        expect(tasks.total).toBe(0);

        const mutation = `mutation {
          patientTaskSuggestionAccept(
            input: { patientTaskSuggestionId: "${suggestion.id}" }
          ) {
            id
          }
        }`;
        await graphql(schema, mutation, null, { db, userRole, userId: user.id, txn });

        const fetchedSuggestion = await PatientTaskSuggestion.get(suggestion.id, txn);
        expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();

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

        expect(fetchedTasks.total).toBe(1);
        expect(fetchedTasks.results[0].title).toBe(CBO_REFERRAL_ACTION_TITLE);
        expect(fetchedTasks.results[0].CBOReferralId).toBeTruthy();
        expect(fetchedTasks.results[0].CBOReferral!.categoryId).toBe(CBOCategory.id);
      });
    });
  });
});
