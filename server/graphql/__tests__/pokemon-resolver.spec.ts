import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

describe('#getAll resolver', () => {
  const getAllPokemonQuery = print(getAllPokemon);
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

  describe('get all pokemon', () => {
    it('should return an array of pokemon', async () => {
      const result = await graphql(
        // go into schema file and uncomment RootMutation
        schema,
        getAllPokemonQuery,
        null,
        {
          testTransaction: txn,
        },
      );
      expect(cloneDeep(result.data!.getAllPokemon)).toHaveLength(52);
    });
  });
});
