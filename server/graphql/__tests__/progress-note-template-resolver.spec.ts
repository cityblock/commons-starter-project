import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import ProgressNoteTemplate from '../../models/progress-note-template';
import schema from '../make-executable-schema';

describe('progressNoteTemplate resolver', () => {
  let db: Db;
  const userRole = 'admin';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('fetches a progress note template', async () => {
    const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' });
    const query = `{
        progressNoteTemplate(
          progressNoteTemplateId: "${progressNoteTemplate.id}"
        ) { title } }`;
    const result = await graphql(schema, query, null, { userRole });
    expect(cloneDeep(result.data!.progressNoteTemplate)).toMatchObject({
      title: 'title',
    });
  });

  it('creates a progress note template', async () => {
    const mutation = `mutation {
        progressNoteTemplateCreate(input: { title: "title" }) {
          title
        }
      }`;
    const result = await graphql(schema, mutation, null, { userRole });
    expect(cloneDeep(result.data!.progressNoteTemplateCreate)).toMatchObject({
      title: 'title',
    });
  });

  it('edits a progress note template', async () => {
    const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'title' });
    const mutation = `mutation {
        progressNoteTemplateEdit(input: {
          title: "new title", progressNoteTemplateId: "${progressNoteTemplate.id}"
        }) {
          title
        }
      }`;
    const result = await graphql(schema, mutation, null, { userRole });
    expect(cloneDeep(result.data!.progressNoteTemplateEdit)).toMatchObject({
      title: 'new title',
    });
  });

  it('deletes a progress note template', async () => {
    const progressNoteTemplate = await ProgressNoteTemplate.create({ title: 'housing' });
    const mutation = `mutation {
        progressNoteTemplateDelete(
          input: { progressNoteTemplateId: "${progressNoteTemplate.id}" }
        ) {
          title, deletedAt
        }
      }`;
    const result = await graphql(schema, mutation, null, { userRole });
    expect(cloneDeep(result.data!.progressNoteTemplateDelete).deletedAt).not.toBeFalsy();
  });

  describe('progress note templates', () => {
    it('returns progress note templates', async () => {
      const progressNoteTemplate1 = await ProgressNoteTemplate.create({ title: 'title 1' });
      const progressNoteTemplate2 = await ProgressNoteTemplate.create({ title: 'title 2' });

      const query = `{
        progressNoteTemplates { title }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.progressNoteTemplates)).toMatchObject([
        {
          title: progressNoteTemplate1.title,
        },
        {
          title: progressNoteTemplate2.title,
        },
      ]);
    });
  });
});
