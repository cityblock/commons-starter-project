import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  Priority,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import uuid from 'uuid/v4';

import { createRiskArea } from '../../spec-helpers';
import Answer from '../answer';
import Question from '../question';
import TaskSuggestion from '../task-suggestion';
import TaskTemplate from '../task-template';

interface ISetup {
  answer: Answer;
  taskTemplate: TaskTemplate;
  question: Question;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'test' }, txn);

  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      order: 1,
      type: 'riskArea',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing',
      repeating: false,
      priority: 'low' as Priority,
      careTeamAssigneeRole: 'Primary_Care_Physician' as UserRole,
    },
    txn,
  );
  return { question, answer, taskTemplate };
}

describe('task suggestion model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('task suggestion methods', () => {
    it('should associate multiple task suggestions with an answer', async () => {
      const { taskTemplate, answer } = await setup(txn);
      const taskTemplate2 = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'Primary_Care_Physician' as UserRole,
        },
        txn,
      );

      await TaskSuggestion.create(
        {
          taskTemplateId: taskTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      await TaskSuggestion.create(
        {
          taskTemplateId: taskTemplate2.id,
          answerId: answer.id,
        },
        txn,
      );

      const taskTemplatesForAnswer = await TaskSuggestion.getForAnswer(answer.id, txn);
      const answersForTaskTemplate = await TaskSuggestion.getForTaskTemplate(taskTemplate.id, txn);

      expect(answersForTaskTemplate[0].id).toEqual(answer.id);
      expect(taskTemplatesForAnswer[0].id).toEqual(taskTemplate.id);
      expect(taskTemplatesForAnswer[1].id).toEqual(taskTemplate2.id);
    });

    it('throws an error if adding a non-existant task template to an answer', async () => {
      const { answer } = await setup(txn);

      const error =
        'insert into "task_suggestion" ("answerId", "createdAt", "id", "taskTemplateId", "updatedAt") values ($1, $2, $3, $4, $5) returning "id" - insert or update on table "task_suggestion" violates foreign key constraint "task_suggestion_tasktemplateid_foreign"';

      await expect(
        TaskSuggestion.create(
          {
            taskTemplateId: uuid(),
            answerId: answer.id,
          },
          txn,
        ),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove an answer from a task suggestion', async () => {
      const { taskTemplate, answer } = await setup(txn);

      await TaskSuggestion.create(
        {
          taskTemplateId: taskTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      const taskSuggestionsForAnswer = await TaskSuggestion.getForAnswer(answer.id, txn);
      expect(taskSuggestionsForAnswer[0].id).toEqual(taskTemplate.id);

      const deleteResponse = await TaskSuggestion.delete(
        {
          taskTemplateId: taskTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      expect(deleteResponse).toMatchObject([]);
      expect(await TaskSuggestion.getForAnswer(answer.id, txn)).toEqual([]);
    });
  });
});
