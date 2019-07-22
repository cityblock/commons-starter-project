import random from 'lodash/random'
import { transaction, Transaction } from 'objection';
import { PokeType } from 'schema';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import Pokemon from '../pokemon';

describe('Pokemon', () => {
  let testDb = null as any;
  let txn = null as any;
  
  const nonexistentId = '0315cff6-9fc3-4882-ac0a-0835a211a843';

  const getRandomPokemonId = async (txxn: Transaction) => {
    const allPokemon = await Pokemon.getAll(txxn);
    return allPokemon[random(allPokemon.length - 1)].id
  };

  beforeAll(() => testDb = setupDb());

  afterAll(() => testDb.destroy());

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(() => txn.rollback());

  describe('#getAll', () => {
    it('retrieves all pokemon in the database', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon.length).toEqual(52);
    });

    it('retrieves pokemon ordered by ascending pokemon number', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon[0].pokemonNumber).toEqual(1);
      expect(allPokemon[1].pokemonNumber).toEqual(2);
    });

    it("includes the pokemon's associated items", async () => {
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon[0].items).not.toEqual([]);
    });
  });

  describe('#get', () => {
    it('retrieves the specified pokemon', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      const pokemon = await Pokemon.get(allPokemon[0].id, txn);
      expect(pokemon.name).toEqual('Bulbasaur');
    });

    it("includes the pokemon's associated items", async () => {
      const allPokemon = await Pokemon.getAll(txn);
      const pokemon = await Pokemon.get(allPokemon[0].id, txn);
      expect(pokemon.items).not.toEqual([]);
    });

    it("returns an error when given an invalid id", async () => {
      try {
        await Pokemon.get(nonexistentId, txn);
      } catch(error) {
        expect(error).toEqual('No pokemon with given ID');
      }
    });
  });

  describe('#create', () => {
    it('creates a new pokemon record', async () => {
      const newPokemon = await Pokemon.create(
        {
          pokemonNumber: 13,
          name: 'Aster',
          attack: 100,
          defense: 100,
          pokeType: 'ghost' as PokeType,
          moves: ['sleep', 'dab'],
          imageUrl: 'https://aster.fyi'
        },
        txn
      )

      const dbPokemon = await Pokemon.get(newPokemon.id, txn);
      expect(newPokemon).toEqual(dbPokemon);
    });

    it('returns an error when creating a duplicate pokemon', async () => {
      try {
        await Pokemon.create(
          {
            pokemonNumber: 1,
            name: 'Aster',
            attack: 100,
            defense: 100,
            pokeType: 'ghost' as PokeType,
            moves: ['sleep', 'dab'],
            imageUrl: 'https://aster.fyi'
          },
          txn
        )
      } catch(error) {
        expect(error).toMatchObject({ constraint: 'pokemon_pokemonnumber_unique' });
      }
    });
  });

  describe('#edit', () => {
    it('edits the specified pokemon record in the database', async () => {
      const editedPokemonId = await getRandomPokemonId(txn);
      await Pokemon.edit(editedPokemonId, { attack: 100, defense: 200 }, txn);

      const editedPokemon = await Pokemon.get(editedPokemonId, txn);
      expect(editedPokemon.attack).toEqual(100);
      expect(editedPokemon.defense).toEqual(200);
    });

    it('returns the edited pokemon, including all its edits', async () => {
      const editedPokemonId = await getRandomPokemonId(txn);
      const editedPokemon = await Pokemon.edit(editedPokemonId, { attack: 100, defense: 200 }, txn);
      const dbPokemon = await Pokemon.get(editedPokemonId, txn);
      expect(editedPokemon).toEqual(dbPokemon);
    });

    it('raises an error when trying to submit an edit that violates uniquness', async () => {
      try {
        const editedPokemonId = await getRandomPokemonId(txn);
        await Pokemon.edit(editedPokemonId, { name: 'Bulbasaur' }, txn);
      } catch(error) {
        expect(error).toMatchObject({ constraint: 'pokemon_name_unique' });
      }
    });

    it('returns an error when given an invalid id', async () => {
      try {
        await Pokemon.edit(nonexistentId, { attack: 100, defense: 200 }, txn);
      } catch(error) {
        expect(error).toEqual('No pokemon with given ID');
      }
    });
  });

  describe('#delete', () => {
    it('destroys the specified pokemon record', async () => {
      const pokemonId = await getRandomPokemonId(txn);
      await Pokemon.delete(pokemonId, txn);

      try {
        await Pokemon.get(pokemonId, txn);
      } catch(error) {
        expect(error).toEqual('No pokemon with given ID');
      }
    });

    it('returns the deleted pokemon', async () => {
      const pokemonId = await getRandomPokemonId(txn);
      const deletedPokemon = await Pokemon.delete(pokemonId, txn);
      const dbPokemon = await Pokemon.query(txn).findById(pokemonId);
      expect(deletedPokemon).toEqual(dbPokemon);
    });

    it('returns an error when given an invalid id', async () => {
      try {
        await Pokemon.delete(nonexistentId, txn);
      } catch(error) {
        expect(error).toEqual('No pokemon with given ID');
      }
    });

    it('deletes any associated items', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      const pokemonId = allPokemon[0].id
      await Pokemon.delete(pokemonId, txn);
      const items = await Item.query(txn).where({ pokemonId, deletedAt: null });
      expect(items).toEqual([]);
    });
  });
});
