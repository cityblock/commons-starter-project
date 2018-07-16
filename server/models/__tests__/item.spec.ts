import { transaction, Transaction } from 'objection';
import Item from '../item';
import Pokemon from '../pokemon';

interface ISetup {
  item: Item;
  itemTwo: Item;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const pokemon = await Pokemon.create(
    {
      pokemonNumber: 1111,
      name: 'Newbie',
      attack: 9,
      defense: 20,
      pokeType: 'bug',
      moves: ['sit still', 'eat pizza'],
      imageUrl: 'fakeImageURL',
    },
    txn,
  );
  const item = await Item.create(
    {
      name: 'Carebear',
      pokemonId: pokemon.id,
      price: 45,
      happiness: 80,
      imageUrl: 'exampleImageUrl',
    },
    txn,
  );
  const itemTwo = await Item.create(
    {
      name: 'Sunshine Raspberry',
      pokemonId: pokemon.id,
      price: 5,
      happiness: 8,
      imageUrl: 'exampleImageUrlTwo',
    },
    txn,
  );

  return { item, itemTwo };
}

describe('Item Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates an item', async () => {
      const { item } = await setup(txn);
      expect(item.name).toEqual('Carebear');
      expect(item.happiness).toEqual(80);
    });
  });

  describe('get', () => {
    it('retrieves an item', async () => {
      const { item } = await setup(txn);
      const testItem = await Item.get(item.id, txn);
      expect(testItem).toMatchObject(item);
    });
  });

  describe('getAll', () => {
    it('retrieves all items', async () => {
      const { item, itemTwo } = await setup(txn);
      const allItems = await Item.getAll(txn);
      expect(allItems.length).toEqual(2);
      expect(allItems[0]).toMatchObject(item);
      expect(allItems[1]).toMatchObject(itemTwo);
    });
  });

  describe('edit', () => {
    it('successfully updates an item', async () => {
      const { itemTwo } = await setup(txn);
      const editedInput = {
        name: 'Normal Raspberry',
      };
      const editedItem = await Item.edit(itemTwo.id, editedInput, txn);
      expect(editedItem.name).toEqual('Normal Raspberry');
      const retrievedItem = await Item.get(itemTwo.id, txn);
      expect(retrievedItem.name).toEqual('Normal Raspberry');
    });
  });

  describe('delete', () => {
    const deleteSetup = async (): Promise<Item> => {
      const { item } = await setup(txn);
      const deletedItem = await Item.delete(item.id, txn);
      return deletedItem;
    };

    it('removes an item', async () => {
      const deletedItem = await deleteSetup();
      expect(deletedItem.deletedAt).not.toBe(null);
    });

    it('ensures the item cannot be fetched', async () => {
      const deletedItem = await deleteSetup();
      await expect(Item.get(deletedItem.id, txn)).rejects.toMatch(
        `No such item exists: ${deletedItem.id}`,
      );
    });

    it('prevents the item from appearing in the total items list', async () => {
      const deletedItem = await deleteSetup();
      const fetchedItems = await Item.getAll(txn);
      expect(fetchedItems).not.toContainEqual(deletedItem);
    });
  });
});
