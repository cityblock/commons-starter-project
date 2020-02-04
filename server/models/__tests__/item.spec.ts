import { transaction, Transaction } from "objection";
import { setupDb } from '../../lib/test-utils';
import Item, { IItemCreateInput, IItemEditInput } from '../item';


describe('item model', () => {
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
    console.error = jest.fn();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get', () => {
    it('should return a single item', async () => {
      const itemId = '0471cbdd-2e1f-4604-8c16-55b4ffe92a7a';
      const item = await Item.get(itemId, txn);
      expect(item.id).toEqual(itemId);
    });
  });

  describe('create', () => {
    it('should create and return an item', async () => {
      const itemName = 'Thunder Stone';
      const input = {
        name: itemName,
        pokemonId: '01515123-9476-414b-b328-ea627cc317f4',
        price: 10,
        happiness: 20,
        imageUrl: 'https://www.google.com',
      } as IItemCreateInput;
      const item = await Item.create(input, txn);
      expect(item.name).toEqual(itemName);
    });
  });

  describe('edit', () => {
    it('should edit and return an existing item', async () => {
      const itemId = '0471cbdd-2e1f-4604-8c16-55b4ffe92a7a';
      const newPrice = 1000000;
      const newHappiness = 14;
      const input = {
        price: newPrice,
        happiness: newHappiness,
      } as IItemEditInput;
      const item = await Item.edit(itemId, input, txn);
      expect(item.price).toEqual(newPrice);
      expect(item.happiness).toEqual(newHappiness);
    });
  });

  describe('delete', () => {
    it('should "delete" an item and return it', async () => {
      const itemId = '0471cbdd-2e1f-4604-8c16-55b4ffe92a7a';
      const item = await Item.delete(itemId, txn);
      expect(item.deletedAt).not.toBeNull();
    });
  });

});