import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { PokeType } from 'schema';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

interface IPokemonTestSetup {
  testPokemon: Pokemon;
}

async function setupTestPokemon(txn: Transaction): Promise<IPokemonTestSetup> {
  const testPokemon = await Pokemon.create(
    {
      name: 'resolveichu',
      pokemonNumber: 707,
      attack: 90,
      defense: 88,
      pokeType: 'dragon' as PokeType,
      moves: ['resolves queries', 'talks to client'],
      imageUrl: 'stringystring',
    },
    txn,
  );
  return { testPokemon };
}

describe('Pokemon Resolver', () => {
  let txn = null as any;

  const pokemonGetAllQuery = print(getAllPokemon);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resoveAllPokemon', () => {
    it('gets all pokemon', async () => {
      const { testPokemon } = await setupTestPokemon(txn);

      const graphqlReturn = await graphql(schema, pokemonGetAllQuery, null, {
        testTransaction: txn,
      });

      expect(graphqlReturn.data!.pokemon[0].name).toEqual(testPokemon.name);
      expect(graphqlReturn.data!.pokemon[0].id).toEqual(testPokemon.id);
      expect(graphqlReturn.data!.pokemon[0].pokemonNumber).toEqual(testPokemon.pokemonNumber);
      expect(graphqlReturn.data!.pokemon.length).toBe(1);
    });
  });
});
