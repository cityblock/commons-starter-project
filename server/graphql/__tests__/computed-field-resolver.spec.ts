import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { ComputedFieldDataTypes, UserRole } from 'schema';
import * as computedFieldCreate from '../../../app/graphql/queries/computed-field-create-mutation.graphql';
import * as computedFieldDelete from '../../../app/graphql/queries/computed-field-delete-mutation.graphql';
import * as getComputedField from '../../../app/graphql/queries/get-computed-field.graphql';
import * as getComputedFields from '../../../app/graphql/queries/get-computed-fields.graphql';

import Clinic from '../../models/clinic';
import ComputedField from '../../models/computed-field';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin' as UserRole;
const permissions = 'green';

interface ISetup {
  user: User;
}

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  return { user };
}

describe('computed field resolver', () => {
  let txn = null as any;

  const computedFieldQuery = print(getComputedField);
  const computedFieldsQuery = print(getComputedFields);
  const computedFieldCreateMutation = print(computedFieldCreate);
  const computedFieldDeleteMutation = print(computedFieldDelete);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve computed field', () => {
    it('fetches a computed field', async () => {
      const { user } = await setup(txn);
      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );
      const result = await graphql(
        schema,
        computedFieldQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        { computedFieldId: computedField.id },
      );
      expect(cloneDeep(result.data!.computedField)).toMatchObject({
        label: 'Computed Field',
      });
    });
  });

  describe('resolve computed fields', () => {
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
      const computedField2 = await ComputedField.create(
        {
          label: 'abc',
          slug: 'computed-field-2',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      const result = await graphql(schema, computedFieldsQuery, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      const computedFields = cloneDeep(result.data!.computedFields);
      const labels = computedFields.map((computedField: ComputedField) => computedField.label);

      expect(computedFields.length).toEqual(2);
      expect(labels).toContain(computedField1.label);
      expect(labels).toContain(computedField2.label);
    });

    it('returns computed fields in a custom order', async () => {
      const { user } = await setup(txn);
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
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );

      const result = await graphql(
        schema,
        computedFieldsQuery,
        null,
        {
          userId: user.id,
          permissions,
          testTransaction: txn,
        },
        {
          orderBy: 'labelDesc',
        },
      );
      expect(cloneDeep(result.data!.computedFields)).toMatchObject([
        {
          label: computedField1.label,
        },
        {
          label: computedField2.label,
        },
      ]);
    });
  });

  describe('computed field create', () => {
    it('creates a computed field with an auto-generated slug', async () => {
      const { user } = await setup(txn);
      const result = await graphql(
        schema,
        computedFieldCreateMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          label: 'Computed Field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
      );
      expect(cloneDeep(result.data!.computedFieldCreate)).toMatchObject({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean' as ComputedFieldDataTypes,
      });
    });
  });

  describe('computed field delete', () => {
    it('deletes a computed field', async () => {
      const { user } = await setup(txn);
      const computedField = await ComputedField.create(
        {
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean' as ComputedFieldDataTypes,
        },
        txn,
      );
      const result = await graphql(
        schema,
        computedFieldDeleteMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          computedFieldId: computedField.id,
        },
      );
      expect(cloneDeep(result.data!.computedFieldDelete).deletedAt).not.toBeFalsy();
    });
  });
});
