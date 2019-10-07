import uuid from 'uuid/v4';
import { Pokemon } from '../pokemon';

describe('get all pokemon', () => {
  const txn = null as any;
  it('should get all pokemon in ascending number order', async () => {
    const allPokemon = await Pokemon.getAll(txn);
    const firstPokemon = allPokemon[0];
    expect(firstPokemon).toMatchObject({
      id: 'f9f7c348-9ab2-43c4-8927-4f15e818bb24',
      pokemonNumber: 1,
      name: 'Bulbasaur',
      attack: 11,
      defense: 22,
      pokeType: 'grass',
      moves: ['Tackle', 'Growl', 'Leech Seed'],
      imageUrl:
        'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
      createdAt: new Date('2019-10-02 12:43:03.856-04'),
      updatedAt: new Date('2019-10-02 12:43:03.856-04'),
      deletedAt: new Date('2019-10-03 17:38:34.155-04'),
    });
  });
});

describe('create new pokemon', () => {
  const txn = null as any;
  it('should create a new pokemon', async () => {
    const currentTime = new Date(Date.now());
    const pokemonUUID = uuid();
    const pokeNumber = Math.floor(Math.random() * 10000);
    const pokemonName = 'Test' + pokeNumber.toString();
    const newPokemon = await Pokemon.create(
      {
        id: pokemonUUID,
        pokemonNumber: pokeNumber,
        name: pokemonName,
        attack: 33,
        defense: 15,
        pokeType: 'psychic',
        moves: ['Growl'],
        imageUrl: 'https://www.cityblock.com/',
        createdAt: currentTime,
        updatedAt: currentTime,
        deletedAt: null,
      },
      txn,
    );
    expect(newPokemon).toMatchObject({
      id: pokemonUUID,
      pokemonNumber: pokeNumber,
      name: pokemonName,
      attack: 33,
      defense: 15,
      pokeType: 'psychic',
      moves: ['Growl'],
      imageUrl: 'https://www.cityblock.com/',
      createdAt: currentTime,
      updatedAt: currentTime,
    });
  });
});

describe('get items for one pokemon', () => {
  const txn = null as any;
  it('should get all items for a pokemon', async () => {
    const allPokemonAndItems = await Pokemon.get('04ccdadd-e156-42d8-9dd9-0a0e4fd760b0', txn);
<<<<<<< HEAD
    const items = allPokemonAndItems[1];
=======
    const items = allPokemonAndItems;
>>>>>>> e7dfd909cc5a26e0b2138653312bd7a9570d5ef1
    expect(items.length).toEqual(3);
  });
});

describe('edit a pokemon', () => {
  const txn = null as any;
  it('should edit a pokemon', async () => {
    const currentTime = new Date(Date.now());
    const pokemonUUID = uuid();
    const pokeNumber = Math.floor(Math.random() * 10000);
    const pokemonName = 'Test' + pokeNumber.toString();
    const newPokemon = await Pokemon.create(
      {
        id: pokemonUUID,
        pokemonNumber: pokeNumber,
        name: pokemonName,
        attack: 33,
        defense: 15,
        pokeType: 'psychic',
        moves: ['Growl'],
        imageUrl: 'https://www.cityblock.com/',
        createdAt: currentTime,
        updatedAt: currentTime,
        deletedAt: null,
      },
      txn,
    );
    const fieldToEditValue = newPokemon.attack + 1;
    const editedPokemon = await Pokemon.edit(
      newPokemon.id,
      {
        attack: fieldToEditValue,
        updatedAt: currentTime,
      },
      txn,
    );
    expect(editedPokemon).toMatchObject({
      id: newPokemon.id,
      pokemonNumber: newPokemon.pokemonNumber,
      name: newPokemon.name,
      attack: fieldToEditValue,
      defense: newPokemon.defense,
      pokeType: newPokemon.pokeType,
      moves: newPokemon.moves,
      imageUrl: newPokemon.imageUrl,
      createdAt: newPokemon.createdAt,
      updatedAt: currentTime,
      deletedAt: newPokemon.deletedAt,
    });
  });
});

describe('test soft delete', () => {
  const txn = null as any;
  it('should soft delete a specific pokemon', async () => {
    const currentTime = new Date(Date.now());
    const pokemonUUID = uuid();
    const pokeNumber = Math.floor(Math.random() * 10000);
    const pokemonName = 'Test' + pokeNumber.toString();
    const pokemonToDelete = await Pokemon.create(
      {
        id: pokemonUUID,
        pokemonNumber: pokeNumber,
        name: pokemonName,
        attack: 33,
        defense: 15,
        pokeType: 'psychic',
        moves: ['Growl'],
        imageUrl: 'https://www.cityblock.com/',
        createdAt: currentTime,
        updatedAt: currentTime,
        deletedAt: null,
      },
      txn,
    );
    expect(pokemonToDelete.deletedAt).toBeNull();
    const deletedPokemon = await Pokemon.delete(pokemonToDelete.id, txn);
    expect(deletedPokemon.deletedAt).toBeTruthy();
  });
});
