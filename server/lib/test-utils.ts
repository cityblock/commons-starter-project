import Knex from 'knex';
import omit from 'lodash/omit';
import random from 'lodash/random';
import Objection, { Transaction } from 'objection';
import Item from '../models/item';
import * as knexConfig from '../models/knexfile';
import Pokemon from '../models/pokemon';

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

export const filterTimestamps = (object: { createdAt?: any, updatedAt?: any, deletedAt: any }) => 
  omit(object, 'createdAt', 'updatedAt', 'deletedAt');

export const getRandomPokemonId = async (txn: Transaction): Promise<string> => {
  const allPokemon = await Pokemon.getAll(txn);
  return allPokemon[random(allPokemon.length - 1)].id
};

export const getRandomItemId = async (txn: Transaction): Promise<string> => {
  const allItems = await Item.query(txn).where({ deletedAt: null });
  return allItems[random(allItems.length - 1)].id
};
