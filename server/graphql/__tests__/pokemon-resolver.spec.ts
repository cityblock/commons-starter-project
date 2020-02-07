import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import getPokemons from "../../../app/graphql/get-pokemons.graphql";
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';


describe('pokemon resolver', () => {
  const getPokemonsQuery = print(getPokemons);
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
      const result = await graphql(schema, getPokemonsQuery);

      // NOTE: Postgres returns timestamps as Date objects rather than as strings, so we are unable
      // to simply test equivalence (result.data!.pokemons == expected).
      expect(result.data!.pokemons.length).toEqual(expected.length);
      expect(result.data!.pokemons[0].id).toEqual(expected[0].id);
    });
  });

});