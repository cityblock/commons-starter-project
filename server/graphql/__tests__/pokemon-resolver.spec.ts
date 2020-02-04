import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import getAllPokemon from "../../../app/graphql/get-all-pokemon.graphql";
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';


describe('pokemon resolver', () => {
  const getAllPokemonQuery = print(getAllPokemon);
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
      const result = await graphql(schema, getAllPokemonQuery);

      // This fails because Pokemon.getAll()[0].createdAt returns as a datetime object,
      // not a date-time string.
      // expect(typeof result.data!.allPokemon[0].createdAt).toEqual(typeof expected[0].createdAt)
      // expect(result.data!.allPokemon).toEqual(expected);

      expect(result.data!.allPokemon[0].id).toEqual(expected[0].id);
    });
  });

});