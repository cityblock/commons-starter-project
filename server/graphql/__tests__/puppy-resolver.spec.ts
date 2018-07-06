import { graphql, print } from 'graphql';
import Puppy from '../../models/puppy';
import { transaction } from 'objection';
import getPuppies from '../../../app/graphql/queries/get-puppies.graphql';
import schema from '../make-executable-schema';

describe('Puppy Resolver', () => {
  let txn = null as any;

  const getPuppiesQuery = print(getPuppies);

  beforeEach(async () => {
    txn = await transaction.start(Puppy.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve puppies', () => {
    it('gets all puppies', async () => {
      await Puppy.create({ name: 'Sweet Pea' }, txn);

      const result = await graphql(schema, getPuppiesQuery, null, {
        testTransaction: txn,
      });

      expect(result.data!.puppies.length).toBe(1);
    });
  });
});
