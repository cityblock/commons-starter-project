import { transaction, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Item from '../item';
import Pokemon from '../pokemon';

interface ISetup {
  pokemon: Pokemon;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const pokemon = await Pokemon.create(
    {
      pokemonNumber: 1111,
      name: 'Newbie',
      attack: 9,
      defense: 20,
      pokeType: 'bug',
      moves: ['sit still', 'eat pizza'],
      imageUrl: 'fakeImageURL',
    },
    txn,
  );
  await Item.create(
    {
      name: 'scissors',
      pokemonId: pokemon.id,
      price: 20,
      happiness: 50,
      imageUrl: 'fakeImageUrl',
    },
    txn,
  );

  return { pokemon };
}

describe('Pokemon Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a pokemon', async () => {
      const { pokemon } = await setup(txn);
      expect(pokemon.name).toBe('Newbie');
      expect(pokemon.defense).toBe(20);
    });
  });

  describe('get', () => {
    it('retrieves a pokemon and associated items', async () => {
      const { pokemon } = await setup(txn);
      const fetchedPokemon = await Pokemon.get(pokemon.id, txn);
      expect(fetchedPokemon.name).toEqual('Newbie');
      expect(fetchedPokemon.items[0].name).toEqual('scissors');
    });

    it('throws error message if pokemon does not exist', async () => {
      const randomUUID = uuid();
      await expect(Pokemon.get(randomUUID, txn)).rejects.toMatch(
        `No such pokemon exists: ${randomUUID}`,
      );
    });
  });

  describe('getAll', () => {
    it('retrieves all pokemon', async () => {
      const { pokemon } = await setup(txn);
      await Pokemon.create(
        {
          pokemonNumber: 1112,
          name: 'Poke',
          attack: 12,
          defense: 19,
          pokeType: 'dragon',
          moves: ['fly', 'breathe fire'],
          imageUrl: 'fakeimageURL2',
        },
        txn,
      );

      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon.length).toBe(2);
      expect(allPokemon[0].id).toBe(pokemon.id);
    });
  });

  describe('edit', () => {
    it('correctly updates a pokemon', async () => {
      const { pokemon } = await setup(txn);
      const editedInput = {
        name: 'Felix',
      };
      const editedPokemon = await Pokemon.edit(pokemon.id, editedInput, txn);
      expect(editedPokemon.name).toEqual('Felix');
    });
  });

  describe('delete', () => {
    it('changes deletedAt from null', async () => {
      const { pokemon } = await setup(txn);
      const deletedPokemon = await Pokemon.delete(pokemon.id, txn);
      expect(deletedPokemon.deletedAt).not.toBe(null);
    });
  });
});
