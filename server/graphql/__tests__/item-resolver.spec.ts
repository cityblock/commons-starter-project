import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import { PokeType } from 'schema';
import createItem from '../../../app/graphql/queries/create-item-mutation.graphql';
// import deleteItem from '../../../app/graphql/queries/delete-item-mutation.graphql';
// import editItem from '../../../app/graphql/queries/edit-item-mutation.graphql';
import getItem from '../../../app/graphql/queries/get-item-query.graphql';
import { setupDb } from '../../lib/test-utils';
import Item from '../../models/item';
import Pokemon from '../../models/pokemon';
import schema from '../make-executable-schema';

describe('item resolvers', () => {
  const getItemQuery = print(getItem);
  const createItemMutation = print(createItem);
  // const editItemMutation = print(editItem);
  // const deleteItemMutation = print(deleteItem);

  let testDb = null as any;
  let txn = null as any;

  beforeAll(async () => {
    testDb = setupDb();
  });

  afterAll(async () => {
    testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('#getOne', () => {
    it('should return an item', async () => {
      const allItems = await Item.query(txn).where({ deletedAt: null });
      const randomNumberGen = Math.floor(Math.random() * allItems.length);
      const randomItem = allItems[randomNumberGen];

      const result = await graphql(
        schema,
        getItemQuery,
        null,
        {
          testTransaction: txn,
        },
        { itemId: randomItem.id },
      );
      const randomItemToMatchGQLQuery = {
        id: randomItem.id,
        name: randomItem.name,
        price: randomItem.price,
        happiness: randomItem.happiness,
        imageUrl: randomItem.imageUrl,
      };
      expect(cloneDeep(result.data!.singleItem)).toMatchObject(randomItemToMatchGQLQuery);
    });
  });
  describe('#create', () => {
    it('should create a item', async () => {
      const jaimon = await Pokemon.create(
        {
          name: 'Jason Derulo',
          pokemonNumber: 1001,
          attack: 9001,
          defense: 100,
          pokeType: 'dragon' as PokeType,
          moves: ['Electric Slide', 'Ali Shuffle'],
          imageUrl: 'cityblock.com',
        },
        txn,
      );
      const itemForJaimon = {
        name: 'Boxing Gloves',
        pokemonId: jaimon.id,
        price: 9001,
        happiness: 100,
        imageUrl: 'cityblock.com',
      };
      const result = await graphql(
        schema,
        createItemMutation,
        null,
        {
          testTransaction: txn,
        },
        { ...itemForJaimon },
      );
      expect(cloneDeep(result.data!.createItem.pokemonId)).toEqual(itemForJaimon.pokemonId);
      expect(cloneDeep(result.data!.createItem.name)).toEqual(itemForJaimon.name);
    });
  });
  // describe('#edit', () => {
  //   it('should edit a pokemon', async () => {
  //     const testingPokemonArr = await Pokemon.getAll(txn);
  //     const randomNumberGen = Math.floor(Math.random() * testingPokemonArr.length);
  //     const randomPokemon = await testingPokemonArr[randomNumberGen];
  //     const result = await graphql(
  //       schema,
  //       editAPokemonMutation,
  //       null,
  //       {
  //         testTransaction: txn,
  //       },
  //       { ...randomPokemon, name: 'Kanyemon', imageUrl: 'kan.ye' },
  //     );
  //     expect(cloneDeep(result.data!.editPokemon.name)).toEqual('Kanyemon');
  //     expect(cloneDeep(result.data!.editPokemon.imageUrl)).toEqual('kan.ye');
  //     expect(cloneDeep(result.data!.editPokemon.name)).not.toEqual(randomPokemon.name);
  //   });
  // });
  // describe('#delete', () => {
  //   it('should soft delete a pokemon', async () => {
  //     const testingPokemonArr = await Pokemon.getAll(txn);
  //     const randomNumberGen = Math.floor(Math.random() * testingPokemonArr.length);
  //     const randomPokemon = await testingPokemonArr[randomNumberGen];
  //     const result = await graphql(
  //       schema,
  //       deleteAPokemonMutation,
  //       null,
  //       {
  //         testTransaction: txn,
  //       },
  //       { pokemonId: randomPokemon.id },
  //     );
  //     expect(cloneDeep(result.data!.deletePokemon.name)).toEqual(randomPokemon.name);
  //   });
  // });
});
