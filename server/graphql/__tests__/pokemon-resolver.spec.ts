import { graphql, print } from 'graphql';
import { transaction } from 'objection';
import { PokeType } from 'schema';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

describe('Pokemon Resolver', () => {
  let txn = null as any;

  const getAllPokemonQuery = print(getAllPokemon);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve all pokemon', () => {
    it('gets all pokemon', async () => {
      const pokemon = await Pokemon.create(
        {
          pokemonNumber: 15,
          name: 'Tester',
          attack: 5,
          defense: 60,
          pokeType: 'grass' as PokeType,
          moves: ['eat lunch', 'sweat outdoors'],
          imageUrl: 'fakeImageUrl',
        },
        txn,
      );

      const result = await graphql(schema, getAllPokemonQuery, null, {
        testTransaction: txn,
      });

      expect(result.data!.pokemon.length).toBe(1);
      expect(result.data!.pokemon[0]).toMatchObject({
        id: pokemon.id,
        name: 'Tester',
        pokemonNumber: 15,
        imageUrl: 'fakeImageUrl',
      });
    });
  });
});
