import { transaction, Transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Item from '../item';
import { IItemCreateInput } from '../item';
import { IPokemonCreateInput, PokemonType } from '../pokemon';
import Pokemon from '../pokemon';

describe('item model', () => {
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;
  // tslint:disable-next-line: prefer-const
  //  let pokemon: IPokemonCreateInput;

  beforeAll(async () => {
    testDb = setupDb();
    // txn = await transaction.start(Item.knex());
    // console.error = jest.fn();
    // try {
    //   const pokemonFields: IPokemonCreateInput = {
    //     pokemonNumber: 1005,
    //     name: 'poke-dex-item-test',
    //     attack: 22,
    //     defense: 32,
    //     pokeType: PokemonType.fire,
    //     moves: ['Tackle', 'Growl', 'Leech Seed'],
    //     imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
    //   };
    //   const tmp = await Pokemon.create(pokemonFields, txn);
    //   pokemon.id = tmp.id;
    //   // tslint:disable-next-line: no-console
    //   console.log('pokemon for item tests:', pokemon);
    // } catch (err) {
    //   // tslint:disable-next-line: no-console
    //   console.log('failed creating a pokemon for item tests');
    // }
    // await txn.rollback();
  });

  beforeEach(async () => {
    txn = await transaction.start(Item.knex());
    console.error = jest.fn();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  afterEach(async () => {
    await txn.rollback();
  });
  describe('create and get item', () => {
    it('should create and retrieve an item', async () => {
      const pokemonFields: IPokemonCreateInput = {
        pokemonNumber: 1005,
        name: 'poke-dex-item-create-test',
        attack: 22,
        defense: 32,
        pokeType: PokemonType.fire,
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };

      const itemFields: IItemCreateInput = {
        name: 'item-create-test',
        price: 43,
        happiness: 29,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      try {
        const pokemon = await Pokemon.create(pokemonFields, txn);
        itemFields.pokemonId = pokemon.id;
        const item = await Item.create(itemFields, txn);
        expect(item).toMatchObject(itemFields);
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('Failed to create a new item. error: ', err);
      }
    });
  });
  describe('get item by ID', () => {
    it('should get an item by id', async () => {
      const pokemonFields: IPokemonCreateInput = {
        pokemonNumber: 1006,
        name: 'poke-dex-item-get-test',
        attack: 22,
        defense: 32,
        pokeType: PokemonType.fire,
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      const itemFields: IItemCreateInput = {
        name: 'item-get-test',
        price: 7,
        happiness: 15,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      try {
        const pokemon = await Pokemon.create(pokemonFields, txn);
        itemFields.pokemonId = pokemon.id;
        const item = await Item.create(itemFields, txn);
        const pokeonIditemId = item.id;
        const getItem = await Item.get(pokeonIditemId, txn);
        expect(getItem).toMatchObject(itemFields);
        await Pokemon.delete(pokemon.id, txn);
      } catch (pokemonCreateErr) {
        // tslint:disable-next-line: no-console
        console.log('failed to create a new pokeon in db', pokemonCreateErr);
      }
    });
  });
  describe('update item', () => {
    it('should update an item, retriev it and verify all new content', async () => {
      const pokemonFields: IPokemonCreateInput = {
        pokemonNumber: 1007,
        name: 'poke-dex-item-update-test',
        attack: 22,
        defense: 32,
        pokeType: PokemonType.fire,
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      const itemFields: IItemCreateInput = {
        name: 'item-update-before-test',
        price: 55,
        happiness: 30,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      const itemUpdateFields: IItemCreateInput = {
        name: 'item-update-after-test',
        price: 60,
        happiness: 66,
        imageUrl:
          'https://static.giantbomb.com/uploads/square_medium/14/140474/2185101-baya_aranja_grande.png',
      };
      try {
        const pokemon = await Pokemon.create(pokemonFields, txn);
        itemFields.pokemonId = pokemon.id;
        const item = await Item.create(itemFields, txn);
        const updatedItem = await Item.edit(item.id, itemUpdateFields, txn);
        expect(updatedItem).toMatchObject(itemUpdateFields);
        await Pokemon.delete(pokemon.id, txn);
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('test failed because: ', err);
      }
    });
  });
  describe('mark as deleted item', () => {
    it('should mark an item as deleted and then retriev it', async () => {
      const pokemonFields: IPokemonCreateInput = {
        pokemonNumber: 1007,
        name: 'poke-dex-item-update-test',
        attack: 22,
        defense: 32,
        pokeType: PokemonType.fire,
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      const itemFields: IItemCreateInput = {
        name: 'item-delete-test',
        price: 12,
        happiness: 8,
        imageUrl:
          'https://pro-rankedboost.netdna-ssl.com/wp-content/uploads/2016/07/Lucky-Eggs.png',
      };
      try {
        const pokemon = await Pokemon.create(pokemonFields, txn);
        itemFields.pokemonId = pokemon.id;
        const item = await Item.create(itemFields, txn);
        const itemId = item.id;
        const markedAsDeletedItem = await Item.delete(itemId, txn);
        expect(markedAsDeletedItem.deletedAt).not.toBeFalsy();
        await Pokemon.delete(pokemon.id, txn);
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('failed to created item or mark as deleted, error: ', err);
      }
    });
  });
});
