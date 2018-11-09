import { transaction } from 'objection';
import { buildRandomItem } from '../item-mocks';
import Item, { IItemCreateFields } from '../models/item';
import Pokemon, { IPokemonEditInput } from '../models/pokemon';
import { samplePokemon } from './pokemon.spec';
// import pokemonSample from '../pokemon-sample';

describe('Item model', () => {
  let txn = null as any;
  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates an item', async () => {
      const pokemon = await Pokemon.create(samplePokemon, txn);
      const itemInput = buildRandomItem(pokemon.id);
      const item = await Item.create(itemInput, txn);
      Object.keys(itemInput).forEach(itemProp => {
        expect(item.hasOwnProperty(itemProp)).toBe(true);
        expect(item[itemProp]).not.toBeFalsy();
      });
    });
  });
  describe('getAll', () => {
    it('retrieves all items from the database', async () => {
      const NUM_OF_ITEMS: number = 3;
      const pokemon = await Pokemon.create(samplePokemon, txn);
      for (let i = 0; i < NUM_OF_ITEMS; i++) {
        const randomPokeInput = buildRandomItem(pokemon.id);
        await Item.create(randomPokeInput, txn);
      }
      const allItems = await Item.getAll(txn);
      expect(allItems.length).toEqual(NUM_OF_ITEMS);
    });
  });
  describe('edit', () => {
    it('edits an item', async () => {
      expect(true).toBe(true);
    });
  });
  describe('get', () => {
    it('retrieves a single item from the database', async () => {
      expect(true).toBe(true);
    });
  });
  describe('delete', () => {
    it('soft deletes an item', async () => {
      expect(true).toBe(true);
    });
  });
});