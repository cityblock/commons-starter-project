import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import Pokemon from '../pokemon';

describe('Item', () => {
  let testDb = null as any;
  let txn = null as any;
  
  const nonexistentId = '0315cff6-9fc3-4882-ac0a-0835a211a843';

  beforeAll(() => testDb = setupDb());

  afterAll(() => testDb.destroy());

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
  });

  afterEach(() => txn.rollback());

  describe('#get', () => {
    it('retrieves the specified item', async () => {
      const randomItem = await Item.query(txn).findOne({ deletedAt: null });
      const item = await Item.get(randomItem!.id, txn);
      expect(item).toMatchObject({ id: randomItem!.id });
    });

    it("includes the item's associated pokemon", async () => {
      const itemWithPokemon = await Item.query(txn).findOne({ deletedAt: null }).orderBy('id');
      const item = await Item.get(itemWithPokemon!.id, txn);
      expect(item.pokemon!.name).toEqual('Marowak');
    });

    it("returns an error when given an invalid id", async () => {
      try {
        await Item.get(nonexistentId, txn);
      } catch(error) {
        expect(error).toEqual('No item with given ID');
      }
    });
  });

  describe('#create', () => {
    it('creates a new item record', async () => {
      const pokemon = await Pokemon.query(txn).findOne({ deletedAt: null });

      const newItem = await Item.create(
        {
          name: 'Air Balloon',
          pokemonId: pokemon!.id,
          price: 50,
          happiness: 4,
          imageUrl: 'https://aster.fyi'
        },
        txn
      )

      const dbItem = await Item.get(newItem.id, txn);
      expect(newItem).toEqual(dbItem);
    });
  });

  describe('#edit', () => {
    it('edits the specified item record in the database', async () => {
      const item = await Item.query(txn).findOne({ deletedAt: null });
      await Item.edit(item!.id, { happiness: 3000 }, txn);

      const editedItem = await Item.get(item!.id, txn);
      expect(editedItem.happiness).toEqual(3000);
    });

    it('returns an error when given an invalid id', async () => {
      try {
        await Item.edit(nonexistentId, { happiness: 3000 }, txn);
      } catch(error) {
        expect(error).toEqual('No item with given ID');
      }
    });
  });

  describe('#delete', () => {
    it('destroys the specified item record', async () => {
      const item = await Item.query(txn).findOne({ deletedAt: null });
      await Item.delete(item!.id, txn);

      try {
        await Item.get(item!.id, txn);
      } catch(error) {
        expect(error).toEqual('No item with given ID');
      }
    });

    it('returns an error when given an invalid id', async () => {
      try {
        await Item.delete(nonexistentId, txn);
      } catch(error) {
        expect(error).toEqual('No item with given ID');
      }
    });
  });
});
