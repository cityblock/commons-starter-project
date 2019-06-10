import 'jest-extended';
import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';

// DATA FIXTURES

const ITEM = {
  createdAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
  deletedAt: null,
  happiness: 55,
  id: '1f77d3da-e173-4c14-b252-b580fb548acf',
  imageUrl:
    'https://i0.wp.com/3.bp.blogspot.com/-N5HwBRxnyjk/V5tp0Cst4nI/AAAAAAAAnzg/J22q_lbPzv0A27sLzoPCcIIFPn-R1-4fgCK4B/s1600/enhanced-buzz-9890-1432569203-0.jpg',
  name: 'Amulet Coin',
  pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  price: 59,
  updatedAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
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

describe('item', () => {
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

  describe('get', () => {
    it('should get an item by id', async () => {
      const fetchedItem = await Item.get(ITEM.id, txn);
      expect(fetchedItem).toMatchObject(ITEM);
    });
  });

  describe('create', () => {
    it('should create an item', async () => {
      const createdItem = await Item.create(ITEM_CREATE, txn);
      expect(createdItem).toMatchObject(ITEM_CREATE);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      const deleted = await Item.delete(ITEM.id, txn);
      expect(deleted.deletedAt).toBeTruthy();
      expect(deleted.id).toBe(ITEM.id);
      await expect(Item.get(deleted.id, txn)).toReject();
    });
  });

  describe('edit', () => {
    it('should edit the item used here', async () => {
      const editedItem = await Item.edit(ITEM.id, ITEM_EDIT, txn);
      expect(editedItem).toMatchObject(ITEM_EDIT);
    });
  });
});
