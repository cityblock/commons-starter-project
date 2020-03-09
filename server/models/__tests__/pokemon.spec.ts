import axios from 'axios';
// import nock from 'nock';
import { transaction, Transaction } from 'objection';
import { v4 as uuid } from 'uuid';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../pokemon';
import { IPokemonCreateFields } from '../pokemon';
axios.defaults.adapter = require('axios/lib/adapters/http');

// *********************************************************************************************************** */
describe('pokemon model', () => {
  let testDb: ReturnType<typeof setupDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupDb();
    axios.get = jest.fn();
  });

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
    console.error = jest.fn();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('getAll', () => {
    it('should retrieve all pokemons', async () => {
      const allPokemons = await Pokemon.getAll(txn);
      expect(allPokemons).toHaveLength(52);
      // console.log("all Pokemons", allPokemons)
    });
  });

  describe('createAndGet', () => {
    it('should create and retrieve a pokemin', async () => {
      const pokemonFields: IPokemonCreateFields = {
        pokemonId: uuid(),
        pokemonNumber: 53,
        name: 'poke-dex-test',
        attack: 22,
        defense: 32,
        pokeType: 'fire',
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      const pokemon = await Pokemon.create(pokemonFields, txn);
      expect(pokemon).toMatchObject(pokemonFields);
      // const patientById = await Patient.get(patient.id, patient.homeMarketId, txn);
      // expect(patientById).toMatchObject({
      //   id: patient.id,
      // });
    });
  });
});
// *********************************************************************************************************** */
