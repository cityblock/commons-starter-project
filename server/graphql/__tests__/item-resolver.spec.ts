import { graphql, print } from 'graphql';
import 'jest-extended';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import getItem from '../../../app/graphql/queries/get-item.graphql';
import itemCreate from '../../../app/graphql/queries/item-create-mutation.graphql';
import itemDelete from '../../../app/graphql/queries/item-delete-mutation.graphql';
import itemEdit from '../../../app/graphql/queries/item-edit-mutation.graphql';
import { setupDb, testGraphqlContext } from '../../lib/test-utils';
import Item from '../../models/item';
import schema from '../make-executable-schema';

// TESTING FIXTURES
const ITEM = {
  happiness: 55,
  id: '1f77d3da-e173-4c14-b252-b580fb548acf',
  imageUrl:
    'https://i0.wp.com/3.bp.blogspot.com/-N5HwBRxnyjk/V5tp0Cst4nI/AAAAAAAAnzg/J22q_lbPzv0A27sLzoPCcIIFPn-R1-4fgCK4B/s1600/enhanced-buzz-9890-1432569203-0.jpg',
  name: 'Amulet Coin',
  pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  price: 59,
};

const ITEM_CREATE = {
  happiness: 55,
  imageUrl:
    'https://i0.wp.com/3.bp.blogspot.com/-N5HwBRxnyjk/V5tp0Cst4nI/AAAAAAAAnzg/J22q_lbPzv0A27sLzoPCcIIFPn-R1-4fgCK4B/s1600/enhanced-buzz-9890-1432569203-0.jpg',
  name: 'a non-dangerous pocket knife',
  pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  price: 59,
};

const ITEM_EDIT = {
  happiness: 99,
  name: 'a socialist item',
  pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  price: 0,
};

describe('item resolver', () => {
  const getItemQuery = print(getItem);
  const itemCreateMutation = print(itemCreate);
  const itemDeleteMutation = print(itemDelete);
  const itemEditMutation = print(itemEdit);

  let testDb = null as any;
  let txn = null as any;

  beforeAll(async () => {
    testDb = setupDb();
  });

  afterAll(async () => {
    testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve an item', () => {
    it('fetches an item', async () => {
      const result = await graphql(
        schema,
        getItemQuery,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          itemId: ITEM.id,
        },
      );

      const cloned = cloneDeep(result.data!.item);
      expect(cloned).toMatchObject(ITEM);
    });
  });

  describe('resolve creating an item', () => {
    it('creates an item', async () => {
      const result = await graphql(
        schema,
        itemCreateMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
          ITEM_CREATE,
      );

      const cloned = cloneDeep(result.data!.item);
      expect(cloned).toMatchObject(ITEM_CREATE);
    });
  });

  describe('resolve editing an item', () => {
    it('edits an item', async () => {
      const result = await graphql(
        schema,
        itemEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
          ITEM_EDIT,
      );

      const cloned = cloneDeep(result.data!.item);
      expect(cloned).toMatchObject(ITEM_EDIT);
    });
  });

  describe('resolve deleting an item', () => {
    it('deletes an item', async () => {
      const result = await graphql(
        schema,
        itemDeleteMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          itemId: ITEM.id,
        },
      );

      const cloned = cloneDeep(result.data!.item);
      expect(cloned.deletedAt).toBeTruthy();
      expect(cloned.id).toBe(ITEM.id);
    });
  });

});
