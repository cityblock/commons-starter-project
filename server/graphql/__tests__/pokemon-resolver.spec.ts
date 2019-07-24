import { graphql, print } from 'graphql';
import random from 'lodash/random'
import { transaction, Transaction } from 'objection';
import { PokeType } from 'schema';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import getPokemon from '../../../app/graphql/queries/get-pokemon.graphql';
import pokemonCreate from '../../../app/graphql/queries/pokemon-create-mutation.graphql';
import pokemonDelete from '../../../app/graphql/queries/pokemon-delete-mutation.graphql';
import pokemonEdit from '../../../app/graphql/queries/pokemon-edit-mutation.graphql';
import { filterTimestamps, setupDb, testGraphqlContext } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

describe('Pokemon Resolver', () => {
  let testDb = null as any;
  let txn = null as any;

  const getAllPokemonQuery = print(getAllPokemon);
  const getPokemonQuery = print(getPokemon);
  const pokemonCreateMutation = print(pokemonCreate);
  const pokemonEditMutation = print(pokemonEdit);
  const pokemonDeleteMutation = print(pokemonDelete);

  const filterPokemon = ({ items, ...pokemon }: Pokemon) => ({
    ...filterTimestamps(pokemon),
    items: items.map(filterTimestamps)
  });

  const getRandomPokemonId = async (txxn: Transaction) => {
    const allPokemon = await Pokemon.getAll(txxn);
    return allPokemon[random(allPokemon.length - 1)].id
  };

  beforeAll(() => testDb = setupDb());

  afterAll(() => testDb.destroy());

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(() => txn.rollback());

  describe('getAllPokemon', () => {
    it('fetches all pokemon in the database', async () => {
      const dbPokemon = await Pokemon.getAll(txn);
      const filteredDbPokemon = dbPokemon.map(filterPokemon);

      const { data: { allPokemon: graphQLPokemon } }: any = await graphql(
        schema,
        getAllPokemonQuery,
        null,
        testGraphqlContext({ testTransaction: txn }),
        null
      );

      expect(graphQLPokemon).toMatchObject(filteredDbPokemon);
    });
  });

  describe('getPokemon', () => {
    it('fetches the requested pokemon', async () => {
      const pokemonId = await getRandomPokemonId(txn);
      const dbPokemon = await Pokemon.get(pokemonId, txn);
      const filteredDbPokemon = filterPokemon(dbPokemon);

      const { data: { pokemon: graphQLPokemon } }: any = await graphql(
        schema,
        getPokemonQuery,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { pokemonId }
      );

      expect(graphQLPokemon).toMatchObject(filteredDbPokemon);
    });
  });

  describe('pokemonCreate', () => {
    it('creates a new pokemon', async () => {
      const { data: { pokemonCreate: createdPokemon } }: any = await graphql(
        schema,
        pokemonCreateMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          pokemonNumber: 13,
          name: 'Aster',
          attack: 100,
          defense: 100,
          pokeType: 'ghost' as PokeType,
          moves: ['sleep', 'dab'],
          imageUrl: 'https://aster.fyi'
        }
      );

      const dbPokemon = await Pokemon.get(createdPokemon.id, txn);
      const filteredDbPokemon = filterPokemon(dbPokemon);

      expect(createdPokemon).toMatchObject(filteredDbPokemon);
    });

    it('returns an error when creating a non-unique pokemon', async () => {
      const { errors: [{ message }] }: any = await graphql(
        schema,
        pokemonCreateMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          pokemonNumber: 13,
          name: 'Bulbasaur',
          attack: 100,
          defense: 100,
          pokeType: 'ghost' as PokeType,
          moves: ['sleep', 'dab'],
          imageUrl: 'https://aster.fyi'
        }
      );

      expect(message).toMatch('pokemon_name_unique');
    });
  });

  describe('pokemonEdit', () => {
    it('edits and returns a pokemon', async () => {
      const pokemonId = await getRandomPokemonId(txn);

      const { data: { pokemonEdit: editedPokemon } }: any = await graphql(
        schema,
        pokemonEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { pokemonId, attack: 1000, defense: 3000 }
      );

      expect(editedPokemon).toMatchObject({ attack: 1000, defense: 3000 });
    });

    it('saves the edit in the database', async () => {
      const pokemonId = await getRandomPokemonId(txn);

      const { data: { pokemonEdit: editedPokemon } }: any = await graphql(
        schema,
        pokemonEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { pokemonId, attack: 1000, defense: 3000 }
      );

      const dbPokemon = await Pokemon.get(pokemonId, txn);
      const filteredDbPokemon = filterPokemon(dbPokemon);

      expect(editedPokemon).toMatchObject(filteredDbPokemon);
    });

    it('returns an error when editing a pokemon to be non-unique', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      const pokemonId = allPokemon[0].id;
      const { errors: [{ message }] }: any = await graphql(
        schema,
        pokemonEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { pokemonId, name: 'Ivysaur' }
      );

      expect(message).toMatch('pokemon_name_unique');
    });
  });

  describe('pokemonDelete', () => {
    it('marks a pokemon as deleted and returns it', async () => {
      const pokemonId = await getRandomPokemonId(txn);

      const { data: { pokemonDelete: deletedPokemon } }: any = await graphql(
        schema,
        pokemonDeleteMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { pokemonId }
      );

      expect(deletedPokemon.deletedAt).not.toBeNull();
    });

    it('marks the pokemon as deleted in the database', async () => {
      const pokemonId = await getRandomPokemonId(txn);
      await graphql(
        schema,
        pokemonDeleteMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        { pokemonId }
      );

      const dbPokemon = await Pokemon.query(txn).findById(pokemonId);
      expect(dbPokemon!.deletedAt).not.toBeNull();
    });
  });
});
