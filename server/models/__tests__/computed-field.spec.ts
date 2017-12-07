import * as uuid from 'uuid/v4';
import Db from '../../db';
import ComputedField from '../computed-field';

const order = 'asc';
const orderBy = 'createdAt';

describe('computed field model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('computed field methods', () => {
    it('creates and retrieves a computed field', async () => {
      const computedField = await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });
      const computedFieldById = await ComputedField.get(computedField.id);

      expect(computedFieldById).toMatchObject(computedField);
    });

    it('throws an error when creating a computed field with a duplicate slug', async () => {
      let error = '';
      let error2 = '';

      const computedField = await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });

      try {
        await ComputedField.create({
          label: 'Different Computed Field with Same Slug',
          slug: 'computed-field',
          dataType: 'string',
        });
      } catch (err) {
        error = err.message;
      }

      expect(error).toMatch('duplicate key value violates unique constraint');

      // It should also break when the original is deleted
      await ComputedField.delete(computedField.id);

      try {
        await ComputedField.create({
          label: 'Same Slug as Deleted Computed Field',
          slug: 'computed-field',
          dataType: 'string',
        });
      } catch (err) {
        error2 = err.message;
      }

      expect(error2).toMatch('duplicate key value violates unique constraint');
    });

    it('thows an error when getting computed field by an invalid id', async () => {
      const fakeId = uuid();
      await expect(ComputedField.get(fakeId)).rejects.toMatch(`No such computed field: ${fakeId}`);
    });

    it('gets a computed field by slug', async () => {
      const slug = 'computed-field';

      const computedField = await ComputedField.create({
        label: 'Computed Field',
        slug,
        dataType: 'boolean',
      });

      const fetchedComputedField = await ComputedField.getBySlug(slug);

      expect(fetchedComputedField).toMatchObject(computedField);
    });

    it('returns null if getting a computed field by an unknown slug', async () => {
      await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });

      const fetchedComputedField = await ComputedField.getBySlug('fake-slug');

      expect(fetchedComputedField).toBeNull();
    });

    it('gets a computed field by label', async () => {
      const label = 'Computed Field';

      const computedField = await ComputedField.create({
        label,
        slug: 'computed-field',
        dataType: 'boolean',
      });

      const fetchedComputedField = await ComputedField.getByLabel(label);

      expect(fetchedComputedField).toMatchObject(computedField);
    });

    it('returns null if getting a computed field by an unknown label', async () => {
      await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });

      const fetchedComputedField = await ComputedField.getByLabel('Fake Label');

      expect(fetchedComputedField).toBeNull();
    });

    it('gets all computed fields', async () => {
      const computedField1 = await ComputedField.create({
        label: 'def',
        slug: 'computed-field-1',
        dataType: 'boolean',
      });
      const computedField2 = await ComputedField.create({
        label: 'abc',
        slug: 'computed-field-2',
        dataType: 'number',
      });

      expect(await ComputedField.getAll({ orderBy, order })).toMatchObject([
        computedField1,
        computedField2,
      ]);
    });

    it('gets all computed fields in a custom order', async () => {
      const computedField1 = await ComputedField.create({
        label: 'def',
        slug: 'computed-field-1',
        dataType: 'boolean',
      });
      const computedField2 = await ComputedField.create({
        label: 'abc',
        slug: 'computed-field-2',
        dataType: 'number',
      });

      expect(await ComputedField.getAll({ orderBy: 'label', order: 'asc' })).toMatchObject([
        computedField2,
        computedField1,
      ]);
    });

    it('deletes a computed field', async () => {
      const computedField = await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });

      expect(computedField.deletedAt).toBeFalsy();

      const deletedComputedField = await ComputedField.delete(computedField.id);

      expect(deletedComputedField.deletedAt).not.toBeFalsy();

      await expect(ComputedField.get(computedField.id)).rejects.toMatch(
        `No such computed field: ${computedField.id}`,
      );
    });
  });
});
