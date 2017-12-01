import * as uuid from 'uuid/v4';
import Db from '../../db';
import GoalSuggestionTemplate from '../goal-suggestion-template';

const order = 'asc';
const orderBy = 'createdAt';

describe('goal suggestion template model', () => {
  beforeEach(async () => {
    await Db.get();
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
      expect(goalSuggestion.deletedAt).toBeFalsy();
      const deleted = await GoalSuggestionTemplate.delete(goalSuggestion.id);
      expect(deleted.deletedAt).not.toBeFalsy();
    });

    it('fetches all goal suggestions templates', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create({
        title: 'fix Medical',
      });
      const goalSuggestion2 = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });

      expect(
        await GoalSuggestionTemplate.getAll({
          orderBy,
          order,
        }),
      ).toMatchObject([goalSuggestion1, goalSuggestion2]);
    });

    it('fetches goal suggetions templates with a custom order', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create({
        title: 'fix Medical',
      });
      const goalSuggestion2 = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });

      expect(
        await GoalSuggestionTemplate.getAll({
          orderBy: 'title',
          order: 'asc',
        }),
      ).toMatchObject([goalSuggestion2, goalSuggestion1]);
    });
  });
});
