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
      await Pokemon.create(allPokemonInput[0], txn);
      const { data }: any | undefined = await graphql(
        schema,
        getAllPokemonQuery,
        null,
        txn
      );

      expect(data.allPokemon.length).toBeGreaterThan(0);
    });
  })

})

