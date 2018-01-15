import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createRiskArea } from '../../spec-helpers';
import Answer from '../answer';
import ComputedField from '../computed-field';
import Question from '../question';

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
      await transaction(ComputedField.knex(), async txn => {
        const computedField = await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );
        const computedFieldById = await ComputedField.get(computedField.id, txn);

        expect(computedFieldById).toMatchObject(computedField);
      });
    });

    it('throws an error when creating a computed field with a duplicate slug', async () => {
      await transaction(ComputedField.knex(), async txn => {
        let error = '';

        await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );

        try {
          await ComputedField.create(
            {
              label: 'Different Computed Field with Same Slug',
              slug: 'computed-field',
              dataType: 'string',
            },
            txn,
          );
        } catch (err) {
          error = err.message;
        }

        expect(error).toMatch('duplicate key value violates unique constraint');
      });
    });
    it('throws an error when creating a computed field with a duplicate slug if original is deleted', async () => {
      await transaction(ComputedField.knex(), async txn => {
        let error = '';

        const computedField = await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );

        await ComputedField.delete(computedField.id, txn);

        try {
          await ComputedField.create(
            {
              label: 'Same Slug as Deleted Computed Field',
              slug: 'computed-field',
              dataType: 'string',
            },
            txn,
          );
        } catch (err) {
          error = err.message;
        }

        expect(error).toMatch('duplicate key value violates unique constraint');
      });
    });

    it('thows an error when getting computed field by an invalid id', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const fakeId = uuid();
        await expect(ComputedField.get(fakeId, txn)).rejects.toMatch(
          `No such computed field: ${fakeId}`,
        );
      });
    });

    it('gets a computed field by slug', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const slug = 'computed-field';

        const computedField = await ComputedField.create(
          {
            label: 'Computed Field',
            slug,
            dataType: 'boolean',
          },
          txn,
        );

        const fetchedComputedField = await ComputedField.getBySlug(slug, txn);

        expect(fetchedComputedField).toMatchObject(computedField);
      });
    });

    it('returns null if getting a computed field by an unknown slug', async () => {
      await transaction(ComputedField.knex(), async txn => {
        await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );

        const fetchedComputedField = await ComputedField.getBySlug('fake-slug', txn);

        expect(fetchedComputedField).toBeNull();
      });
    });

    it('gets a computed field by label', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const label = 'Computed Field';

        const computedField = await ComputedField.create(
          {
            label,
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );

        const fetchedComputedField = await ComputedField.getByLabel(label, txn);

        expect(fetchedComputedField).toMatchObject(computedField);
      });
    });

    it('returns null if getting a computed field by an unknown label', async () => {
      await transaction(ComputedField.knex(), async txn => {
        await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );

        const fetchedComputedField = await ComputedField.getByLabel('Fake Label', txn);

        expect(fetchedComputedField).toBeNull();
      });
    });

    it('gets all computed fields', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField1 = await ComputedField.create(
          {
            label: 'def',
            slug: 'computed-field-1',
            dataType: 'boolean',
          },
          txn,
        );
        const computedField2 = await ComputedField.create(
          {
            label: 'abc',
            slug: 'computed-field-2',
            dataType: 'number',
          },
          txn,
        );

        expect(await ComputedField.getAll({ orderBy, order }, txn)).toMatchObject([
          computedField1,
          computedField2,
        ]);
      });
    });

    it('gets all computed fields in a custom order', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField1 = await ComputedField.create(
          {
            label: 'def',
            slug: 'computed-field-1',
            dataType: 'boolean',
          },
          txn,
        );
        const computedField2 = await ComputedField.create(
          {
            label: 'abc',
            slug: 'computed-field-2',
            dataType: 'number',
          },
          txn,
        );

        expect(await ComputedField.getAll({ orderBy: 'label', order: 'asc' }, txn)).toMatchObject([
          computedField2,
          computedField1,
        ]);
      });
    });

    it('gets the computed fields for schema', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField1 = await ComputedField.create(
          {
            label: 'def',
            slug: 'computed-field-1',
            dataType: 'boolean',
          },
          txn,
        );
        await ComputedField.create(
          {
            label: 'abc',
            slug: 'computed-field-2',
            dataType: 'number',
          },
          txn,
        );
        const riskArea = await createRiskArea({ title: 'Housing' }, txn);
        const question = await Question.create(
          {
            riskAreaId: riskArea.id,
            type: 'riskArea',
            title: 'Question',
            answerType: 'boolean' as any,
            order: 1,
            computedFieldId: computedField1.id,
          },
          txn,
        );
        const answer = await Answer.create(
          {
            questionId: question.id,
            displayValue: 'Answer Display Value',
            value: 'true',
            valueType: 'boolean',
            inSummary: false,
            order: 1,
          },
          txn,
        );
        const fetchedComputedFields = await ComputedField.getForSchema(
          {
            orderBy: 'slug',
            order: 'asc',
          },
          txn,
        );
        const fetchedComputedField = fetchedComputedFields[0];

        expect(fetchedComputedFields.length).toEqual(1);
        expect(fetchedComputedField.slug).toEqual(computedField1.slug);
        expect(fetchedComputedField.question.id).toEqual(question.id);
        expect(fetchedComputedField.question.answers.length).toEqual(1);
        expect(fetchedComputedField.question.answers[0].id).toEqual(answer.id);
      });
    });

    it('deletes a computed field', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField = await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );

        expect(computedField.deletedAt).toBeFalsy();

        const deletedComputedField = await ComputedField.delete(computedField.id, txn);

        expect(deletedComputedField.deletedAt).not.toBeFalsy();

        await expect(ComputedField.get(computedField.id, txn)).rejects.toMatch(
          `No such computed field: ${computedField.id}`,
        );
      });
    });
  });
});
