import { transaction, Transaction } from 'objection';
import { PokeType } from 'schema';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../pokemon';

describe('pokemon model', () => {
  const mockResourceUrl = 'http://google.com';
  let testDb = null as any;
  let txn = null as any;

  const getRandomPokemon = async (txxn: Transaction): Promise<Pokemon> => {
    const allPokemon = await Pokemon.getAll(txxn);
    const genNumber = Math.floor(Math.random() * allPokemon.length);
    return allPokemon[genNumber];
  };

  beforeAll(async () => {
    testDb = setupDb();
  });

  afterAll(async () => {
    testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('pokemon methods', () => {
    it('GET ONE -- finds a pokemon by id and returns items', async () => {
      const randomPokemon = await getRandomPokemon(txn);
      const pokemonById = await Pokemon.get(randomPokemon.id, txn);
      expect(pokemonById.name).toEqual(randomPokemon.name);
      expect(pokemonById.item.length).toEqual(randomPokemon.item.length);
    });

    it('GET ALL -- retreives all pokemon in db and in order', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon.length).toEqual(52);
      expect(allPokemon[2].name).toEqual('Venusaur');
      expect(allPokemon[3].name).toEqual('Charmander');
    });

    it('CREATE -- creates a Pokemon and adds them to db', async () => {
      const newPokemon = await Pokemon.create(
        {
          name: 'Jaimon',
          pokemonNumber: 13,
          attack: 9001,
          defense: 100,
          pokeType: 'fire' as PokeType,
          moves: ['Electric Slide', 'Ali Shuffle'],
          imageUrl: mockResourceUrl,
        },
        txn,
      );
      const findNewPokemon = await Pokemon.getByName('Jaimon', txn);
      expect(findNewPokemon).toEqual(newPokemon);
    });

    it('EDIT -- successfully edits a pokemons attributes', async () => {
      const randomPokemon = await getRandomPokemon(txn);
      const editRandomPokemon = await Pokemon.edit(
        randomPokemon.id,
        {
          attack: 100,
          defense: 101,
        },
        txn,
      );
      expect(editRandomPokemon.attack).toEqual(100);
      expect(editRandomPokemon.defense).toEqual(101);
    });

    it('DELETE -- soft deletes a pokemon from the DB', async () => {
      const randomPokemon = await getRandomPokemon(txn);
      const deleteRandomPokemon = await Pokemon.delete(randomPokemon.id, txn);
      expect(deleteRandomPokemon.deletedAt).toBeTruthy();
    });
  });
});
