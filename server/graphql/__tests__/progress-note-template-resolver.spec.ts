import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Clinic from '../../models/clinic';
import ProgressNoteTemplate from '../../models/progress-note-template';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';
const permissions = 'green';

interface ISetup {
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  return { user };
}

describe('progressNoteTemplate resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches a progress note template', async () => {
    await transaction(ProgressNoteTemplate.knex(), async txn => {
      const { user } = await setup(txn);
      const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' }, txn);
      const query = `{
          progressNoteTemplate(
            progressNoteTemplateId: "${progressNoteTemplate.id}"
          ) { title } }`;
      const result = await graphql(schema, query, null, { userId: user.id, permissions, txn });
      expect(cloneDeep(result.data!.progressNoteTemplate)).toMatchObject({
        title: 'title',
      });
    });
  });

  it('creates a progress note template', async () => {
    await transaction(ProgressNoteTemplate.knex(), async txn => {
      const { user } = await setup(txn);
      const mutation = `mutation {
          progressNoteTemplateCreate(input: { title: "title" }) {
            title
          }
        }`;
      const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
      expect(cloneDeep(result.data!.progressNoteTemplateCreate)).toMatchObject({
        title: 'title',
      });
    });
  });

  it('edits a progress note template', async () => {
    await transaction(ProgressNoteTemplate.knex(), async txn => {
      const { user } = await setup(txn);
      const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' }, txn);
      const mutation = `mutation {
          progressNoteTemplateEdit(input: {
            title: "new title", progressNoteTemplateId: "${progressNoteTemplate.id}"
          }) {
            title
          }
        }`;
      const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
      expect(cloneDeep(result.data!.progressNoteTemplateEdit)).toMatchObject({
        title: 'new title',
      });
    });
  });

  it('deletes a progress note template', async () => {
    await transaction(ProgressNoteTemplate.knex(), async txn => {
      const { user } = await setup(txn);
      const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'housing' }, txn);
      const mutation = `mutation {
          progressNoteTemplateDelete(
            input: { progressNoteTemplateId: "${progressNoteTemplate.id}" }
          ) {
            title, deletedAt
          }
        }`;
      const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
      expect(cloneDeep(result.data!.progressNoteTemplateDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('progress note templates', () => {
    it('returns progress note templates', async () => {
      await transaction(ProgressNoteTemplate.knex(), async txn => {
        const { user } = await setup(txn);
        const progressNoteTemplate1 = await ProgressNoteTemplate.create({ title: 'title 1' }, txn);
        const progressNoteTemplate2 = await ProgressNoteTemplate.create({ title: 'title 2' }, txn);

        const query = `{
          progressNoteTemplates { title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions,
          txn,
        });
        const progressNoteTemplates = cloneDeep(result.data!.progressNoteTemplates);
        const titles = progressNoteTemplates.map(
          (progressNoteTemplate: ProgressNoteTemplate) => progressNoteTemplate.title,
        );
        expect(titles.length).toEqual(2);
        expect(titles).toContain(progressNoteTemplate1.title);
        expect(titles).toContain(progressNoteTemplate2.title);
      });
    });
  });
});
