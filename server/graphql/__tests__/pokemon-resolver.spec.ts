import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import createPokemon from '../../../app/graphql/create-pokemon.graphql';
import deletePokemon from '../../../app/graphql/delete-pokemon.graphql';
import editPokemon from '../../../app/graphql/edit-pokemon.graphql';
import getPokemon from '../../../app/graphql/get-pokemon.graphql'
import getPokemons from '../../../app/graphql/get-pokemons.graphql';
import { setupDb } from '../../lib/test-utils';
import { generateMockItemInput } from '../../models/__tests__/item.spec';
import { mockPokemonInput } from '../../models/__tests__/pokemon.spec';
import Item from '../../models/item';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';


describe('pokemon resolver', () => {
  const getPokemonsQuery = print(getPokemons);
  const getPokemonQuery = print(getPokemon);
  const createPokemonMutation = print(createPokemon);
  const editPokemonMutation = print(editPokemon);
  const deletePokemonMutation = print(deletePokemon);
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

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

  describe('get all pokemon', () => {
    it('should return all pokemon, ordered by pokemonNumber ascending', async () => {
      const expected = await Pokemon.getAll(txn);
      const result = await graphql(
        schema,
        getPokemonsQuery,
        null,
        { testTransaction: txn }
      );

      // NOTE: Postgres returns timestamps as Date objects rather than as strings, so we are unable
      // to simply test equivalence (result.data!.pokemons == expected).
      expect(result.errors).toBeUndefined();
      expect(result.data!.pokemons.length).toEqual(expected.length);
      expect(result.data!.pokemons[0].id).toEqual(expected[0].id);
    });
  });

  describe('get a single pokemon', () => {
    it('should return a single pokemon and associated items', async () => {
      // create a pokemon and item associated with that pokemon
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);

      // get that pokemon
      const expected = await Pokemon.get(mockItemInput.pokemonId, txn);
      const result = await graphql(
        schema,
        getPokemonQuery,
        null,
        { testTransaction: txn },
        { pokemonId: mockItemInput.pokemonId }
      );

      expect(result.errors).toBeUndefined();
      expect(result.data!.pokemon.id).toEqual(expected.id);
      expect(result.data!.pokemon.items).not.toHaveLength(0);
      expect(result.data!.pokemon.items[0].id).toEqual(newItem.id);
    });
  });

  describe('create a pokemon', () => {
    it('should create and return a pokemon', async () => {
      const result = await graphql(
        schema,
        createPokemonMutation,
        null,
        { testTransaction: txn },
        mockPokemonInput,
      );

      expect(result.errors).toBeUndefined();
      expect(result.data!.createPokemon.name).toEqual(mockPokemonInput.name);
    });
  });

  describe('edit a pokemon', () => {
    it('should edit and return an existing pokemon', async () => {
      // create a pokemon
      const newPokemon = await Pokemon.create(mockPokemonInput, txn);

      // edit that pokemon
      const newAttack = 9001;
      const newPokeType = 'dragon';
      const input = {
        pokemonId: newPokemon.id,
        attack: newAttack,
        pokeType: newPokeType,
      };
      const result = await graphql(
        schema,
        editPokemonMutation,
        null,
        { testTransaction: txn },
        input,
      );

      expect(result.errors).toBeUndefined();
      expect(result.data!.editPokemon.attack).toEqual(newAttack);
      expect(result.data!.editPokemon.pokeType).toEqual(newPokeType);
    });
  });

  describe('delete a pokemon', () => {
    it('should delete and return an existing pokemon', async () => {
      // create a pokemon
      const newPokemon = await Pokemon.create(mockPokemonInput, txn);
      expect(newPokemon.deletedAt).toBeNull();

      // "delete" that pokemon
      const result = await graphql(
        schema,
        deletePokemonMutation,
        null,
        { testTransaction: txn },
        { pokemonId: newPokemon.id },
      );
      expect(result.errors).toBeUndefined();
      expect(result.data!.deletePokemon.deletedAt).not.toBeNull();
    });
  });

});