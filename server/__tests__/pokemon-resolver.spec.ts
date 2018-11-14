import { graphql, print } from 'graphql';

import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import { transaction } from 'objection';
import getAllPokemon from '../../app/graphql/queries/get-all-pokemon.graphql';
import getPokemon from '../../app/graphql/queries/get-pokemon.graphql';
import createPokemon from '../../app/graphql/queries/pokemon-create-mutation.graphql';
import deletePokemon from '../../app/graphql/queries/pokemon-delete-mutation.graphql';
import editPokemon from '../../app/graphql/queries/pokemon-edit-mutation.graphql';
import schema from '../graphql/make-executable-schema';
import Pokemon from '../models/Pokemon';
import pokemonSample from '../pokemon-sample';

describe('pokemon resolver', () => {
  let txn = null as any;
  const getAllPokemonQuery = print(getAllPokemon);
  const getPokemonQuery = print(getPokemon);
  const editPokemonQuery = print(editPokemon);
  const createPokemonQuery = print(createPokemon);
  const deletePokemonQuery = print(deletePokemon);
  const allPokemonInput = pokemonSample(0, 4);
  const [firstPokeInput] = allPokemonInput;

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('getAllPokemon resolver', async () => {
    it('resolves gql query for all pokemon', async () => {
      for (const pokeInput of allPokemonInput) {
        await Pokemon.create(pokeInput, txn);
      }

      const result: any = await graphql(schema, getAllPokemonQuery, null, txn);
      expect(result.data.allPokemon.length).toEqual(4);

      const firstPokemon = result.data.allPokemon[0];
      expect(firstPokemon.name).toEqual(allPokemonInput[0].name);
    });
  });

  describe('getPokemon resolver', () => {
    it('resolves gql query for a single pokemon', async () => {
      const poke = await Pokemon.create(firstPokeInput, txn);
      const { data }: ExecutionResultDataDefault = await graphql(
        schema,
        getPokemonQuery,
        null,
        txn,
        {
          pokemonId: poke.id,
        },
      );
      expect(data.pokemon).toEqual(
        expect.objectContaining({
          name: poke.name,
          pokemonNumber: poke.pokemonNumber,
        }),
      );
    });
  });

  describe('editPokemon resolver', () => {
    it('edits a pokemon object with fields specified and returns the updated object', async () => {
      const poke = await Pokemon.create(firstPokeInput, txn);
      const fieldsToEdit = { id: poke.id, name: 'Dan' };
      const { data }: ExecutionResultDataDefault = await graphql(
        schema,
        editPokemonQuery,
        null,
        txn,
        fieldsToEdit,
      );
      expect(data.pokemonEdit.name).toEqual('Dan');
    });
  });

  describe('createPokemon resolver', () => {
    it('creates and returns a pokemon object', async () => {
      const { data }: ExecutionResultDataDefault = await graphql(
        schema,
        createPokemonQuery,
        null,
        txn,
        firstPokeInput,
      );
      expect(data.pokemonCreate.name).toEqual(firstPokeInput.name);
    });
  });

  describe('deletePokemon resolver', () => {
    it('soft deletes and returns a pokemon object', async () => {
      let poke = null as any;
      for (const pokeInput of allPokemonInput) {
        poke = await Pokemon.create(pokeInput, txn);
      }
      await graphql(schema, deletePokemonQuery, null, txn, { id: poke.id });
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon).not.toContainEqual(poke);
    });
  });
});
