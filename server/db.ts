import * as Knex from 'knex';
import { Model } from 'objection';
import config from './config';
import Logging from './logging';
/* tslint:disable no-var-requires */
const knexConfig = require('./models/knexfile');
/* tslint:enable no-var-requires */

export interface IPaginationOptions {
  pageNumber: number;
  pageSize: number;
}

export interface IPaginatedResults<T> {
  results: T[];
  total: number;
}

let singleton: Promise<Db> | null = null;
let knex: Knex | null = null;
const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

/*
 * Typed wrapper around the Commons PostgreSQL database.
 */
export default class Db {
  static async connect(): Promise<Db> {
    knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
    Model.knex(knex);
    return new Db();
  }

  static async get(): Promise<Db> {
    if (singleton) return singleton;
    logger.log('db.ts: Creating new db connection');
    singleton = Db.connect();
    return singleton;
  }

  static async clear() {
    if (knex) {
      return knex.transaction(async trx => {
        await trx
          .withSchema('information_schema')
          .select('table_name')
          .from('tables')
          .whereRaw(`table_catalog = ? AND table_schema = ? AND table_name != ?`, [
            'public',
            'knex_migrations',
          ])
          .map(async (row: any) => {
            await trx.raw(`TRUNCATE TABLE public.${row.table_name} CASCADE`);
          });
      });
    }
  }

  // Used in tests to ensure they do not share db connections
  static async release() {
    logger.log('db.ts: Releasing db connection');
    if (knex) {
      await knex.destroy();
      knex = null;
    }
    singleton = null;
  }
}
