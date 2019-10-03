import { Transaction } from 'objection';
import uuid from 'uuid/v4';
import { Pokemon } from '../pokemon';
import { all } from 'q';

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
    expect(allPokemonAndItems[1].length).toEqual(3);
  });
});

describe('edit a pokemon', () => {
  const txn = null as any;
  it('should edit a pokemon', async () => {
    const allPokemon = await Pokemon.getAll(txn);
    const randomInt = Math.floor(Math.random() * allPokemon.length);
    const randomPokemon = allPokemon[randomInt];
    const currentTime = new Date(Date.now());
    const fieldToEditValue = randomPokemon.attack + 1;
    const editedPokemon = await Pokemon.edit(
      randomPokemon.id,
      {
        attack: fieldToEditValue,
        updatedAt: currentTime,
      },
      txn,
    );
    expect(editedPokemon).toMatchObject({
      id: randomPokemon.id,
      pokemonNumber: randomPokemon.pokemonNumber,
      name: randomPokemon.name,
      attack: fieldToEditValue,
      defense: randomPokemon.defense,
      pokeType: randomPokemon.pokeType,
      moves: randomPokemon.moves,
      imageUrl: randomPokemon.imageUrl,
      createdAt: randomPokemon.createdAt,
      updatedAt: currentTime,
      deletedAt: randomPokemon.deletedAt,
    });
  });
});

describe('test soft delete', () => {
  const txn = null as any;
  it('should soft delete a specific pokemon', async () => {
    const itemToDeleteList = await Pokemon.getNonDeletedPokemon(txn);
    const itemToDelete = itemToDeleteList[0];
    expect(itemToDelete.deletedAt).toBeNull();
    const deletedItem = await Pokemon.delete(itemToDelete.id, txn);
    expect(deletedItem.deletedAt).toBeTruthy();
  });
});

describe('get pokemon and items for specific pokemon id', () => {
  const txn = null as any;
  it('should get a pokemon and all of its items', async () => {
    const testPokemon = await Pokemon.get('04ccdadd-e156-42d8-9dd9-0a0e4fd760b0', txn);
    expect(testPokemon).toMatchObject({
      id: '04ccdadd-e156-42d8-9dd9-0a0e4fd760b0',
      name: 'Pokemon Egg',
      pokemonId: 'c818bf28-d0b4-4522-b326-a440ad0ceb3c',
      price: 69,
      happiness: 73,
      imageUrl: 'https://rebekahlang.files.wordpress.com/2015/08/pokemon-egg-png.png',
      createdAt: new Date('2019-10-02 12:43:03.909-04'),
      updatedAt: new Date('2019-10-02 12:43:03.909-04'),
      deletedAt: null,
    });
  });
});
