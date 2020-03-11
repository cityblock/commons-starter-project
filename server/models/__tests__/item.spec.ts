import axios from 'axios';
import { transaction, Transaction } from 'objection';
import { v4 as uuid } from 'uuid';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import { IItemCreateInput, IItemEditInput } from '../item';

describe('item model', () => {
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupDb();
    axios.get = jest.fn();
  });

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
    console.error = jest.fn();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  afterEach(async () => {
    await txn.rollback();
  });
  describe('create and get item', () => {
    it('should create and retrieve an item', async () => {
      const itemFields: IItemCreateInput = {
        id: uuid(),
        name: 'item-create-test',
        pokemonId: '412e4c8a-00f1-4ccf-bf7d-475404ccd42f',
        price: 43,
        happiness: 29,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      try {
        const item = await Item.create(itemFields, txn);
        expect(item).toMatchObject(itemFields);
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('Failed to create a new item. error: ', err);
      }
    });
  });
  describe('get item by ID', () => {
    it('should get an item by id', async () => {
      const itemFields: IItemCreateInput = {
        id: uuid(),
        name: 'item-get-test',
        pokemonId: '412e4c8a-00f1-4ccf-bf7d-475404ccd42f',
        price: 7,
        happiness: 15,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      try {
        const item = await Item.create(itemFields, txn);
        const pokeonIditemId = item.id;
        const getItem = await Item.get(pokeonIditemId, txn);
        expect(getItem).toMatchObject(itemFields);
      } catch (pokemonCreateErr) {
        // tslint:disable-next-line: no-console
        console.log('failed to create a new pokeon in db', pokemonCreateErr);
      }
    });
  });
  describe('update item', () => {
    it('should update an item, retriev it and verify all new content', async () => {
      const itemFields: IItemCreateInput = {
        id: uuid(),
        name: 'item-update-before-test',
        pokemonId: '412e4c8a-00f1-4ccf-bf7d-475404ccd42f',
        price: 55,
        happiness: 30,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      const itemUpdateFields: IItemEditInput = {
        name: 'item-update-after-test',
        price: 60,
        happiness: 66,
        imageUrl:
          'https://static.giantbomb.com/uploads/square_medium/14/140474/2185101-baya_aranja_grande.png',
      };
      try {
        const item = await Item.create(itemFields, txn);
        const updatedItem = await Item.edit(item.id, itemUpdateFields, txn);
        expect(updatedItem).toMatchObject(itemUpdateFields);
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('test failed because: ', err);
      }
    });
  });
  describe('mark as deleted item', () => {
    it('should mark an item as deleted and then retriev it', async () => {
      const itemFields: IItemCreateInput = {
        id: uuid(),
        name: 'item-delete-test',
        pokemonId: '412e4c8a-00f1-4ccf-bf7d-475404ccd42f',
        price: 12,
        happiness: 8,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      try {
        const item = await Item.create(itemFields, txn);
        const itemId = item.id;
        const markedAsDeletedItem = await Item.delete(itemId, txn);
        expect(markedAsDeletedItem.deletedAt).not.toBeFalsy();
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('failed to created item or mark as deleted, error: ', err);
      }
    });
  });
});
