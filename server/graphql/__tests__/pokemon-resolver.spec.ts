import { graphql, print } from 'graphql';
import 'jest-extended';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import getPokemon from '../../../app/graphql/queries/get-pokemon.graphql';
import getPokemons from '../../../app/graphql/queries/get-pokemons.graphql';
import pokemonCreate from '../../../app/graphql/queries/pokemon-create-mutation.graphql';
import pokemonDelete from '../../../app/graphql/queries/pokemon-delete-mutation.graphql';
import pokemonEdit from '../../../app/graphql/queries/pokemon-edit-mutation.graphql';
import { setupDb, testGraphqlContext } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

// TESTING FIXTURES
const NUM_POKEMON = 52;

const POKEMON = {
  id: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  name: 'Bulbasaur',
  attack: 11,
  defense: 22,
  pokeType: 'grass',
  moves: ['Tackle', 'Growl', 'Leech Seed'],
  imageUrl:
    'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
};

const POKEMON_CREATE = {
  pokemonNumber: 99,
  name: 'Bubble-Saurus',
  attack: 11,
  defense: 22,
  pokeType: 'grass',
  moves: ['Tackle', 'Growl', 'Leech Seed'],
  imageUrl:
    'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
};

const ITEMS = [
  {
    id: '1f77d3da-e173-4c14-b252-b580fb548acf',
    name: 'Amulet Coin',
  },
  {
    id: '1c79c5d3-7883-4fdd-8ff9-cd49ff28438c',
    name: "King's Rock",
  },
  {
    id: '85fd60e9-6327-4572-9427-b132e335d3b8',
    name: 'Pokemon Egg',
  },
];

const POKEMON_EDIT = {
  pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  name: 'Bubba-Saurus',
  attack: 0,
  defense: 55,
};

describe('pokemon resolver', () => {
  const getPokemonQuery = print(getPokemon);
  const getPokemonsQuery = print(getPokemons);
  const pokemonEditMutation = print(pokemonEdit);
  const pokemonDeleteMutation = print(pokemonDelete);
  const pokemonCreateMutation = print(pokemonCreate);

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

  describe('resolve a pokemon', () => {
    it('fetches a pokemon', async () => {
      const result = await graphql(
        schema,
        getPokemonQuery,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          pokemonId: POKEMON.id,
        },
      );

      const cloned = cloneDeep(result.data!.pokemon);
      expect(cloned).toMatchObject(POKEMON);
      expect(cloned.item).toIncludeSameMembers(ITEMS);
    });
  });

  describe('resolve pokemons', () => {
    it('fetches all pokemons', async () => {
      const result = await graphql(
        schema,
        getPokemonsQuery,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {},
      );

      const cloned = cloneDeep(result.data!.pokemons);
      expect(cloned).toHaveLength(NUM_POKEMON);
      expect(cloned).toIncludeAllMembers([POKEMON]);
    });
  });

  describe('resolve a pokemon create', () => {
    it('creates a pokemon', async () => {
      const result = await graphql(
        schema,
        pokemonCreateMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          POKEMON_CREATE,
        },
      );

      const cloned = cloneDeep(result.data!.pokemon);
      expect(cloned).toMatchObject(POKEMON_CREATE);
    });
  });

  describe('resolve a pokemon edit', () => {
    it('edits a pokemon', async () => {
      const result = await graphql(
        schema,
        pokemonEditMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          POKEMON_EDIT,
        },
      );

      const cloned = cloneDeep(result.data!.pokemon);
      expect(cloned).toMatchObject(POKEMON_EDIT);
    });
  });

  describe('resolve a pokemon delete', () => {
    it('delete a pokemon', async () => {
      const result = await graphql(
        schema,
        pokemonDeleteMutation,
        null,
        testGraphqlContext({ testTransaction: txn }),
        {
          pokemonId: POKEMON.id,
        },
      );

      const cloned = cloneDeep(result.data!.pokemon);
      expect(cloned.deletedAt).toBeTruthy();
      expect(cloned.id).toBe(POKEMON.id);
    });
  });
});
