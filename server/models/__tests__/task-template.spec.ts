import { transaction, Transaction } from 'objection';
import { Priority, UserRole } from 'schema';
import * as uuid from 'uuid/v4';

import { createCBOCategory } from '../../spec-helpers';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import TaskTemplate from '../task-template';

interface ISetup {
  goalSuggestionTemplate: GoalSuggestionTemplate;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    {
      title: 'Housing',
    },
    txn,
  );
  return { goalSuggestionTemplate };
}

describe('task template model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(TaskTemplate.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('task template methods', () => {
    it('creates and retrieves a task template', async () => {
      const { goalSuggestionTemplate } = await setup(txn);

      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const taskTemplateById = await TaskTemplate.get(taskTemplate.id, txn);

      expect(taskTemplateById).toMatchObject(taskTemplate);
    });

    it('creates and retrieves a task template with CBO category', async () => {
      const { goalSuggestionTemplate } = await setup(txn);
      const CBOCategory = await createCBOCategory(txn);

      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
          CBOCategoryId: CBOCategory.id,
        },
        txn,
      );
      const taskTemplateById = await TaskTemplate.get(taskTemplate.id, txn);

      expect(taskTemplateById).toMatchObject(taskTemplate);
    });

    it('throws an error when getting a taskTemplate by an invalid id', async () => {
      const fakeId = uuid();
      await expect(TaskTemplate.get(fakeId, txn)).rejects.toMatch(
        `No such taskTemplate: ${fakeId}`,
      );
    });

    it('edits task template', async () => {
      const { goalSuggestionTemplate } = await setup(txn);

      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const taskTemplateUpdated = await TaskTemplate.edit(
        taskTemplate.id,
        {
          title: 'Medical',
        },
        txn,
      );
      expect(taskTemplateUpdated.title).toEqual('Medical');
    });

    it('deletes task template', async () => {
      const { goalSuggestionTemplate } = await setup(txn);

      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      expect(taskTemplate.deletedAt).toBeFalsy();
      const deleted = await TaskTemplate.delete(taskTemplate.id, txn);
      expect(deleted.deletedAt).not.toBeFalsy();
    });

    it('fetches all task template', async () => {
      const { goalSuggestionTemplate } = await setup(txn);

      const taskTemplate1 = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const taskTemplate2 = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );

      expect(await TaskTemplate.getAll(txn)).toMatchObject([taskTemplate1, taskTemplate2]);
    });
  });
});
