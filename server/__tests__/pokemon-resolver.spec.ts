import { graphql, print } from 'graphql';

import { transaction } from 'objection';
import getAllPokemon from '../../app/graphql/queries/get-all-pokemon.graphql';
import schema from '../graphql/make-executable-schema';
import Pokemon from '../models/Pokemon';
import pokemonSample from '../pokemon-sample';

describe('pokemon resolver', () => {
  let txn = null as any;
  const getAllPokemonQuery = print(getAllPokemon);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('getAllPokemon resolver', async () => {
    it('resolves gql query for all pokemon', async () => {
      const allPokemonInput = pokemonSample(0, 4);
      for (const pokeInput of allPokemonInput) {
        await Pokemon.create(pokeInput, txn);
      }

      const result: any = await graphql(schema, getAllPokemonQuery, null, txn);
      console.log(result);
      // expect(data.allPokemon.length).toEqual(4);
      // const firstPokemon = data.allPokemon[0];
      // expect(firstPokemon.name).toEqual(allPokemonInput[0].name);
    });
  });
});
