import { transaction } from 'objection';
import Puppy from '../puppy';

describe('Puppy Model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Puppy.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('create', () => {
    it('creates a puppy', async () => {
      const puppy = await Puppy.create({ name: 'Sweet Pea' }, txn);

      expect(puppy.name).toBe('Sweet Pea');

      const puppies = await Puppy.getAll(txn);

      expect(puppies.length).toBe(1);
      expect(puppies[0].id).toBe(puppy.id);
    });
  });
});
