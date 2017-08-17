import Db from '../../db';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import TaskTemplate from '../task-template';

describe('task template model', () => {
  let db: Db;
  let goalSuggestionTemplate: GoalSuggestionTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Housing' });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('task template methods', () => {
    it('creates and retrieves a task template', async () => {
      const taskSuggestion = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskSuggestionById = await TaskTemplate.get(taskSuggestion.id);

      expect(taskSuggestionById).toMatchObject(taskSuggestion);
    });

    it('throws an error when getting a taskSuggestion by an invalid id', async () => {
      const fakeId = 'fakeId';
      await expect(TaskTemplate.get(fakeId))
        .rejects
        .toMatch('No such taskTemplate: fakeId');
    });

    it('edits task template', async () => {
      const taskSuggestion = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskSuggestionUpdated = await TaskTemplate.edit(taskSuggestion.id, {
        title: 'Medical',
      });
      expect(taskSuggestionUpdated.title).toEqual('Medical');
    });

    it('deletes task template', async () => {
      const taskSuggestion = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      expect(taskSuggestion.deletedAt).toBeNull();
      const deleted = await TaskTemplate.delete(taskSuggestion.id);
      expect(deleted.deletedAt).not.toBeNull();
    });

    it('fetches all task template', async () => {
      const taskSuggestion1 = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskSuggestion2 = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });

      expect(await TaskTemplate.getAll()).toMatchObject([taskSuggestion1, taskSuggestion2]);
    });
  });
});
