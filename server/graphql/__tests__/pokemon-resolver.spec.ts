import { graphql, print } from 'graphql';
import { transaction } from 'objection';
import { PokeType } from 'schema';
import getAllPokemon from '../../../app/graphql/queries/get-all-pokemon.graphql';
import getSinglePokemon from '../../../app/graphql/queries/get-single-pokemon.graphql';
import pokemonCreate from '../../../app/graphql/queries/pokemon-create-mutation.graphql';
import pokemonDelete from '../../../app/graphql/queries/pokemon-delete-mutation.graphql';
import pokemonEdit from '../../../app/graphql/queries/pokemon-edit-mutation.graphql';
import Item from '../../models/item';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

describe('Pokemon Resolver', () => {
  let txn = null as any;

  const getAllPokemonQuery = print(getAllPokemon);
  const getSinglePokemonQuery = print(getSinglePokemon);
  const pokemonCreateMutation = print(pokemonCreate);
  const pokemonEditMutation = print(pokemonEdit);
  const pokemonDeleteMutation = print(pokemonDelete);

  const setup = async () => {
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
    const pokemonTwo = await Pokemon.create(
      {
        pokemonNumber: 29,
        name: 'TesterTwo',
        attack: 10,
        defense: 19,
        pokeType: 'bug' as PokeType,
        moves: ['watch thunderstorm'],
        imageUrl: 'fakeImageUrlTwo',
      },
      txn,
    );
    const item = await Item.create(
      {
        name: 'power bar',
        pokemonId: pokemonTwo.id,
        price: 16,
        happiness: 78,
        imageUrl: 'thisIsAnItem!',
      },
      txn,
    );
    const itemTwo = await Item.create(
      {
        name: 'altoid',
        pokemonId: pokemonTwo.id,
        price: 9,
        happiness: 34,
        imageUrl: 'thisIsAnItemToo!',
      },
      txn,
    );
    const shortItem = {
      id: item.id,
      name: 'power bar',
      imageUrl: 'thisIsAnItem!',
    };
    const shortItemTwo = {
      id: itemTwo.id,
      name: 'altoid',
      imageUrl: 'thisIsAnItemToo!',
    };

    return { pokemon, pokemonTwo, item, itemTwo, shortItem, shortItemTwo };
  };

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve all pokemon', () => {
    it('gets all pokemon', async () => {
      const { pokemon, pokemonTwo } = await setup();

      const result = await graphql(schema, getAllPokemonQuery, null, {
        testTransaction: txn,
      });

      expect(result.data!.allPokemon.length).toBe(2);
      expect(result.data!.allPokemon[0]).toMatchObject({
        id: pokemon.id,
        name: 'Tester',
        pokemonNumber: 15,
        imageUrl: 'fakeImageUrl',
      });
      expect(result.data!.allPokemon[1]).toMatchObject({
        id: pokemonTwo.id,
        name: 'TesterTwo',
        pokemonNumber: 29,
        imageUrl: 'fakeImageUrlTwo',
      });
    });
  });

  describe('resolve single pokemon', () => {
    it('fetches a single pokemon and associated items', async () => {
      const { pokemonTwo, shortItem, shortItemTwo } = await setup();

      const result = await graphql(
        schema,
        getSinglePokemonQuery,
        null,
        {
          testTransaction: txn,
        },
        { pokemonId: pokemonTwo.id },
      );

      expect(result.data!.singlePokemon).toMatchObject({
        id: pokemonTwo.id,
        pokemonNumber: 29,
        name: 'TesterTwo',
        attack: 10,
        defense: 19,
        pokeType: 'bug' as PokeType,
        moves: ['watch thunderstorm'],
        imageUrl: 'fakeImageUrlTwo',
        items: {},
      });
      expect(result.data!.singlePokemon.items).toContainEqual(shortItem);
      expect(result.data!.singlePokemon.items).toContainEqual(shortItemTwo);
    });

    it('only retrieves undeleted items', async () => {
      const { pokemonTwo, itemTwo, shortItem, shortItemTwo } = await setup();

      await Item.delete(itemTwo.id, txn);
      const result = await graphql(
        schema,
        getSinglePokemonQuery,
        null,
        { testTransaction: txn },
        { pokemonId: pokemonTwo.id },
      );

      expect(result.data!.singlePokemon.items).toContainEqual(shortItem);
      expect(result.data!.singlePokemon.items).not.toContainEqual(shortItemTwo);
    });
  });

  describe('pokemon create', () => {
    it('creates a pokemon', async () => {
      const result = await graphql(
        schema,
        pokemonCreateMutation,
        null,
        { testTransaction: txn },
        {
          name: 'Jansport',
          pokemonNumber: 12,
          attack: 165,
          defense: 12,
          pokeType: 'fire' as PokeType,
          moves: ['camoflauge'],
          imageUrl: 'anotherFakeUrl',
        },
      );

      expect(result.data!.pokemonCreate).toMatchObject({
        name: 'Jansport',
        pokemonNumber: 12,
        attack: 165,
        defense: 12,
        pokeType: 'fire',
        moves: ['camoflauge'],
        imageUrl: 'anotherFakeUrl',
      });
    });
  });

  describe('pokemon edit', () => {
    it('edits a pokemon', async () => {
      const { pokemon } = await setup();
      const result = await graphql(
        schema,
        pokemonEditMutation,
        null,
        { testTransaction: txn },
        {
          name: 'LL Bean',
          pokemonId: pokemon.id,
        },
      );

      expect(result.data!.pokemonEdit).toMatchObject({
        name: 'LL Bean',
        pokemonNumber: 15,
        attack: 5,
        defense: 60,
        pokeType: 'grass',
        moves: ['eat lunch', 'sweat outdoors'],
        imageUrl: 'fakeImageUrl',
      });

      const resultTwo = await graphql(
        schema,
        getSinglePokemonQuery,
        null,
        { testTransaction: txn },
        { pokemonId: pokemon.id },
      );

      expect(resultTwo.data!.singlePokemon).toMatchObject({
        name: 'LL Bean',
        pokemonNumber: 15,
        attack: 5,
        defense: 60,
        pokeType: 'grass',
        moves: ['eat lunch', 'sweat outdoors'],
        imageUrl: 'fakeImageUrl',
      });
    });
  });

  describe('pokemon delete', () => {
    it('assigns a deletedAt time to the pokemon', async () => {
      const { pokemonTwo } = await setup();
      const result = await graphql(
        schema,
        pokemonDeleteMutation,
        null,
        { testTransaction: txn },
        { pokemonId: pokemonTwo.id },
      );
      expect(result.data!.pokemonDelete.deletedAt).not.toBeFalsy();
    });
  });
});
