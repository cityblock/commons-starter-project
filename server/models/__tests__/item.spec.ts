import { transaction, Transaction } from "objection";
import { setupDb } from '../../lib/test-utils';
import Item, { IItemInput } from '../item';
import Pokemon from "../pokemon";
import { mockPokemonInput } from "./pokemon.spec";


export async function generateMockItemInput(txn: Transaction): Promise<IItemInput> {
  const newPokemon = await Pokemon.create(mockPokemonInput, txn);
  const mockItemInput = {
    name: 'Thunder Stone',
    pokemonId: newPokemon.id,
    price: 10,
    happiness: 20,
    imageUrl: 'https://www.google.com',
  } as IItemInput;
  return mockItemInput;
}

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
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get', () => {
    it('should return a single item', async () => {
      // create an item
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);

      // get that item
      const item = await Item.get(newItem.id, txn);
      expect(item.id).toEqual(newItem.id);
    });
  });

  describe('create', () => {
    it('should create and return an item', async () => {
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);
      expect(newItem.name).toEqual(mockItemInput.name);
    });
  });

  describe('edit', () => {
    it('should edit and return an existing item', async () => {
      // create an item
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);

      // edit that item
      const newPrice = 1000000;
      const newHappiness = 14;
      const input = {
        price: newPrice,
        happiness: newHappiness,
      } as Partial<IItemInput>;
      const item = await Item.edit(newItem.id, input, txn);
      expect(item.price).toEqual(newPrice);
      expect(item.happiness).toEqual(newHappiness);
    });
  });

  describe('delete', () => {
    it('should "delete" an item and return it', async () => {
      // create an item
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);
      expect(newItem.deletedAt).toBeNull();

      // "delete" that item
      const item = await Item.delete(newItem.id, txn);
      expect(item.deletedAt).not.toBeNull();
    });
  });

});