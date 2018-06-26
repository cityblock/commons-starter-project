import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';
import cboCreate from '../../../app/graphql/queries/cbo-create-mutation.graphql';
import cboDelete from '../../../app/graphql/queries/cbo-delete-mutation.graphql';
import cboEdit from '../../../app/graphql/queries/cbo-edit-mutation.graphql';
import getCbo from '../../../app/graphql/queries/get-cbo.graphql';
import getCbosForCategory from '../../../app/graphql/queries/get-cbos-for-category.graphql';
import getCbos from '../../../app/graphql/queries/get-cbos.graphql';

import CBO from '../../models/cbo';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createCBO, createCBOCategory, createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const name = 'House of Black and White Hospice';
const name1 = 'Dragon fire heating';
const name2 = 'Direwolf surgery';
const name3 = 'Winter coat provision';
const input = {
  name,
  address: 'By the sea',
  city: 'Braavos',
  state: 'ES',
  zip: '10101',
  phone: '(000) 000-0000',
  url: 'www.facelessmen.com',
};
const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

const setup = async (trx: Transaction) => {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  const cboCategory = await createCBOCategory(trx, 'Animal Services');

  return { user, cboCategory };
};

describe('CBO resolver', () => {
  let txn = null as any;
  const cboCreateMutation = print(cboCreate);
  const cboEditMutation = print(cboEdit);
  const getCboQuery = print(getCbo);
  const getCbosQuery = print(getCbos);
  const getCbosForCategoryQuery = print(getCbosForCategory);
  const cboDeleteMutation = print(cboDelete);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve CBO', () => {
    it('gets all CBOs', async () => {
      const { user, cboCategory } = await setup(txn);

      const cbo1 = await CBO.create(
        {
          categoryId: cboCategory.id,
          ...input,
        },
        txn,
      );
      const cbo2 = await createCBO(txn, name2);

      const result = await graphql(schema, getCbosQuery, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });

      expect(result.data!.CBOs[0]).toMatchObject({
        id: cbo2.id,
        name: name2,
        categoryId: cbo2.categoryId,
        address: cbo2.address,
      });
      expect(result.data!.CBOs[1]).toMatchObject({
        id: cbo1.id,
        name: input.name,
        categoryId: cboCategory.id,
        address: input.address,
      });
    });

    it('gets all CBOs for a given category', async () => {
      const { user, cboCategory } = await setup(txn);
      const cboCategory2 = await createCBOCategory(txn);

      const cbo1 = await CBO.create(
        {
          categoryId: cboCategory.id,
          ...input,
          name: name1,
        },
        txn,
      );
      await CBO.create(
        {
          categoryId: cboCategory2.id,
          ...input,
          name: name2,
        },
        txn,
      );
      const cbo3 = await CBO.create(
        {
          categoryId: cboCategory.id,
          ...input,
          name: name3,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getCbosForCategoryQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { categoryId: cboCategory.id },
      );

      expect(result.data!.CBOsForCategory).toMatchObject([
        {
          id: cbo1.id,
          name: name1,
          categoryId: cboCategory.id,
        },
        {
          id: cbo3.id,
          name: name3,
          categoryId: cboCategory.id,
        },
      ]);
    });

    it('fetches a single CBO', async () => {
      const { user, cboCategory } = await setup(txn);

      const cbo = await CBO.create(
        {
          categoryId: cboCategory.id,
          ...input,
        },
        txn,
      );

      const result = await graphql(
        schema,
        getCboQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          CBOId: cbo.id,
        },
      );

      expect(result.data!.CBO).toMatchObject({
        id: cbo.id,
        name: input.name,
        categoryId: cboCategory.id,
        address: input.address,
      });
    });

    it('throws an error if CBO not found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();

      const result = await graphql(
        schema,
        getCboQuery,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        { CBOId: fakeId },
      );

      expect(result.errors![0].message).toMatch(`No such CBO: ${fakeId}`);
    });
  });

  describe('CBO create', () => {
    it('creates a new CBO', async () => {
      const { user, cboCategory } = await setup(txn);

      const result = await graphql(
        schema,
        cboCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          name: input.name,
          categoryId: cboCategory.id,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          phone: input.phone,
          url: input.url,
        },
      );

      expect(result.data!.CBOCreate).toMatchObject({
        name: input.name,
        categoryId: cboCategory.id,
        address: input.address,
      });
    });
  });

  describe('CBO edit', () => {
    it('edits a CBO', async () => {
      const { user, cboCategory } = await setup(txn);

      const newName = 'Winterfell Hospice Service';
      const newAddress = 'Winterfell';
      const newCity = 'the North';

      const cbo = await CBO.create(
        {
          categoryId: cboCategory.id,
          ...input,
        },
        txn,
      );

      const result = await graphql(
        schema,
        cboEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          name: newName,
          address: newAddress,
          city: newCity,
          CBOId: cbo.id,
        },
      );

      expect(result.data!.CBOEdit).toMatchObject({
        id: cbo.id,
        name: newName,
        categoryId: cboCategory.id,
        address: newAddress,
        city: newCity,
      });
    });
  });

  describe('CBO delete', () => {
    it('deletes a CBO', async () => {
      const { user } = await setup(txn);
      const cbo = await createCBO(txn);

      const result = await graphql(
        schema,
        cboDeleteMutation,
        null,
        {
          permissions,
          userId: user.id,
          testTransaction: txn,
        },
        {
          CBOId: cbo.id,
        },
      );

      expect(result.data!.CBODelete).toMatchObject({
        id: cbo.id,
      });
    });
  });
});
