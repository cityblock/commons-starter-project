import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import pokemonCreate from '../../../app/graphql/queries/create-pokemon-mutation.graphql';
import pokemonDelete from '../../../app/graphql/queries/delete-pokemon-mutation.graphql';
import pokemonEdit from '../../../app/graphql/queries/edit-pokemon-mutation.graphql';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import getOnePokemon from '../../../app/graphql/queries/get-one-pokemon.graphql';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

describe('pokemon resolvers', () => {
  const getAllPokemonQuery = print(getAllPokemon);
  const getOnePokemonQuery = print(getOnePokemon);
  const createAPokemonMutation = print(pokemonCreate);
  const editAPokemonMutation = print(pokemonEdit);
  const deleteAPokemonMutation = print(pokemonDelete);

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

  describe('#getAll', () => {
    it('should return an array of pokemon', async () => {
      const result = await graphql(schema, getAllPokemonQuery, null, {
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.allPokemon)).toHaveLength(52);
    });
  });
  describe('#getOne', () => {
    it('should return a pokemon', async () => {
      const testingPokemonArr = await Pokemon.getAll(txn);
      const randomNumberGen = Math.floor(Math.random() * testingPokemonArr.length);
      const randomPokemon = await testingPokemonArr[randomNumberGen];
      const result = await graphql(
        schema,
        getOnePokemonQuery,
        null,
        {
          testTransaction: txn,
        },
        { pokemonId: randomPokemon.id },
      );
      const randomPokemonToMatchGQLQuery = {
        id: randomPokemon.id,
        name: randomPokemon.name,
        pokemonNumber: randomPokemon.pokemonNumber,
        attack: randomPokemon.attack,
        defense: randomPokemon.defense,
        moves: randomPokemon.moves,
        imageUrl: randomPokemon.imageUrl,
      };
      expect(cloneDeep(result.data!.singlePokemon)).toMatchObject(randomPokemonToMatchGQLQuery);
    });
  });
  describe('#create', () => {
    it('should create a pokemon', async () => {
      const jaimon = {
        name: 'Jason Derulo',
        pokemonNumber: 1001,
        attack: 9001,
        defense: 100,
        pokeType: 'dragon',
        moves: ['Electric Slide', 'Ali Shuffle'],
        imageUrl: 'cityblock.com',
      };
      const result = await graphql(
        schema,
        createAPokemonMutation,
        null,
        {
          testTransaction: txn,
        },
        { ...jaimon },
      );
      expect(cloneDeep(result.data!.createPokemon.name)).toEqual(jaimon.name);
    });
  });
  describe('#edit', () => {
    it('should edit a pokemon', async () => {
      const testingPokemonArr = await Pokemon.getAll(txn);
      const randomNumberGen = Math.floor(Math.random() * testingPokemonArr.length);
      const randomPokemon = await testingPokemonArr[randomNumberGen];
      const result = await graphql(
        schema,
        editAPokemonMutation,
        null,
        {
          testTransaction: txn,
        },
        { ...randomPokemon, name: 'Kanyemon', imageUrl: 'kan.ye' },
      );
      expect(cloneDeep(result.data!.editPokemon.name)).toEqual('Kanyemon');
      expect(cloneDeep(result.data!.editPokemon.imageUrl)).toEqual('kan.ye');
      expect(cloneDeep(result.data!.editPokemon.name)).not.toEqual(randomPokemon.name);
    });
  });
  describe('#delete', () => {
    it('should soft delete a pokemon', async () => {
      const testingPokemonArr = await Pokemon.getAll(txn);
      const randomNumberGen = Math.floor(Math.random() * testingPokemonArr.length);
      const randomPokemon = await testingPokemonArr[randomNumberGen];
      const result = await graphql(
        schema,
        deleteAPokemonMutation,
        null,
        {
          testTransaction: txn,
        },
        { pokemonId: randomPokemon.id },
      );
      expect(cloneDeep(result.data!.deletePokemon.name)).toEqual(randomPokemon.name);
    });
  });
});
