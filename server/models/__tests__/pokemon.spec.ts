import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import { createMockPokemons, createMockPokemonAndItems } from '../../spec-helpers';
import Pokemon from '../pokemon';

describe('pokemon model', () => {
  let testDb = null as any;
  let txn = null as any;

  beforeAll(async () => {
    testDb = setupDb();
  });

  afterAll(async () => {
    testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('getAll', () => {
    it('returns all Pokemons ordered by pokemonId', async () => {
      const pokemonQuery = await Pokemon.getAll(txn);
      const listIds = pokemonQuery.map(pokemon => pokemon.id);
      expect(listIds).toMatchObject(listIds.sort());
    });
  });

  describe('get', () => {
    it('returns a Pokemon with all of its related items', async () => {
      const pokemonItems = await createMockPokemonAndItems(txn);
      const pokemonQuery = await Pokemon.get(pokemonItems.id, txn);
      expect(Object.keys(pokemonItems).sort()).toEqual(Object.keys(pokemonQuery).sort());
      expect(pokemonQuery.items.length).toEqual(pokemonItems.items.length);
    });
  });

  describe('create', () => {
    it('creates new Pokemon in the table', async () => {
      const newPokemon = await createMockPokemons(txn);
      expect(newPokemon.length).toEqual(3);
    });
  });

  describe('edit', () => {
    it('edits existing Pokemon in the table', async () => {
      const newPokemons = await createMockPokemons(txn);
      const editedPokemon = await Pokemon.edit(
        newPokemons[0].id,
        {
          name: 'Lauren the Fire-Breathing Dragon',
        },
        txn,
      );
      const expectedPokemon = { ...newPokemons[0] };
      expectedPokemon.name = 'Lauren the Fire-Breathing Dragon';
      expectedPokemon.updatedAt = editedPokemon.updatedAt;
      expect(editedPokemon).toMatchObject(expectedPokemon);
    });
  });

  describe('delete', () => {
    it('adds a deletion timestamp to a Pokemon in the table', async () => {
      const newPokemons = await createMockPokemons(txn);
      const deletedPokemon = await Pokemon.delete(newPokemons[0].id, txn);
      expect(newPokemons[0].deletedAt).toBeNull();
      expect(deletedPokemon.deletedAt).toBeTruthy();
    });
  });
});
