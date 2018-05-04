import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { AnswerValueTypeOptions, ComputedFieldDataTypes, UserRole } from 'schema';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import ComputedField from '../../models/computed-field';
import Question from '../../models/question';
import User from '../../models/user';
import { createRiskArea } from '../../spec-helpers';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin' as UserRole;
const permissions = 'green';

interface ISetup {
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  return { user };
}

describe('computed field schema resolver', () => {
  let db: Db;
  let txn = null as any;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve computed fields schema', () => {
    it('returns computed fields', async () => {
      const { user } = await setup(txn);
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
          dataType: 'boolean' as ComputedFieldDataTypes,
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
      await Answer.create(
        {
          questionId: question.id,
          displayValue: 'Answer Display Value',
          value: 'true',
          valueType: 'boolean' as AnswerValueTypeOptions,
          order: 1,
          inSummary: false,
        },
        txn,
      );
      await Answer.create(
        {
          questionId: question.id,
          displayValue: 'Answer Display Value',
          value: 'false',
          valueType: 'boolean' as AnswerValueTypeOptions,
          order: 2,
          inSummary: false,
        },
        txn,
      );

      const query = `{
          computedFieldsSchema {
            computedFields {
              slug
              dataType
              values
            }
          }
        }`;

      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      expect(cloneDeep(result.data!.computedFieldsSchema)).toMatchObject({
        computedFields: [
          {
            slug: 'computed-field-1',
            dataType: 'boolean' as ComputedFieldDataTypes,
            values: ['true', 'false'],
          },
        ],
      });
    });
  });
});
