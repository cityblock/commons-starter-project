import { graphql, print } from 'graphql';

import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import orderBy from 'lodash/orderBy';
import { transaction } from 'objection';
import getAllItem from '../../app/graphql/queries/get-all-item.graphql';
// import itemEdit from '../../app/graphql/queries/get-item.graphql';
// import createItem from '../../app/graphql/queries/item-create-mutation.graphql';
// import deleteItem from '../../app/graphql/queries/item-delete-mutation.graphql';
// import editItem from '../../app/graphql/queries/item-edit-mutation.graphql';
import schema from '../graphql/make-executable-schema';
import { buildRandomItem } from '../item-mocks';
import Item from '../models/item';
import Pokemon from '../models/Pokemon';
import pokemonSample from '../pokemon-sample';

describe('item resolver', () => {
  const NUM_OF_ITEMS: number = 4;
  let txn = null as any;
  let samplePokemon = null as any;
  let itemList: Item[] = [];
  const getAllItemQuery = print(getAllItem);
  // const getItemQuery = print(getItem);
  // const editItemQuery = print(editItem);
  // const createItemQuery = print(createItem);
  // const deleteItemQuery = print(deleteItem);

  const [pokemonInput] = pokemonSample(0, 1);

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
    samplePokemon = await Pokemon.create(pokemonInput, txn);
    for (let i = 0; i < NUM_OF_ITEMS; i++) {
      const item = await Item.create(buildRandomItem(samplePokemon.id), txn);
      itemList.push(item);
    }
  });

  afterEach(async () => {
    await txn.rollback();
    itemList = [];
  });

  describe('getAllItem resolver', () => {
    it('resolves gql query for all items', async () => {
      const { data }: ExecutionResultDataDefault = await graphql(
        schema,
        getAllItemQuery,
        null,
        txn,
      );
      expect(data.allItem.length).toEqual(4);
      expect({ a: 1, b: 2, c: 3 }).toEqual(expect.objectContaining({ a: 1, b: 2, c: 3 }));

      const priceSortedFetchedItems = orderBy(data.allItem, ['price'], ['desc']);
      const priceSortedItems = orderBy(itemList, ['price'], ['desc']);
      priceSortedFetchedItems.forEach((fetchedItem: {}, i: number) => {
        const referenceItem = priceSortedItems[i];
        expect(fetchedItem).toEqual(
          expect.objectContaining({
            id: referenceItem.id,
            name: referenceItem.name,
            pokemonId: referenceItem.pokemonId,
            price: referenceItem.price,
            happiness: referenceItem.happiness,
          }),
        );
      });
    });
  });

  // describe('getPokemon resolver', () => {
  //   it('resolves gql query for a single pokemon', async () => {
  //     const poke = await Pokemon.create(firstPokeInput, txn);
  //     const { data }: ExecutionResultDataDefault = await graphql(
  //       schema,
  //       getPokemonQuery,
  //       null,
  //       txn,
  //       {
  //         pokemonId: poke.id,
  //       },
  //     );
  //     expect(data.pokemon).toEqual(
  //       expect.objectContaining({
  //         name: poke.name,
  //         pokemonNumber: poke.pokemonNumber,
  //       }),
  //     );
  //   });
  // });

  // describe('editPokemon resolver', () => {
  //   it('edits a pokemon object with fields specified and returns the updated object', async () => {
  //     const poke = await Pokemon.create(firstPokeInput, txn);
  //     const fieldsToEdit = { id: poke.id, name: 'Dan' };
  //     const { data }: ExecutionResultDataDefault = await graphql(
  //       schema,
  //       editPokemonQuery,
  //       null,
  //       txn,
  //       fieldsToEdit,
  //     );
  //     expect(data.pokemonEdit.name).toEqual('Dan');
  //   });
  // });

  // describe('createPokemon resolver', () => {
  //   it('creates and returns a pokemon object', async () => {
  //     const { data }: ExecutionResultDataDefault = await graphql(
  //       schema,
  //       createPokemonQuery,
  //       null,
  //       txn,
  //       firstPokeInput,
  //     );
  //     expect(data.pokemonCreate.name).toEqual(firstPokeInput.name);
  //   });
  // });

  // describe('deletePokemon resolver', () => {
  //   it('soft deletes and returns a pokemon object', async () => {
  //     let poke = null as any;
  //     for (const pokeInput of allPokemonInput) {
  //       poke = await Pokemon.create(pokeInput, txn);
  //     }
  //     await graphql(schema, deletePokemonQuery, null, txn, { id: poke.id });
  //     const allPokemon = await Pokemon.getAll(txn);
  //     expect(allPokemon).not.toContainEqual(poke);
  //   });
  // });
});
