import { transaction, Transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import Pokemon from '../pokemon';

describe('item model', () => {
  const mockResourceUrl = 'http://google.com';
  let testDb = null as any;
  let txn = null as any;

  const getRandomItem = async (txxn: Transaction): Promise<Item> => {
    const allItems = await Item.query(txxn).where({ deletedAt: null });
    const randomNumberGen = Math.floor(Math.random() * allItems.length);
    return allItems[randomNumberGen];
  };

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

  describe('item methods', () => {
    it('GET ONE -- finds an item by id', async () => {
      const randomItem = await getRandomItem(txn);
      const itemById = await Item.get(randomItem.id, txn);
      expect(itemById.name).toEqual(randomItem.name);
    });

    it('CREATE -- creates a Item and successfully associates to a Pokemon', async () => {
      const newPokemon = await Pokemon.create(
        {
          name: 'Jaimon',
          pokemonNumber: 13,
          attack: 9001,
          defense: 100,
          pokeType: 'dragon',
          moves: ['Electric Slide', 'Ali Shuffle'],
          imageUrl: mockResourceUrl,
        },
        txn,
      );
      const newItem = await Item.create(
        {
          name: 'Boxing Gloves',
          pokemonId: newPokemon.id,
          price: 317,
          happiness: 100,
          imageUrl: mockResourceUrl,
        },
        txn,
      );
      const findNewItem = await Item.get(newItem.id, txn);
      expect(findNewItem.id).toEqual(newItem.id);
      expect(newItem.pokemonId).toEqual(newPokemon.id);
    });

    it('EDIT -- successfully edits an items attributes', async () => {
      const randomItem = await getRandomItem(txn);
      const editRandomItem = await Item.edit(
        randomItem.id,
        {
          happiness: 100,
          price: 101,
        },
        txn,
      );
      expect(editRandomItem.happiness).toEqual(100);
      expect(editRandomItem.price).toEqual(101);
    });

    it('DELETE -- soft deletes an item from the DB', async () => {
      const randomItem = await getRandomItem(txn);
      const deleteRandomItem = await Item.delete(randomItem.id, txn);
      expect(deleteRandomItem.deletedAt).toBeTruthy();
    });
  });
});
