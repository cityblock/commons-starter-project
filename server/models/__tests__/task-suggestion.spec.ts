import Db from '../../db';
import Answer from '../answer';
import Question from '../question';
import TaskSuggestion from '../task-suggestion';
import TaskTemplate from '../task-template';

describe('task suggestion model', () => {
  let db: Db;
  let answer: Answer;
  let taskTemplate: TaskTemplate;
  let question: Question;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    question = await Question.create({
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

  describe('task suggestion methods', () => {
    it('should associate multiple task suggestions with an answer', async () => {
      const taskTemplate2 = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });

      await TaskSuggestion.create({
        taskTemplateId: taskTemplate.id,
        answerId: answer.id,
      });
      await TaskSuggestion.create({
        taskTemplateId: taskTemplate2.id,
        answerId: answer.id,
      });

      const taskTemplatesForAnswer = await TaskSuggestion.getForAnswer(answer.id);
      const answersForTaskTemplate = await TaskSuggestion.getForTaskTemplate(taskTemplate.id);

      expect(answersForTaskTemplate[0].id).toEqual(answer.id);
      expect(taskTemplatesForAnswer[0].id).toEqual(taskTemplate.id);
      expect(taskTemplatesForAnswer[1].id).toEqual(taskTemplate2.id);
    });

    it('throws an error if adding a non-existant task template to an answer', async () => {
      const error =
        'insert into "task_suggestion" ("answerId", "id", "taskTemplateId")' +
        ' values ($1, $2, $3) returning "id" - insert or update on table "task_suggestion"' +
        ' violates foreign key constraint "task_suggestion_tasktemplateid_foreign"';

      await expect(
        TaskSuggestion.create({
          taskTemplateId: 'does-not-exist',
          answerId: answer.id,
        }),
      ).rejects.toMatchObject(new Error(error));
    });

    it('can remove an answer from a task suggestion', async () => {
      await TaskSuggestion.create({
        taskTemplateId: taskTemplate.id,
        answerId: answer.id,
      });
      const taskSuggestionsForAnswer = await TaskSuggestion.getForAnswer(answer.id);
      expect(taskSuggestionsForAnswer[0].id).toEqual(taskTemplate.id);

      const deleteResponse = await TaskSuggestion.delete({
        taskTemplateId: taskTemplate.id,
        answerId: answer.id,
      });
      expect(deleteResponse).toMatchObject([]);
      expect(await TaskSuggestion.getForAnswer(answer.id)).toEqual([]);
    });
  });
});
