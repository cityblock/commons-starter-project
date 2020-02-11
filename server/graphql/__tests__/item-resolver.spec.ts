import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import createItem from '../../../app/graphql/create-item.graphql';
import editItem from '../../../app/graphql/edit-item.graphql';
import getItem from '../../../app/graphql/get-item.graphql';
import { setupDb } from '../../lib/test-utils';
import { generateMockItemInput } from '../../models/__tests__/item.spec';
import Item from '../../models/item';
import schema from '../make-executable-schema';


describe('item resolver', () => {
  const getItemQuery = print(getItem);
  const createItemMutation = print(createItem);
  const editItemMutation = print(editItem);
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

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

  describe('get a single item', () => {
    it('should return a single item', async () => {
      // create an item
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);

      // get that item
      const result = await graphql(
        schema,
        getItemQuery,
        null,
        { testTransaction: txn },
        { itemId: newItem.id },
      );
      expect(result.errors).toBeUndefined();
      expect(result.data!.item.id).toEqual(newItem.id);
    });
  });

  describe('create an item', () => {
    it('should create and return an item', async () => {
      const mockItemInput = await generateMockItemInput(txn);
      const result = await graphql(
        schema,
        createItemMutation,
        null,
        { testTransaction: txn },
        mockItemInput,
      );
      expect(result.errors).toBeUndefined();
      expect(result.data!.createItem.name).toEqual(mockItemInput.name)
    });
  });

  describe('edit an item', () => {
    it('should edit and return an item', async () => {
      // create an item
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);

      // edit that item
      const newPrice = 1000000;
      const newHappiness = 14;
      const input = {
        itemId: newItem.id,
        price: newPrice,
        happiness: newHappiness
      };
      const result = await graphql(
        schema,
        editItemMutation,
        null,
        { testTransaction: txn },
        input,
      );
      expect(result.errors).toBeUndefined();
      expect(result.data!.editItem.price).toEqual(newPrice);
      expect(result.data!.editItem.happiness).toEqual(newHappiness);
    });
  });

});