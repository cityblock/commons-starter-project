import { graphql, print } from 'graphql';
import { transaction } from 'objection';
import allPokemon from '../../../app/graphql/get-all-pokemon.graphql';
import getPokemon from '../../../app/graphql/pokemon-items.graphql';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import { createMockPokemons, createMockPokemonAndItems } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('pokemon resolver', () => {
  const pokemonQuery = print(allPokemon);
  const pokemonItemQuery = print(getPokemon);

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

  describe('allPokemon', () => {
    it('returns all Pokemon', async () => {
      const mockPokemon = await createMockPokemons(txn);
      const result = await graphql(schema, pokemonQuery, null, { testTransaction: txn });
      mockPokemon.map((p: Pokemon) => expect(result.data!.getAllPokemon).toContainEqual(p));
    });

    it('returns all Pokemon in order', async () => {
      await createMockPokemons(txn);
      const result = await graphql(schema, pokemonQuery, null, { testTransaction: txn });
      const resultIds = result.data!.getAllPokemon.map((p: Pokemon) => p.id);
      expect(resultIds).toMatchObject(resultIds.sort());
    });
  });

  describe('getPokemon', () => {
    it('returns a Pokemon and its relevant items', async () => {
      const mockPokemonItems = await createMockPokemonAndItems(txn);
      const result = await graphql(schema, pokemonItemQuery, null, {
        testTransaction: txn,
        id: mockPokemonItems.id,
      });
      expect(Object.keys(mockPokemonItems).sort()).toEqual(
        Object.keys(result.data!.pokemonItems).sort(),
      );
      expect(result.data!.pokemonItems.items.length).toEqual(mockPokemonItems.items.length);
    });
  });
});
