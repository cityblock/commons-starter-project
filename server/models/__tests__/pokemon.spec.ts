import 'jest-extended';
import { transaction } from 'objection';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../pokemon';

// DATA FIXTURES
const POKEMON = {
  id: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
  pokemonNumber: 1,
  name: 'Bulbasaur',
  attack: 11,
  defense: 22,
  pokeType: 'grass',
  moves: ['Tackle', 'Growl', 'Leech Seed'],
  imageUrl:
    'https://cdn.bulbagarden.net/upload/thumb/2/21/001Bulbasaur.png/1200px-001Bulbasaur.png',
  createdAt: new Date(Date.parse('2019-06-06 13:57:58.363-04')),
  updatedAt: new Date(Date.parse('2019-06-06 13:57:58.363-04')),
};

const ITEMS = [
  {
    createdAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
    deletedAt: null,
    happiness: 55,
    id: '1f77d3da-e173-4c14-b252-b580fb548acf',
    imageUrl:
      'https://i0.wp.com/3.bp.blogspot.com/-N5HwBRxnyjk/V5tp0Cst4nI/AAAAAAAAnzg/J22q_lbPzv0A27sLzoPCcIIFPn-R1-4fgCK4B/s1600/enhanced-buzz-9890-1432569203-0.jpg',
    name: 'Amulet Coin',
    pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
    price: 59,
    updatedAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
  },
  {
    createdAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
    deletedAt: null,
    happiness: 42,
    id: '1c79c5d3-7883-4fdd-8ff9-cd49ff28438c',
    imageUrl:
      'https://vignette.wikia.nocookie.net/pokemongo/images/f/ff/King%27s_Rock.png/revision/latest?cb=20170215214501',
    name: "King's Rock",
    pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
    price: 30,
    updatedAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
  },
  {
    createdAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
    deletedAt: null,
    happiness: 10,
    id: '85fd60e9-6327-4572-9427-b132e335d3b8',
    imageUrl: 'https://rebekahlang.files.wordpress.com/2015/08/pokemon-egg-png.png',
    name: 'Pokemon Egg',
    pokemonId: 'd3e85631-93bd-41dd-a363-bd5e67e73f81',
    price: 7,
    updatedAt: new Date(Date.parse('2019-06-06T17:57:58.417Z')),
  },
];

describe('pokemon', () => {
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

  describe('get', () => {
    it('should get pokemon by id', async () => {
      const fetchedPokemon = await Pokemon.get(POKEMON.id, txn);
      expect(fetchedPokemon).toMatchObject(POKEMON);
      expect(fetchedPokemon).toHaveProperty('item');
      expect(fetchedPokemon.item).toIncludeSameMembers(ITEMS);
    });
  });

  describe('create', () => {
    it('should create a pokemon', async () => {
      const createdPokemon = await Pokemon.create(POKEMON, txn);
      expect(POKEMON).toMatchObject(createdPokemon);
    });
  });

  // expect(concernById).toMatchObject(concern);

  describe('delete', () => {
    it('should delete pokemon', async () => {
      const deleted = await Pokemon.delete(POKEMON.id, txn);
      expect(deleted.deletedAt).toBeTruthy();
      expect(deleted.id).toBe(POKEMON.id);
      await expect(Pokemon.get(deleted.id, txn)).toReject();
      // do I need to rollback here?
      await txn.rollback();
    });
  });

  // describe('edit', () => {
  //   it('should edit email', async () => {
  //     const { email, user } = await setup(txn);
  //     const editedEmail = await Email.edit(
  //       {
  //         emailAddress: 'new@email.edu',
  //         description: 'new',
  //         updatedById: user.id,
  //       },
  //       email.id,
  //       txn,
  //     );
  //     expect(editedEmail).toMatchObject({
  //       emailAddress: 'new@email.edu',
  //       description: 'new',
  //       updatedById: user.id,
  //     });
  //   });
  // });
});
