import * as uuid from 'uuid/v4';
import Db from '../../db';
import GoalSuggestionTemplate from '../goal-suggestion-template';

describe('goal suggestion template model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('goal suggestion template methods', () => {
    it('creates and retrieves a goal suggestion template', async () => {
      const goalSuggestion = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });
      const goalSuggestionById = await GoalSuggestionTemplate.get(goalSuggestion.id);

      expect(goalSuggestionById).toMatchObject(goalSuggestion);
    });

    it('throws an error when getting a goal suggestion template by an invalid id', async () => {
      const fakeId = uuid();
      await expect(GoalSuggestionTemplate.get(fakeId)).rejects.toMatch(
        `No such goalSuggestionTemplate: ${fakeId}`,
      );
    });

    it('edits goal suggestion template', async () => {
      const goalSuggestion = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });
      const goalSuggestionUpdated = await GoalSuggestionTemplate.edit(goalSuggestion.id, {
        title: 'fix Medical',
      });
      expect(goalSuggestionUpdated.title).toEqual('fix Medical');
    });

    it('deleted goal suggestion template', async () => {
      const goalSuggestion = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });
      expect(goalSuggestion.deletedAt).toBeNull();
      const deleted = await GoalSuggestionTemplate.delete(goalSuggestion.id);
      expect(deleted.deletedAt).not.toBeNull();
    });

    it('fetches all goal suggestions templates', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });
      const goalSuggestion2 = await GoalSuggestionTemplate.create({
        title: 'fix Medical',
      });

      expect(await GoalSuggestionTemplate.getAll()).toMatchObject([
        goalSuggestion1,
        goalSuggestion2,
      ]);
    });
  });
});
