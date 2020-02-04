import { transaction, Transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import Pokemon, { IPokemonInput } from '../pokemon';
import { generateMockItemInput } from './item.spec';

export const mockPokemonInput = {
  pokemonNumber: 129,
  name: 'Magikarp',
  attack: 4,
  defense: 9,
  pokeType: 'water',
  moves: ['splash'],
  imageUrl: 'https://www.google.com',
} as IPokemonInput;

describe('pokemon model', () => {
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

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

  describe('getAll', () => {
    it('should return all pokemon', async () => {
      const pokemon = await Pokemon.getAll(txn);
      expect(pokemon).not.toHaveLength(0);
    });
  });

  describe('get', () => {
    it('should return a single pokemon and associated items', async () => {
      // create a pokemon and item associated with that pokemon
      const mockItemInput = await generateMockItemInput(txn);
      const newItem = await Item.create(mockItemInput, txn);

      // get that pokemon
      const pokemon = await Pokemon.get(mockItemInput.pokemonId, txn);
      expect(pokemon.id).toEqual(mockItemInput.pokemonId);
      expect(pokemon.items).not.toHaveLength(0);
      expect(pokemon.items[0]).toEqual(newItem);
    })
  })

  describe('create', () => {
    it('should create and return a pokemon', async () => {
      const pokemon = await Pokemon.create(mockPokemonInput, txn);
      expect(pokemon.name).toEqual(mockPokemonInput.name);
    });
  });

  describe('edit', () => {
    it('should edit and return an existing pokemon', async () => {
      // create a pokemon
      const newPokemon = await Pokemon.create(mockPokemonInput, txn);

      // edit that pokemon
      const newAttack = 9001;
      const newPokeType = 'dragon';
      const input = {
        attack: newAttack,
        pokeType: newPokeType
      } as Partial<IPokemonInput>;
      const pokemon = await Pokemon.edit(newPokemon.id, input, txn);
      expect(pokemon.attack).toEqual(newAttack);
      expect(pokemon.pokeType).toEqual(newPokeType);
    });
  });

  describe('delete', () => {
    it('should "delete" a pokemon and return it', async () => {
      // create a pokemon
      const newPokemon = await Pokemon.create(mockPokemonInput, txn);

      // "delete" that pokemon
      const pokemon = await Pokemon.delete(newPokemon.id, txn);
      expect(pokemon.deletedAt).not.toBeNull();
    });
  });

});
