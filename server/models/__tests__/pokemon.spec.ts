import { transaction, Transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Pokemon, { IPokemonCreateInput, IPokemonEditInput } from '../pokemon';


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
    console.error = jest.fn();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('getAll', () => {
    it('should return all pokemon', async () => {
      const pokemon = await Pokemon.getAll(txn);
      expect(pokemon).toHaveLength(52);
    });
  });

  describe('get', () => {
    it('should return a single pokemon and associated items', async () => {
      const pokemonId = '01515123-9476-414b-b328-ea627cc317f4';
      const pokemon = await Pokemon.get(pokemonId, txn);
      expect(pokemon.id).toEqual(pokemonId);
      expect(pokemon.items).toHaveLength(3);
    })
  })

  describe('create', () => {
    it('should create and return a pokemon', async () => {
      const pokemonName = 'Magikarp';
      const input = {
        pokemonNumber: 129,
        name: pokemonName,
        attack: 4,
        defense: 9,
        pokeType: 'water',
        moves: ['splash'],
        imageUrl: 'https://www.google.com',
      } as IPokemonCreateInput;
      const pokemon = await Pokemon.create(input, txn);
      expect(pokemon.name).toEqual(pokemonName);
    });
  });

  describe('edit', () => {
    it('should edit and return an existing pokemon', async () => {
      const newAttack = 9001;
      const newPokeType = 'dragon';
      const input = {
        attack: newAttack,
        pokeType: newPokeType
      } as IPokemonEditInput;
      const pokemonId = '01515123-9476-414b-b328-ea627cc317f4';
      const pokemon = await Pokemon.edit(pokemonId, input, txn);
      expect(pokemon.attack).toEqual(newAttack);
      expect(pokemon.pokeType).toEqual(newPokeType);
    });
  });

  describe('delete', () => {
    it('should "delete" a pokemon and return it', async () => {
      const pokemonId = '01515123-9476-414b-b328-ea627cc317f4';
      const pokemon = await Pokemon.delete(pokemonId, txn);
      expect(pokemon.deletedAt).not.toBeNull();
    });
  });

});
