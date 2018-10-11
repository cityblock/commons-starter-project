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
      expect(testPokemon.name).toBe('Cityblockichu');

      const pokemons = await Pokemon.getAll(txn);

      expect(pokemons.length).toBe(1);
      expect(pokemons[0].id).toBe(testPokemon.id);
    });
  });

  describe('get', () => {
    it('gets a pokemon', async () => {
      const thingIGot = await Pokemon.get(testPokemon.id, txn);
      expect(thingIGot.name).toBe('Cityblockichu');
    });

    it('will let you know if there is no pokemon', async () => {
      const fakeUUID = uuid();
      await expect(Pokemon.get(fakeUUID, txn)).rejects.toBe(`No such pokemon: ${fakeUUID}`);
    });
  });

  describe('getAll', () => {
    it('gets all the pokemon', async () => {
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

      const pokemons = await Pokemon.getAll(txn);

      expect(pokemons.length).toBe(2);
      expect(pokemons[0].id).toBe(testPokemon.id);
    });
  });

  describe('edit', async () => {
    it('edits a pokemon', async () => {
      await Pokemon.edit(testPokemon.id, { name: 'Beyonce' }, txn);
      expect(testPokemon.name).toBe('Beyonce');
    });
  });

  describe('delete', async () => {
    it('updates deletedAt status to null', async () => {
      const byePokemon = await Pokemon.delete(testPokemon.id, txn);
      expect(byePokemon.deletedAt).not.toBe(null);
    });
  });
});
