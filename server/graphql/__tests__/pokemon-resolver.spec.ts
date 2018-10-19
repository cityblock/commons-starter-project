import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { PokeType } from 'schema';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import getSinglePokemon from '../../../app/graphql/queries/get-one-pokemon.graphql';
import pokemonCreate from '../../../app/graphql/queries/create-pokemon.graphql';
import pokemonDelete from '../../../app/graphql/queries/delete-pokemon.graphql';
import pokemonEdit from '../../../app/graphql/queries/edit-pokemon.graphql';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';
import Item from '../../models/item';

interface IPokemonTestSetup {
  pokemonOne: Pokemon;
  pokemonTwo: Pokemon;
  itemOne: Item;
  itemTwo: Item;
}

const pokemonInput = {
  name: 'resolveichu',
  pokemonNumber: 707,
  attack: 90,
  defense: 88,
  pokeType: 'dragon' as PokeType,
  moves: ['resolves queries', 'talks to client'],
  imageUrl: 'stringystring',
};

async function setupPokemonResolverTest(txn: Transaction): Promise<IPokemonTestSetup> {
  const pokemonOne = await Pokemon.create(pokemonInput, txn);
  const pokemonTwo = await Pokemon.create(
    {
      name: 'hufflepuff',
      pokemonNumber: 708,
      attack: 33,
      defense: 11,
      pokeType: 'water' as PokeType,
      moves: ['nice to everyone', 'plays fair'],
      imageUrl: 'catsmeow',
    },
    txn,
  );
  const itemOne = await Item.create(
    {
      name: 'bubble tea',
      pokemonId: pokemonOne.id,
      price: 16,
      happiness: 78,
      imageUrl: 'pokemon4lyfe',
    },
    txn,
  );
  const itemTwo = await Item.create(
    {
      name: 'green tea',
      pokemonId: pokemonOne.id,
      price: 5,
      happiness: 101,
      imageUrl: 'testytesting',
    },
    txn,
  );
  return { pokemonOne, pokemonTwo, itemOne, itemTwo };
}

describe('Pokemon Resolver', () => {
  let txn = null as any;

  const pokemonGetAllQuery = print(getAllPokemon);
  const getOneQuery = print(getSinglePokemon);
  const createPokemon = print(pokemonCreate);
  const deletePokemon = print(pokemonDelete);
  const editPokemon = print(pokemonEdit);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resovePokemon:: plural', () => {
    it('gets all pokemon', async () => {
      await setupPokemonResolverTest(txn);
      const graphqlReturn = await graphql(schema, pokemonGetAllQuery, null, {
        testTransaction: txn,
      });
      expect(graphqlReturn.data!.pokemon.length).toBe(2);
    });
    it('orders pokemon by pokemon number ascending', async () => {
      const { pokemonOne, pokemonTwo } = await setupPokemonResolverTest(txn);
      const graphqlReturn = await graphql(schema, pokemonGetAllQuery, null, {
        testTransaction: txn,
      });
      expect(pokemonOne).toEqual(expect.objectContaining(graphqlReturn.data!.pokemon[0]));
      expect(pokemonTwo).toEqual(expect.objectContaining(graphqlReturn.data!.pokemon[1]));
    });
  });

  describe('resolveOnePokemon', () => {
    it('gets one pokemon and its items', async () => {
      const { pokemonOne, itemOne, itemTwo } = await setupPokemonResolverTest(txn);
      const graphqlReturn = await graphql(
        schema,
        getOneQuery,
        null,
        { testTransaction: txn },
        { pokemonId: pokemonOne.id },
      );

      expect(graphqlReturn.data!.fullPokemon.id).toEqual(pokemonOne.id);
      expect(graphqlReturn.data!.fullPokemon.items.length).toBe(2);
      expect(itemOne).toEqual(expect.objectContaining(graphqlReturn.data!.fullPokemon.items[1]));
      expect(itemTwo).toEqual(expect.objectContaining(graphqlReturn.data!.fullPokemon.items[0]));
    });
  });

  describe('createPokemon', () => {
    it('creates one pokemon', async () => {
      const testPokemon = {
        name: 'sleepychu',
        pokemonNumber: 111,
        attack: 222,
        defense: 333,
        pokeType: 'ghost' as PokeType,
        moves: ['snoring', 'dreaming'],
        imageUrl: 'sleepybear',
      };
      const graphqlReturn = await graphql(
        schema,
        createPokemon,
        null,
        { testTransaction: txn },
        testPokemon,
      );

      expect(graphqlReturn.data!.pokemonCreate).toMatchObject(testPokemon);
    });
  });

  describe('deletePokemon', () => {
    it('alters deletedAt value on Pokemon to null', async () => {
      const { pokemonOne } = await setupPokemonResolverTest(txn);
      const graphqlReturn = await graphql(
        schema,
        deletePokemon,
        null,
        { testTransaction: txn },
        { pokemonId: pokemonOne.id },
      );
      expect(graphqlReturn.data!.pokemonDelete.deletedAt).not.toBe(null);
    });
  });

  describe('editPokemon', () => {
    it('edits a pokemon', async () => {
      const { pokemonOne } = await setupPokemonResolverTest(txn);
      const graphqlReturn = await graphql(
        schema,
        editPokemon,
        null,
        { testTransaction: txn },
        { name: 'testyPokemon', pokemonId: pokemonOne.id },
      );
      expect(graphqlReturn.data!.pokemonEdit).toMatchObject({
        ...pokemonInput,
        name: 'testyPokemon',
      });
    });
  });
});
