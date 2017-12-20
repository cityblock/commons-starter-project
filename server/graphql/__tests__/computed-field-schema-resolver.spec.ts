import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import ComputedField from '../../models/computed-field';
import Question from '../../models/question';
import { createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('computed field schema resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve computed fields schema', () => {
    it('returns computed fields', async () => {
      const computedField1 = await ComputedField.create({
        label: 'def',
        slug: 'computed-field-1',
        dataType: 'boolean',
      });
      await ComputedField.create({
        label: 'abc',
        slug: 'computed-field-2',
        dataType: 'boolean',
      });
      const riskArea = await createRiskArea({ title: 'Housing' });
      const question = await Question.create({
        riskAreaId: riskArea.id,
        type: 'riskArea',
        title: 'Question',
        answerType: 'boolean' as any,
        order: 1,
        computedFieldId: computedField1.id,
      });
      await Answer.create({
        questionId: question.id,
        displayValue: 'Answer Display Value',
        value: 'true',
        valueType: 'boolean',
        order: 1,
      });
      await Answer.create({
        questionId: question.id,
        displayValue: 'Answer Display Value',
        value: 'false',
        valueType: 'boolean',
        order: 2,
      });

      const query = `{
        computedFieldsSchema {
          computedFields {
            slug
            dataType
            values
          }
        }
      }`;

      const result = await graphql(schema, query, null, { db });
      expect(cloneDeep(result.data!.computedFieldsSchema)).toMatchObject({
        computedFields: [
          {
            slug: 'computed-field-1',
            dataType: 'boolean',
            values: ['true', 'false'],
          },
        ],
      });
    });
  });
});
