import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import { createMockPokemonAndItems } from '../../spec-helpers';
import Item from '../item';

describe('item model', () => {
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
    it('returns a Pokemon with all of its related items', async () => {
      const pokemonItems = await createMockPokemonAndItems(txn);
      const pokemonQuery = await Item.get(pokemonItems.items[0].id, txn);
      expect(pokemonQuery).toMatchObject(pokemonItems.items[0]);
    });
  });

  describe('create', () => {
    it('creates new Item in the table', async () => {
      const newPokemonItems = await createMockPokemonAndItems(txn);
      expect(newPokemonItems.items.length).toEqual(2);
    });
  });

  describe('edit', () => {
    it('edits existing Item in the table', async () => {
      const newPokemonsItems = await createMockPokemonAndItems(txn);
      const editedPokemonItem = await Item.edit(
        newPokemonsItems.items[0].id,
        {
          name: 'Pointe Shoes',
        },
        txn,
      );
      const expectedPokemonItem = { ...newPokemonsItems.items[0] };
      expectedPokemonItem.name = 'Pointe Shoes';
      expectedPokemonItem.updatedAt = editedPokemonItem.updatedAt;
      expect(editedPokemonItem).toMatchObject(expectedPokemonItem);
    });
  });

  describe('delete', () => {
    it('adds a deletion timestamp to an Item in the table', async () => {
      const newPokemonsItems = await createMockPokemonAndItems(txn);
      const deletedItem = await Item.delete(newPokemonsItems.items[0].id, txn);
      expect(newPokemonsItems.items[0].deletedAt).toBeNull();
      expect(deletedItem.deletedAt).toBeTruthy();
    });
  });
});
