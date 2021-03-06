import Knex from 'knex';
import Objection from 'objection';
import * as knexConfig from '../models/knexfile';

export const setupDb = () => {
  const config = (knexConfig as { [key: string]: any }).test;
  const knex = Knex(config);
  Objection.Model.knex(knex);
  return {
    destroy: () => {
      knex.destroy();
    },
  };
};

export const testGraphqlContext = (ctx: any) => ({
  getOrCreateTransaction: (
    testTransaction: Objection.Transaction,
    cb: <T>(cb: Objection.Transaction) => Promise<T>,
  ) => cb(testTransaction),
  ...ctx,
});
