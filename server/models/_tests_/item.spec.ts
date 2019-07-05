import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../Item';
import Pokemon from '../Pokemon';

describe('Item', () => {
  /*
  - get(itemId: string, txn: Transaction) ­ returns a single item
  - create(input: IItemCreateInput, txn: Transaction) ­ creates and returns an item
  - edit(itemId: string, pokemon: IItemEditInput, txn: Transaction) ­ edits an existing item
  - delete(itemId: string, txn: Transaction) ­ marks an item as deleted, but does not actually delete it from the database
  */

  // Recreate the DB
  let testDb = null as any;

  beforeAll(async () => {
    testDb = await setupDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  // For each test start a new transaction and roll it back.
  let trx = null as any;

  beforeEach(async () => {
    trx = await transaction.start(Item.knex());
  });

  afterEach(async () => {
    await trx.rollback();
  });

  it('get: Returns a single item', async () => {
    // Get an item id
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id;
    const pokemon = await Pokemon.get(id, trx);
    const itemId = pokemon.item[0].id;

    // Query
    const item = await Item.get(itemId, trx);

    // Test
    expect(item).toBeInstanceOf(Item);
    expect(item).not.toBeInstanceOf(Array);
  });

  it('create: Creates and returns an item', async () => {
    // Get a pokemon id
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id;

    const testItem = {
      name: 'test item',
      pokemonId: id,
      price: 0,
      happiness: 0,
      imageUrl: 'test.png',
    };

    // Create a mutated pokemon
    const createdItem = await Item.create(testItem, trx);

    // Grab the mutated item from the db
    const fetchedFromDb = await Item.query(trx).findById(createdItem.id);

    // Test
    expect(createdItem).toEqual(fetchedFromDb);
  });

  it('edit: Edits an existing item', async () => {
    // Get an item id
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id;
    const pokemon = await Pokemon.get(id, trx);
    const itemId = pokemon.item[0].id;
    const name = 'test_new_name';

    // Query
    const editedItem = await Item.edit(itemId, { name }, trx);

    // Test
    expect(editedItem).toBeInstanceOf(Item);
    expect(editedItem.name).toBe(name);
  });

  it('delete: Marks an item as deleted', async () => {
    // Get an item id
    const pokemonList = await Pokemon.getAll(trx);
    const id = pokemonList[0].id;
    const pokemon = await Pokemon.get(id, trx);
    const itemId = pokemon.item[0].id;

    // Delete the item
    const deletedItem = await Item.delete(itemId, trx);

    // Get the pokemon again
    const newPokemon = await Pokemon.get(id, trx);

    // Test
    // Check that the item is not in the result.
    expect(newPokemon.item).not.toContain(deletedItem);
  });
});
