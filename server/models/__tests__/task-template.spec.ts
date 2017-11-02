import * as uuid from 'uuid/v4';
import Db from '../../db';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import TaskTemplate from '../task-template';

describe('task template model', () => {
  let db: Db;
  let goalSuggestionTemplate: GoalSuggestionTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    goalSuggestionTemplate = await GoalSuggestionTemplate.create({
      title: 'Housing',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('task template methods', () => {
    it('creates and retrieves a task template', async () => {
      const taskTemplate = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskTemplateById = await TaskTemplate.get(taskTemplate.id);

      expect(taskTemplateById).toMatchObject(taskTemplate);
    });

    it('throws an error when getting a taskTemplate by an invalid id', async () => {
      const fakeId = uuid();
      await expect(TaskTemplate.get(fakeId)).rejects.toMatch(`No such taskTemplate: ${fakeId}`);
    });

    it('edits task template', async () => {
      const taskTemplate = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskTemplateUpdated = await TaskTemplate.edit(taskTemplate.id, {
        title: 'Medical',
      });
      expect(taskTemplateUpdated.title).toEqual('Medical');
    });

    it('deletes task template', async () => {
      const taskTemplate = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      expect(taskTemplate.deletedAt).toBeNull();
      const deleted = await TaskTemplate.delete(taskTemplate.id);
      expect(deleted.deletedAt).not.toBeNull();
    });

    it('fetches all task template', async () => {
      const taskTemplate1 = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskTemplate2 = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });

      expect(await TaskTemplate.getAll()).toMatchObject([taskTemplate1, taskTemplate2]);
    });
  });
});
