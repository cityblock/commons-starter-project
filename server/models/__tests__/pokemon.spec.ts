import axios from 'axios';
// import nock from 'nock';
import { transaction, Transaction } from 'objection';
import { v4 as uuid } from 'uuid';
import { setupDb } from '../../lib/test-utils';
import Pokemon from '../pokemon';
import { IPokemonCreateFields, IPokemonEditInput } from '../pokemon';
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

  describe('get sll', () => {
    it('should retrieve all pokemons', async () => {
      const allPokemons = await Pokemon.getAll(txn);
      expect(allPokemons).toHaveLength(52);
      // console.log("all Pokemons", allPokemons)
    });
  });

  describe('create and get pokemon', () => {
    it('should create and retrieve a pokemon', async () => {
      const pokemonFields: IPokemonCreateFields = {
        id: uuid(),
        pokemonNumber: 1000,
        name: 'poke-dex-test',
        attack: 22,
        defense: 32,
        pokeType: 'fire',
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      const pokemon = await Pokemon.create(pokemonFields, txn);
      // tslint:disable-next-line: no-console
      console.log('pokemon: ', pokemon);
      expect(pokemon).toMatchObject(pokemonFields);
      // const patientById = await Patient.get(patient.id, patient.homeMarketId, txn);
      // expect(patientById).toMatchObject({
      //   id: patient.id,
      // });
    });
  });

  describe('get pokemon With items', () => {
    it('should get a pokemon by id and its associated items', async () => {
      try {
        const pokemonFields: IPokemonCreateFields = {
          id: uuid(),
          pokemonNumber: 1001,
          name: 'poke-dex-get-test',
          attack: 23,
          defense: 44,
          pokeType: 'grass',
          moves: ['Venoshock', 'Solar Beam'],
          imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
        };
        const pokemon = await Pokemon.create(pokemonFields, txn);
        const pokeonId = pokemon.id;
        const getPokemon = await Pokemon.get(pokeonId, txn);
        // tslint:disable-next-line: no-console
        console.log('get pokemon: ', getPokemon);
      } catch (pokemonCreateErr) {
        // tslint:disable-next-line: no-console
        console.log('failed to create a new pokeon in db', pokemonCreateErr);
      }
    });
  });
  describe('update pkemon', () => {
    it('should update a pokemon, retriev it and verify all new content', async () => {
      const pokemonFields: IPokemonCreateFields = {
        id: uuid(),
        pokemonNumber: 1002,
        name: 'poke-dex-udate-before-test',
        attack: 22,
        defense: 32,
        pokeType: 'fire',
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      const pokemonUpdateFields: IPokemonEditInput = {
        name: 'poke-dex-udate-after-test',
        attack: 1,
        defense: 4,
        pokeType: 'fire',
        moves: ['Tackle', 'Growl', 'Leech Seed'],
        imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
      };
      try {
        const pokemon = await Pokemon.create(pokemonFields, txn);
        const updatedPokemon = await Pokemon.edit(pokemon.id, pokemonUpdateFields, txn);
        // tslint:disable-next-line: no-console
        console.log('updated pokemon: ', updatedPokemon);
        expect(updatedPokemon).toMatchObject({
          id: pokemon.id,
          pokemonNumber: pokemon.pokemonNumber,
          name: pokemonUpdateFields.name,
          attack: pokemonUpdateFields.attack,
          defense: pokemonUpdateFields.defense,
          pokeType: pokemonUpdateFields.pokeType,
          moves: pokemonUpdateFields.moves,
          imageUrl: pokemonUpdateFields.imageUrl,
        });
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('test failed because: ', err);
      }
    });
  });
  describe('mark as deleted pokemon', () => {
    it('should mark a pokemon as deleted and then retriev it', async () => {
      try {
        const pokemonFields: IPokemonCreateFields = {
          id: uuid(),
          pokemonNumber: 1003,
          name: 'poke-dex-delete-test',
          attack: 3,
          defense: 12,
          pokeType: 'rock',
          moves: ['Rock Slide', 'Defense Curl'],
          imageUrl: 'https://cdn.bulbagarden.net/upload/c/ca/092Gastly.png',
        };
        const pokemon = await Pokemon.create(pokemonFields, txn);
        const pokeonId = pokemon.id;
        const markedAsDeletedPokemon = await Pokemon.delete(pokeonId, txn);
        // tslint:disable-next-line: no-console
        console.log('delete test pokemon result: ', markedAsDeletedPokemon);
        expect(markedAsDeletedPokemon.deletedAt).not.toBeFalsy();
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log('failed to created Pokemon or mark as deleted, error: ', err);
      }
    });
  });
});
// *********************************************************************************************************** */
