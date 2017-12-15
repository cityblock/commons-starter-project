import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
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
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient task suggestion resolver tests', () => {
  let db: Db;
  const userRole = 'admin';
  let question: Question;
  let answer: Answer;
  let user: User;
  let patient: Patient;
  let clinic: Clinic;
  let taskTemplate: TaskTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'));
    const riskArea = await createRiskArea();

    await Concern.create({ title: 'Concern' });
    taskTemplate = await TaskTemplate.create({
      title: 'Housing',
      repeating: false,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      type: 'riskArea',
      riskAreaId: riskArea.id,
      order: 1,
    });
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    await TaskSuggestion.create({
      answerId: answer.id,
      taskTemplateId: taskTemplate.id,
    });
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolvePatientTaskSuggestions', () => {
    it('can get patient task suggestions for a patient', async () => {
      const suggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

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
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
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

  describe('patientTaskSuggestionDismiss', () => {
    it('dismisses a carePlanSuggestion', async () => {
      const suggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });

      const mutation = `mutation {
        patientTaskSuggestionDismiss(
          input: { patientTaskSuggestionId: "${suggestion.id}", dismissedReason: "Because" }
        ) {
          taskTemplateId
          dismissedById
          dismissedReason
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientTaskSuggestionDismiss)).toMatchObject({
        taskTemplateId: taskTemplate.id,
        dismissedById: user.id,
        dismissedReason: 'Because',
      });
    });
  });

  describe('patientTaskSuggestionAccept', () => {
    it('accepts a patient task suggestion and creates new task', async () => {
      const suggestion = await PatientTaskSuggestion.create({
        patientId: patient.id,
        taskTemplateId: taskTemplate.id,
      });
      expect(suggestion!.acceptedAt).toBeFalsy();
      const tasks = await Task.getPatientTasks(patient.id, {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      });
      expect(tasks.total).toBe(0);

      const mutation = `mutation {
        patientTaskSuggestionAccept(
          input: { patientTaskSuggestionId: "${suggestion.id}" }
        ) {
          id
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const fetchedSuggestion = await PatientTaskSuggestion.get(suggestion.id);
      expect(fetchedSuggestion!.acceptedAt).not.toBeFalsy();

      const fetchedTasks = await Task.getPatientTasks(patient.id, {
        pageNumber: 0,
        pageSize: 10,
        orderBy: 'createdAt',
        order: 'asc',
      });
      expect(fetchedTasks.total).toBe(1);
    });
  });
});
