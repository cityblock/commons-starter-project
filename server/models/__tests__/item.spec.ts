import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import Pokemon from '../pokemon';

describe('item model', () => {
  const mockResourceUrl = 'http://google.com';
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

  describe('item methods', () => {
    it('GET ONE -- finds an item by id', async () => {
      const itemById = await Item.getById('139a18ed-979a-4ffd-bee9-2ebf92ad8811', txn);
      expect(itemById.name).toEqual('Focus Band');
    });

    it('CREATE -- creates a Item and successfully associates to a Pokemon', async () => {
      const newPokemon = await Pokemon.create(
        {
          name: 'Jaimon',
          pokemonNumber: 13,
          attack: 9001,
          defense: 100,
          pokeType: 'dragon',
          moves: JSON.stringify(['Electric Slide', 'Ali Shuffle']),
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
      const findNewItem = await Item.getById(newItem.id, txn);
      expect(findNewItem.id).toEqual(newItem.id);
      expect(newItem.pokemonId).toEqual(newPokemon.id);
    });

    it('EDIT -- successfully edits an items attributes', async () => {
      const editGrassySeed = await Item.edit(
        'f093880d-77fd-4ca5-9b12-e6c110c58dc0',
        {
          happiness: 100,
          price: 101,
        },
        txn,
      );
      expect(editGrassySeed.happiness).toEqual(100);
      expect(editGrassySeed.price).toEqual(101);
      expect(editGrassySeed.name).toEqual('Grassy Seed');
    });

    it('DELETE -- soft deletes an item from the DB', async () => {
      const deleteGrassySeed = await Item.delete('f093880d-77fd-4ca5-9b12-e6c110c58dc0', txn);
      expect(deleteGrassySeed.deletedAt).toBeTruthy();
    });
  });
});
