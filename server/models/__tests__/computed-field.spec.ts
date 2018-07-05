import { transaction } from 'objection';
import { AnswerTypeOptions, AnswerValueTypeOptions, ComputedFieldDataTypes } from 'schema';
import uuid from 'uuid/v4';
import { createRiskArea } from '../../spec-helpers';
import Answer from '../answer';
import ComputedField from '../computed-field';
import Question from '../question';

const order = 'asc';
const orderBy = 'createdAt';

describe('computed field model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('computed field methods', () => {
    it('creates and retrieves a computed field', async () => {
      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );
      const computedFieldById = await ComputedField.get(computedField.id, txn);

      expect(computedFieldById).toMatchObject(computedField);
    });

    it('throws an error when creating a computed field with a duplicate slug', async () => {
      let error = '';

      await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      try {
        await ComputedField.create(
          {
            label: 'Different Computed Field with Same Slug',
            slug: 'computed-field',
            dataType: 'string' as ComputedFieldDataTypes,
          },
          txn,
        );
      } catch (err) {
        error = err.message;
      }

      expect(error).toMatch('duplicate key value violates unique constraint');
    });

    it('throws an error when creating a computed field with a duplicate slug if original is deleted', async () => {
      let error = '';

      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      await ComputedField.delete(computedField.id, txn);

      try {
        await ComputedField.create(
          {
            label: 'Same Slug as Deleted Computed Field',
            slug: 'computed-field',
            dataType: 'string' as ComputedFieldDataTypes,
          },
          txn,
        );
      } catch (err) {
        error = err.message;
      }

      expect(error).toMatch('duplicate key value violates unique constraint');
    });

    it('thows an error when getting computed field by an invalid id', async () => {
      const fakeId = uuid();
      await expect(ComputedField.get(fakeId, txn)).rejects.toMatch(
        `No such computed field: ${fakeId}`,
      );
    });

    it('gets a computed field by slug', async () => {
      const slug = 'computed-field';

      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug,
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      const fetchedComputedField = await ComputedField.getBySlug(slug, txn);

      expect(fetchedComputedField).toMatchObject(computedField);
    });

    it('returns null if getting a computed field by an unknown slug', async () => {
      await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      const fetchedComputedField = await ComputedField.getBySlug('fake-slug', txn);

      expect(fetchedComputedField).toBeNull();
    });

    it('gets a computed field by label', async () => {
      const label = 'Computed Field';

      const computedField = await ComputedField.create(
        {
          label,
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      const fetchedComputedField = await ComputedField.getByLabel(label, txn);

      expect(fetchedComputedField).toMatchObject(computedField);
    });

    it('returns null if getting a computed field by an unknown label', async () => {
      await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      const fetchedComputedField = await ComputedField.getByLabel('Fake Label', txn);

      expect(fetchedComputedField).toBeNull();
    });

    it('gets all computed fields', async () => {
      const computedField1 = await ComputedField.create(
        {
          label: 'def',
          slug: 'computed-field-1',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );
      const computedField2 = await ComputedField.create(
        {
          label: 'abc',
          slug: 'computed-field-2',
          dataType: 'number' as ComputedFieldDataTypes,
        },
        txn,
      );

      expect(await ComputedField.getAll({ orderBy, order }, txn)).toMatchObject([
        computedField1,
        computedField2,
      ]);
    });

    it('gets all computed fields in a custom order', async () => {
      const computedField1 = await ComputedField.create(
        {
          label: 'def',
          slug: 'computed-field-1',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );
      const computedField2 = await ComputedField.create(
        {
          label: 'abc',
          slug: 'computed-field-2',
          dataType: 'number' as ComputedFieldDataTypes,
        },
        txn,
      );

      expect(await ComputedField.getAll({ orderBy: 'label', order: 'asc' }, txn)).toMatchObject([
        computedField2,
        computedField1,
      ]);
    });

    it('gets the computed fields for schema', async () => {
      const computedField1 = await ComputedField.create(
        {
          label: 'def',
          slug: 'computed-field-1',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );
      await ComputedField.create(
        {
          label: 'abc',
          slug: 'computed-field-2',
          dataType: 'number' as ComputedFieldDataTypes,
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
          valueType: 'boolean' as AnswerValueTypeOptions,
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

    it('deletes a computed field', async () => {
      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
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

    it('eager loads risk area from undeleted questions only', async () => {
      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'number' as ComputedFieldDataTypes,
        },
        txn,
      );
      const riskArea = await createRiskArea({ title: 'Housing' }, txn);
      const question = await Question.create(
        {
          title: 'like writing tests?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
          computedFieldId: computedField.id,
        },
        txn,
      );

      let eagerComputedField = await ComputedField.query(txn)
        .eager('riskArea')
        .findOne({ id: computedField.id, deletedAt: null });

      expect(eagerComputedField).toBeTruthy();
      expect(eagerComputedField!.riskArea).toMatchObject(riskArea);

      await Question.delete(question.id, txn);

      eagerComputedField = await ComputedField.query(txn)
        .eager('riskArea')
        .findOne({ id: computedField.id, deletedAt: null });

      expect(eagerComputedField).toBeTruthy();
      expect(eagerComputedField!.riskArea).toBeFalsy();
    });
  });
});
