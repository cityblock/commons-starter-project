import { transaction, Transaction } from 'objection';
import Item from '../item';
import Pokemon, { PokeType } from '../pokemon';
import uuid from 'uuid/v4';

interface IItemSetup {
  item1: Item;
  item2: Item;
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

  const item1 = await Item.create(
    {
      name: 'orange',
      pokemonId: testPokemon.id,
      price: 10001,
      happiness: 300,
      imageUrl: 'thisisanimage',
    },
    txn,
  );

  const item2 = await Item.create(
    {
      name: 'blue',
      pokemonId: testPokemon.id,
      price: 201,
      happiness: 3,
      imageUrl: 'thisisanimage',
    },
    txn,
  );

  return { item1, testPokemon, item2 };
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
      const { item1 } = await setupForTestingItem(txn);
      expect(item1.name).toEqual('orange');
      expect(item1.price).toEqual(10001);
    });
  });

  describe('get', () => {
    it('gets an item', async () => {
      const { item1 } = await setupForTestingItem(txn);
      const thingIGot = await Item.get(item1.id, txn);
      expect(thingIGot).toMatchObject(item1);
    });

    it('will let you know if there is no item', async () => {
      const fakeUUID = uuid();
      await expect(Item.get(fakeUUID, txn)).rejects.toMatch(`No such item: ${fakeUUID}`);
    });

    it('will not retrive an item that has been deleted', async () => {
      const { item1 } = await setupForTestingItem(txn);
      await Item.delete(item1.id, txn);
      await expect(Item.get(item1.id, txn)).rejects.toMatch(`No such item: ${item1.id}`);
    });
  });

  describe('getAll', () => {
    it('gets all the items', async () => {
      const { item1, item2 } = await setupForTestingItem(txn);
      const items = await Item.getAll(txn);
      expect(items.length).toBe(2);
      expect(items).toContainEqual(item1);
      expect(items).toContainEqual(item2);
    });

    it('will not retrive an item that has been deleted', async () => {
      const { item2 } = await setupForTestingItem(txn);
      await Item.delete(item2.id, txn);
      const items = await Item.getAll(txn);
      expect(items.length).toBe(1);
      expect(items[0].name).toEqual('orange');
      expect(items).not.toContainEqual(item2);
    });
  });

  describe('edit', async () => {
    it('edits a item', async () => {
      const { item1 } = await setupForTestingItem(txn);
      const editedItem = await Item.edit(item1.id, { name: 'OrangeYouGoingToGetMeAnItem' }, txn);
      await expect(editedItem.name).toBe('OrangeYouGoingToGetMeAnItem');
    });
  });

  describe('delete', async () => {
    it('updates deletedAt status to null', async () => {
      const { item1 } = await setupForTestingItem(txn);
      const byeItem = await Item.delete(item1.id, txn);
      expect(byeItem.deletedAt).not.toBe(null);
    });
  });
});
