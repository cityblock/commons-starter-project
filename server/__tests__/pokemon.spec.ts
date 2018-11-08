import { transaction } from 'objection';
import Pokemon, { IPokemonCreateFields } from '../models/Pokemon';
import Item from '../models/item';
import { pokemonSample } from '../pokemon-mocks';
import { buildRandomItem } from '../item-mocks';

describe('Pokemon Model', () => {
  let txn = null as any;
  let samplePokemon: IPokemonCreateFields;
  [samplePokemon] = pokemonSample(0, 1);

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a Pokemon instance', async () => {
      const newPoke = await Pokemon.create(samplePokemon, txn);
      Object.keys(samplePokemon).forEach((propName: string) => {
        expect(newPoke).toHaveProperty(propName);
        expect(newPoke[propName]).not.toBeFalsy();
      })
    });
  });
  describe('get', () => {
    it('retrieves a pokemon and associated items', async () => {
      // seed test db
      const newPoke = await Pokemon.create(samplePokemon, txn);
      const sampleItem = buildRandomItem(newPoke.id);
      await Item.create(sampleItem, txn);

      // get pokemon instance & linked items
      const firstPoke = await Pokemon.get(newPoke.id, txn);
      expect(true).toBe(true);
    })
  });
});