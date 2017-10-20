import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Question from '../../models/question';
import TaskSuggestion from '../../models/task-suggestion';
import TaskTemplate from '../../models/task-template';
import schema from '../make-executable-schema';

describe('task suggestion resolver', () => {
  let db: Db;
  const userRole = 'admin';
  let answer: Answer;
  let taskTemplate: TaskTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    const question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
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
    taskTemplate = await TaskTemplate.create({
      title: 'Housing',
      repeating: false,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve tasks for answer', () => {
    it('fetches a task', async () => {
      const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
      const result = await graphql(schema, query, null, { userRole });
      // null if no suggested tasks
      expect(cloneDeep(result.data!.taskTemplatesForAnswer)).toMatchObject([]);

      await TaskSuggestion.create({
        taskTemplateId: taskTemplate.id,
        answerId: answer.id,
      });
      // one if suggested task
      const result2 = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([
        { title: 'Housing' },
      ]);
    });
  });

  describe('task suggestion create', () => {
    it('suggests a task for an answer', async () => {
      const mutation = `mutation {
        taskSuggestionCreate(
          input: {
            answerId: "${answer.id}", taskTemplateId: "${taskTemplate.id}"
          }
        ) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.taskSuggestionCreate)).toMatchObject([
        {
          title: 'Housing',
        },
      ]);
    });
  });

  describe('task suggestion delete', () => {
    it('unsuggests a task for an answer', async () => {
      await TaskSuggestion.create({
        taskTemplateId: taskTemplate.id,
        answerId: answer.id,
      });
      const mutation = `mutation {
        taskSuggestionDelete(input: {
          answerId: "${answer.id}", taskTemplateId: "${taskTemplate.id}"
        }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.taskSuggestionDelete)).toMatchObject([]);

      // empty with no suggested tasks
      const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
      const result2 = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([]);
    });
  });
});
