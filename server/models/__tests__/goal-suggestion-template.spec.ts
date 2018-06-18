import { transaction } from 'objection';
import uuid from 'uuid/v4';

import GoalSuggestionTemplate from '../goal-suggestion-template';

const order = 'asc';
const orderBy = 'createdAt';

describe('goal suggestion template model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(GoalSuggestionTemplate.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('goal suggestion template methods', () => {
    it('creates and retrieves a goal suggestion template', async () => {
      const goalSuggestion = await GoalSuggestionTemplate.create(
        {
          title: 'fix Housing',
        },
        txn,
      );
      const goalSuggestionById = await GoalSuggestionTemplate.get(goalSuggestion.id, txn);

      expect(goalSuggestionById).toMatchObject(goalSuggestion);
    });

    it('throws an error when getting a goal suggestion template by an invalid id', async () => {
      const fakeId = uuid();
      await expect(GoalSuggestionTemplate.get(fakeId, txn)).rejects.toMatch(
        `No such goalSuggestionTemplate: ${fakeId}`,
      );
    });

    it('edits goal suggestion template', async () => {
      const goalSuggestion = await GoalSuggestionTemplate.create(
        {
          title: 'fix Housing',
        },
        txn,
      );
      const goalSuggestionUpdated = await GoalSuggestionTemplate.edit(
        goalSuggestion.id,
        {
          title: 'fix Medical',
        },
        txn,
      );
      expect(goalSuggestionUpdated.title).toEqual('fix Medical');
    });

    it('deleted goal suggestion template', async () => {
      const goalSuggestion = await GoalSuggestionTemplate.create(
        {
          title: 'fix Housing',
        },
        txn,
      );
      expect(goalSuggestion.deletedAt).toBeFalsy();
      const deleted = await GoalSuggestionTemplate.delete(goalSuggestion.id, txn);
      expect(deleted.deletedAt).not.toBeFalsy();
    });

    it('fetches all goal suggestions templates', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create(
        {
          title: 'fix Medical',
        },
        txn,
      );
      const goalSuggestion2 = await GoalSuggestionTemplate.create(
        {
          title: 'fix Housing',
        },
        txn,
      );

      expect(
        await GoalSuggestionTemplate.getAll(
          {
            orderBy,
            order,
          },
          txn,
        ),
      ).toMatchObject([goalSuggestion1, goalSuggestion2]);
    });

    it('fetches goal suggetions templates with a custom order', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create(
        {
          title: 'fix Medical',
        },
        txn,
      );
      const goalSuggestion2 = await GoalSuggestionTemplate.create(
        {
          title: 'fix Housing',
        },
        txn,
      );

      expect(
        await GoalSuggestionTemplate.getAll(
          {
            orderBy: 'title',
            order: 'asc',
          },
          txn,
        ),
      ).toMatchObject([goalSuggestion2, goalSuggestion1]);
    });
  });
});
