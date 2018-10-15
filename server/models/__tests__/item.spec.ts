import { transaction, Transaction } from 'objection';
import Item from '../item';
import Pokemon, { PokeType } from '../pokemon';
import uuid from 'uuid/v4';

interface IItemSetup {
  testItem: Item;
  otherItem: Item;
  testPokemon: Pokemon;
}

async function setupForTestingItem(txn: Transaction): Promise<IItemSetup> {
  const testPokemon = await Pokemon.create(
    {
      pokemonNumber: 9,
      name: 'Cityblockichu',
      attack: 52,
      defense: 300,
      pokeType: 'dragon' as PokeType,
      moves: [],
      imageUrl: 'thisisanimage',
    },
    txn,
  );

  const testItem = await Item.create(
    {
      name: 'orange',
      pokemonId: testPokemon.id,
      price: 10001,
      happiness: 300,
      imageUrl: 'thisisanimage',
    },
    txn,
  );

  const otherItem = await Item.create(
    {
      name: 'blue',
      pokemonId: testPokemon.id,
      price: 201,
      happiness: 3,
      imageUrl: 'thisisanimage',
    },
    txn,
  );

  return { testItem, testPokemon, otherItem };
}

describe('Item Model', async () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a item', async () => {
      const { testItem } = await setupForTestingItem(txn);
      expect(testItem.name).toEqual('orange');
      expect(testItem.price).toEqual(10001);
    });
  });

  describe('get', () => {
    it('gets an item', async () => {
      const { testItem } = await setupForTestingItem(txn);
      const thingIGot = await Item.get(testItem.id, txn);
      expect(thingIGot).toMatchObject(testItem);
    });

    it('will let you know if there is no item', async () => {
      const fakeUUID = uuid();
      await expect(Item.get(fakeUUID, txn)).rejects.toMatch(`No such item: ${fakeUUID}`);
    });

    it('will not retrive an item that has been deleted', async () => {
      const { testItem } = await setupForTestingItem(txn);
      await Item.delete(testItem.id, txn);
      await expect(Item.get(testItem.id, txn)).rejects.toMatch(`No such item: ${testItem.id}`);
    });
  });

  describe('getAll', () => {
    it('gets all the items', async () => {
      const { testItem, otherItem } = await setupForTestingItem(txn);
      const items = await Item.getAll(txn);
      expect(items.length).toBe(2);
      expect(items).toContainEqual(testItem);
      expect(items).toContainEqual(otherItem);
    });

    it('will not retrive an item that has been deleted', async () => {
      const { otherItem } = await setupForTestingItem(txn);
      await Item.delete(otherItem.id, txn);
      const items = await Item.getAll(txn);
      expect(items.length).toBe(1);
      expect(items[0].name).toEqual('orange');
      expect(items).not.toContainEqual(otherItem);
    });
  });

  describe('edit', async () => {
    it('edits a item', async () => {
      const { testItem } = await setupForTestingItem(txn);
      const editedItem = await Item.edit(testItem.id, { name: 'OrangeYouGoingToGetMeAnItem' }, txn);
      await expect(editedItem.name).toBe('OrangeYouGoingToGetMeAnItem');
    });
  });

  describe('delete', async () => {
    it('updates deletedAt status to null', async () => {
      const { testItem } = await setupForTestingItem(txn);
      const byeItem = await Item.delete(testItem.id, txn);
      expect(byeItem.deletedAt).not.toBe(null);
    });
  });
});
