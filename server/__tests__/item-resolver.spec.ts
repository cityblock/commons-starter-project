import { graphql, print } from 'graphql';

import { ExecutionResultDataDefault } from 'graphql/execution/execute';
import orderBy from 'lodash/orderBy';
import { transaction } from 'objection';
import getAllItem from '../../app/graphql/queries/get-all-item.graphql';
import getItem from '../../app/graphql/queries/get-item.graphql';
import createItem from '../../app/graphql/queries/item-create-mutation.graphql';
import deleteItem from '../../app/graphql/queries/item-delete-mutation.graphql';
import editItem from '../../app/graphql/queries/item-edit-mutation.graphql';
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
  const getItemQuery = print(getItem);
  const createItemQuery = print(createItem);
  const editItemQuery = print(editItem);
  const deleteItemQuery = print(deleteItem);

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

  describe('getItem resolver', () => {
    it('resolves gql query for a single item', async () => {
      const [referenceItem] = itemList;
      const { data }: ExecutionResultDataDefault = await graphql(schema, getItemQuery, null, txn, {
        id: referenceItem.id,
      });
      expect(data.item).toEqual(
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

  describe('createItem resolver', () => {
    it('creates and returns a pokemon object', async () => {
      const itemInput = buildRandomItem(samplePokemon.id);
      const { data }: ExecutionResultDataDefault = await graphql(
        schema,
        createItemQuery,
        null,
        txn,
        itemInput,
      );

      expect(data.itemCreate).toEqual(
        expect.objectContaining({
          name: itemInput.name,
          pokemonId: itemInput.pokemonId,
          price: itemInput.price,
          happiness: itemInput.happiness,
        }),
      );
    });
  });
  describe('editItem resolver', () => {
    it('edits a pokemon object with fields specified and returns the updated object', async () => {
      const itemToEdit = await Item.create(buildRandomItem(samplePokemon.id), txn);
      const fieldsToEdit = { id: itemToEdit.id, name: 'Dan' };
      const { data }: ExecutionResultDataDefault = await graphql(
        schema,
        editItemQuery,
        null,
        txn,
        fieldsToEdit,
      );
      expect(data.itemEdit.name).toEqual('Dan');
    });
  });

  describe('deleteItem resolver', () => {
    it('soft deletes and returns an item object', async () => {
      const [itemForDeletion] = itemList;
      await graphql(schema, deleteItemQuery, null, txn, { id: itemForDeletion.id });
      const allItems = await Item.getAll(txn);
      expect(allItems).not.toContainEqual(itemForDeletion);
    });
  });
});
