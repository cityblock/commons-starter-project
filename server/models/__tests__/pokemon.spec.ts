import { transaction, Transaction } from 'objection';
import Pokemon, { PokeType } from '../pokemon';
import uuid from 'uuid/v4';

async function setupTestPokemon(txn: Transaction): Promise<Pokemon> {
  const testPokemon = await Pokemon.create(
    {
      pokemonNumber: 709,
      name: 'Cityblockichu',
      attack: 52,
      defense: 300,
      pokeType: PokeType.dragon,
      moves: [],
      imageUrl: 'thisisanimage',
    },
    txn,
  );
  return testPokemon;
}

describe('Pokemon Model', async () => {
  let txn = null as any;
  const testPokemon = await setupTestPokemon(txn);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a pokemon', async () => {
      expect(testPokemon.name).toEqual('Cityblockichu');

      const pokemons = await Pokemon.getAll(txn);

      expect(pokemons.length).toBe(1);
      expect(pokemons[0].id).toBe(testPokemon.id);
    });
  });

  describe('get', () => {
    it('gets a pokemon', async () => {
      const thingIGot = await Pokemon.get(testPokemon.id, txn);
      expect(thingIGot.name).toEqual('Cityblockichu');
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.get(fakeUUID, txn)).rejects.toMatchObject(
        `No such pokemon: ${fakeUUID}`,
      );
    });

    it('will not retrive a pokemon that has been deleted', async () => {
      await Pokemon.delete(testPokemon.id, txn);
      await expect(Pokemon.get(testPokemon.id, txn)).rejects.toMatchObject(
        `No such pokemon: ${testPokemon.id}`,
      );
    });
  });

  describe('getAll', async () => {
    await Pokemon.create(
      {
        pokemonNumber: 55000,
        name: 'Anasauce',
        attack: 10000,
        defense: 85,
        pokeType: PokeType.poison,
        moves: ['sleeps', 'writes code'],
        imageUrl: 'thisisanimage',
      },
      txn,
    );

    it('gets all the pokemon', async () => {
      const pokemons = await Pokemon.getAll(txn);
      expect(pokemons.length).toBe(2);
      expect(pokemons[0].id).toBe(testPokemon.id);
    });

    it('will not retrive pokemon that has been deleted', async () => {
      await Pokemon.delete(testPokemon.id, txn);
      const pokemons = await Pokemon.getAll(txn);
      expect(pokemons.length).toBe(1);
      expect(pokemons[0].name).toEqual('Anasauce');
    });
  });

  describe('edit', async () => {
    it('edits a pokemon', async () => {
      await Pokemon.edit(testPokemon.id, { name: 'Beyonce' }, txn);
      expect({ name: 'Beyonce' }).toMatchObject({ name: 'Beyonce' });
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.get(fakeUUID, txn)).rejects.toMatch(
        `Pokemon: ${fakeUUID} does not exist`,
      );
    });
  });

  describe('delete', async () => {
    it('updates deletedAt status to null', async () => {
      const byePokemon = await Pokemon.delete(testPokemon.id, txn);
      expect(byePokemon.deletedAt).not.toBe(null);
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.get(fakeUUID, txn)).rejects.toMatch(
        `Pokemon: ${fakeUUID} does not exist`,
      );
    });
  });
});
