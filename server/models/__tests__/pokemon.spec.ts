import { transaction, Transaction } from 'objection';
import { PokeType } from 'schema';
import uuid from 'uuid/v4';
import Item from '../item';
import Pokemon from '../pokemon';

interface ISetup {
  pokemon: Pokemon;
  item: Item;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const pokemon = await Pokemon.create(
    {
      pokemonNumber: 1111,
      name: 'Newbie',
      attack: 9,
      defense: 20,
      pokeType: 'bug' as PokeType,
      moves: ['sit still', 'eat pizza'],
      imageUrl: 'fakeImageURL',
    },
    txn,
  );
  const item = await Item.create(
    {
      name: 'scissors',
      pokemonId: pokemon.id,
      price: 20,
      happiness: 50,
      imageUrl: 'fakeImageUrl',
    },
    txn,
  );

  return { pokemon, item };
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
    it('retrieves a pokemon and its associated items', async () => {
      const { pokemon, item } = await setup(txn);
      const fetchedPokemon = await Pokemon.get(pokemon.id, txn);
      expect(fetchedPokemon).toMatchObject(pokemon);
      expect(fetchedPokemon.items[0]).toMatchObject(item);
      expect(fetchedPokemon.items.length).toEqual(1);
    });

    it('only retrieves un-deleted pokemon items', async () => {
      const { pokemon, item } = await setup(txn);
      const itemTwo = await Item.create(
        {
          name: 'sticker',
          pokemonId: pokemon.id,
          price: 12,
          happiness: 6,
          imageUrl: 'fakeImageUrlTwo',
        },
        txn,
      );
      const fetchedPokemon = await Pokemon.get(pokemon.id, txn);
      expect(fetchedPokemon.items).toContainEqual(item);
      expect(fetchedPokemon.items).toContainEqual(itemTwo);
      expect(fetchedPokemon.items.length).toEqual(2);

      const deletedItem = await Item.delete(itemTwo.id, txn);
      const reFetchedPokemon = await Pokemon.get(pokemon.id, txn);
      expect(reFetchedPokemon.items.length).toEqual(1);
      expect(reFetchedPokemon.items).not.toContainEqual(deletedItem);
      expect(reFetchedPokemon.items).toContainEqual(item);
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
      const pokemonTwo = await Pokemon.create(
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
      expect(allPokemon[0]).toMatchObject(pokemon);
      expect(allPokemon[1]).toMatchObject(pokemonTwo);
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
      const reFetchedPokemon = await Pokemon.get(pokemon.id, txn);
      expect(reFetchedPokemon.name).toEqual('Felix');
    });
  });

  describe('delete', () => {
    const deleteSetup = async (): Promise<Pokemon> => {
      const { pokemon } = await setup(txn);
      const deletedPokemon = await Pokemon.delete(pokemon.id, txn);
      return deletedPokemon;
    };

    it('changes deletedAt from null', async () => {
      const deletedPokemon = await deleteSetup();
      expect(deletedPokemon.deletedAt).not.toBe(null);
    });

    it('makes the deleted pokemon unretrievable', async () => {
      const deletedPokemon = await deleteSetup();
      await expect(Pokemon.get(deletedPokemon.id, txn)).rejects.toMatch(
        `No such pokemon exists: ${deletedPokemon.id}`,
      );
    });

    it('removes the deleted pokemon from the total pokemon list', async () => {
      const deletedPokemon = await deleteSetup();
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon).not.toContainEqual(deletedPokemon);
    });
  });
});
