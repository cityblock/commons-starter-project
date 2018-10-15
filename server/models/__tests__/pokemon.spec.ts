import { transaction, Transaction } from 'objection';
import Pokemon, { PokeType } from '../pokemon';
import Item from '../item';
import uuid from 'uuid/v4';

interface IPokemonTestSetup {
  testPokemon: Pokemon;
  testItem: Item;
  otherItem: Item;
}

async function setupTestPokemon(txn: Transaction): Promise<IPokemonTestSetup> {
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
      price: 500,
      happiness: 50,
      imageUrl: 'thisisanimage',
    },
    txn,
  );

  const otherItem = await Item.create(
    {
      name: 'purple',
      pokemonId: testPokemon.id,
      price: 600,
      happiness: 60,
      imageUrl: 'thisisanimage',
    },
    txn,
  );
  return { testPokemon, testItem, otherItem };
}

describe('Pokemon Model', async () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a pokemon', async () => {
      const { testPokemon } = await setupTestPokemon(txn);
      expect(testPokemon.name).toEqual('Cityblockichu');

      const pokemons = await Pokemon.getAll(txn);

      expect(pokemons.length).toBe(1);
      expect(pokemons[0].id).toBe(testPokemon.id);
    });
  });

  describe('get', () => {
    it('gets a pokemon and its items', async () => {
      const { testPokemon, testItem, otherItem } = await setupTestPokemon(txn);
      const thingIGot = await Pokemon.get(testPokemon.id, txn);
      expect(thingIGot.name).toEqual('Cityblockichu');
      expect(thingIGot.items.length).toEqual(2);
      expect(thingIGot.items).toContainEqual(testItem);
      expect(thingIGot.items).toContainEqual(otherItem);
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.get(fakeUUID, txn)).rejects.toMatch(`No such pokemon: ${fakeUUID}`);
    });

    it('will only get items that are not deleted', async () => {
      const { testItem, testPokemon, otherItem } = await setupTestPokemon(txn);
      const goAwayItem = await Item.delete(otherItem.id, txn);
      const pokemonIGot = await Pokemon.get(testPokemon.id, txn);
      expect(pokemonIGot.items[0]).toMatchObject(testItem);
      expect(pokemonIGot.items).not.toContainEqual(goAwayItem);
    });

    it('will not retrive a pokemon that has been deleted', async () => {
      const { testPokemon } = await setupTestPokemon(txn);
      await Pokemon.delete(testPokemon.id, txn);
      await expect(Pokemon.get(testPokemon.id, txn)).rejects.toMatch(
        `No such pokemon: ${testPokemon.id}`,
      );
    });
  });

  describe('getAll', () => {
    it('gets all the pokemon', async () => {
      const otherPokemon = await Pokemon.create(
        {
          pokemonNumber: 55000,
          name: 'Anasauce',
          attack: 10000,
          defense: 85,
          pokeType: 'poison' as PokeType,
          moves: ['sleeps', 'writes code'],
          imageUrl: 'thisisanimage',
        },
        txn,
      );
      const { testPokemon } = await setupTestPokemon(txn);
      const pokemons = await Pokemon.getAll(txn);
      expect(pokemons.length).toBe(2);
      expect(pokemons).toContainEqual(testPokemon);
      expect(pokemons).toContainEqual(otherPokemon);
    });

    it('will not retrieve pokemon that has been deleted', async () => {
      await Pokemon.create(
        {
          pokemonNumber: 55000,
          name: 'Anasauce',
          attack: 10000,
          defense: 85,
          pokeType: 'poison' as PokeType,
          moves: ['sleeps', 'writes code'],
          imageUrl: 'thisisanimage',
        },
        txn,
      );
      const { testPokemon } = await setupTestPokemon(txn);
      await Pokemon.delete(testPokemon.id, txn);
      const pokemons = await Pokemon.getAll(txn);
      expect(pokemons.length).toBe(1);
      expect(pokemons[0].name).toEqual('Anasauce');
    });
  });

  describe('edit', async () => {
    it('edits a pokemon', async () => {
      const { testPokemon } = await setupTestPokemon(txn);
      const editedPokemon = await Pokemon.edit(testPokemon.id, { name: 'Beyonce' }, txn);
      await expect(editedPokemon.name).toBe('Beyonce');
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.edit(fakeUUID, { name: 'hub' }, txn)).rejects.toMatch(
        `No such pokemon: ${fakeUUID}`,
      );
    });
  });

  describe('delete', async () => {
    it('updates deletedAt status to null', async () => {
      const { testPokemon } = await setupTestPokemon(txn);
      const byePokemon = await Pokemon.delete(testPokemon.id, txn);
      expect(byePokemon.deletedAt).not.toBe(null);
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.delete(fakeUUID, txn)).rejects.toMatch(`No such pokemon: ${fakeUUID}`);
    });
  });
});
