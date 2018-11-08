import { transaction } from 'objection';
import Pokemon from '../models/Pokemon';

describe('Pokemon Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Pokemon.knex());
    console.log({ txn });
  });

  // afterEach(async () => {
  //   if (txn) await txn.rollback();
  // });

  describe('getAll', () => {
    it('retrieves all Pokemon from database', async () => {
      const allPokemon = await Pokemon.getAll(txn);
      expect(allPokemon).not.toBeUndefined();
      // expect(allPokemon.length).toBeGreaterThan(1);
    });
  });
});