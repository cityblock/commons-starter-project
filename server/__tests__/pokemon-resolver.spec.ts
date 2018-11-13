import { graphql, print } from 'graphql';

import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import { transaction } from 'objection';
import getAllPokemon from '../../app/graphql/queries/get-all-pokemon.graphql';
import getPokemon from '../../app/graphql/queries/get-pokemon.graphql';
import schema from '../graphql/make-executable-schema';
import Pokemon from '../models/Pokemon';
import pokemonSample from '../pokemon-sample';

describe('pokemon resolver', () => {
  let txn = null as any;
  const getAllPokemonQuery = print(getAllPokemon);
  const getPokemonQuery = print(getPokemon);
  const allPokemonInput = pokemonSample(0, 4);

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
      const [firstPokeInput] = allPokemonInput;
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
});
