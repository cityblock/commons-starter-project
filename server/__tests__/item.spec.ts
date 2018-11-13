import Item, { IItemEditInput } from '../models/item';

import { transaction } from 'objection';
import uuid from 'uuid';
import { buildRandomItem } from '../item-mocks';
import Pokemon from '../models/pokemon';
import { samplePokemon } from './pokemon.spec';

describe('Item model', () => {
  const notFoundId = uuid.v4();
  let txn = null as any;
  let pokemon = null as any;
  let itemInput = null as any;
  let item = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
    pokemon = await Pokemon.create(samplePokemon, txn);
    itemInput = buildRandomItem(pokemon.id);
    item = await Item.create(itemInput, txn);
  });

  afterEach(async () => {
    await txn.rollback();
  });
  describe('create', () => {
    it('creates an item', async () => {
      Object.keys(itemInput).forEach(itemProp => {
        expect(item.hasOwnProperty(itemProp)).toBe(true);
        expect(item[itemProp]).not.toBeFalsy();
      });
    });
  });
  describe('getAll', () => {
    it('retrieves all items from the database', async () => {
      const newPokeInput = {
        ...samplePokemon,
        pokemonNumber: 2,
        name: 'Dan',
      };
      const NUM_OF_ITEMS: number = 3;
      const poke = await Pokemon.create(newPokeInput, txn);
      await Item.query(txn)
        .delete()
        .where({ id: item.id });
      for (let i = 0; i < NUM_OF_ITEMS; i++) {
        const randomItemInput = buildRandomItem(poke.id);
        await Item.create(randomItemInput, txn);
      }
      const allItems = await Item.getAll(txn);
      expect(allItems.length).toEqual(NUM_OF_ITEMS);
    });
  });
  describe('get', () => {
    it('retrieves a single item from the database', async () => {
      const retrievedItem = await Item.get(item.id, txn);
      expect(retrievedItem.id).toEqual(item.id);
      try {
        await Item.get(notFoundId, txn);
      } catch (e) {
        expect(e).toEqual(`item with id ${notFoundId} not found.`);
      }
    });
  });
  describe('edit', () => {
    it('edits an item', async () => {
      const { name: itemInputName } = itemInput;
      expect(item.name).toEqual(itemInputName);
      const fieldsToEdit: IItemEditInput = { name: 'Dan' };
      const itemAfterEdit = await Item.edit(item.id, fieldsToEdit, txn);
      expect(itemAfterEdit.name).toEqual(fieldsToEdit.name);
      try {
        await Item.edit(notFoundId, fieldsToEdit, txn);
      } catch (e) {
        expect(e).toEqual(`item with id ${notFoundId} not found.`);
      }
    });
  });
  describe('delete', () => {
    it('soft deletes an item', async () => {
      await Item.delete(item.id, txn);
      try {
        await Item.get(item.id, txn);
      } catch (e) {
        expect(e).toMatch(`item with id ${item.id} not found.`);
      }
      try {
        await Item.delete(notFoundId, txn);
      } catch (e) {
        expect(e).toEqual(`item with id ${notFoundId} not found.`);
      }
      const allItems = await Item.getAll(txn);
      expect(allItems.filter(itm => itm.name === item.name)).toEqual([]);
    });
  });
});
