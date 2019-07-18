import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../pokemon';

describe('pokemon model', () => {
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
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('pokemon methods', () => {
    it('GET ONE -- finds a pokemon by id and returns items', async () => {
      const pokemonById = await Pokemon.getById('0315cff6-9fc3-4882-ac0a-0835a211a843', txn);
      const items = pokemonById.hasOwnProperty('item') ? pokemonById.item : [];
      expect(pokemonById.name).toEqual('Caterpie');
      expect(items.length).toEqual(3);
    });

    it('GET ALL -- retreives all pokemon in db and in order', async () => {
      const allPokemon = await Pokemon.get();
      expect(allPokemon.length).toEqual(52);
      expect(allPokemon[2]!.name).toEqual('Venusaur');
      expect(allPokemon[3]!.name).toEqual('Charmander');
    });

    it('CREATE -- creates a Pokemon and adds them to db', async () => {
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
      const findNewPokemon = await Pokemon.getByName('Jaimon', txn);
      expect(findNewPokemon).toEqual(newPokemon);
    });

    it('EDIT -- successfully edits a pokemons attributes', async () => {
      const editCaterpie = await Pokemon.edit(
        '0315cff6-9fc3-4882-ac0a-0835a211a843',
        {
          attack: 100,
          defense: 101,
        },
        txn,
      );
      expect(editCaterpie.attack).toEqual(100);
      expect(editCaterpie.defense).toEqual(101);
      expect(editCaterpie.name).toEqual('Caterpie');
    });

    it('DELETE -- soft deletes a pokemon from the DB', async () => {
      const deleteCaterpie = await Pokemon.delete('0315cff6-9fc3-4882-ac0a-0835a211a843', txn);
      const notDeletedPokemon = await Pokemon.getByName('Charizard', txn);
      expect(deleteCaterpie.deletedAt).toBeTruthy();
      expect(notDeletedPokemon.deletedAt).toBeFalsy();
    });
  });
});
