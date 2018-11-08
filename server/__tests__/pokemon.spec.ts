import { transaction } from 'objection';
import Pokemon from '../models/Pokemon';
import { pokemonSample } from '../pokemon-mocks';

describe('Pokemon Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a Pokemon instance', async () => {
      const [samplePokemon] = pokemonSample(0, 1);
      const newPoke = await Pokemon.create(samplePokemon, txn);
      Object.keys(samplePokemon).forEach((propName: string) => {
        expect(newPoke).toHaveProperty(propName);
        expect(newPoke[propName]).not.toBeFalsy();
      })
    });
  });
});