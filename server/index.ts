import dotenv from 'dotenv';
dotenv.config();
import { ApolloEngine } from 'apollo-engine';
import compression from 'compression';
import express from 'express';
import { Server as HttpServer } from 'http';
import Knex from 'knex';
import { Model, Transaction } from 'objection';
import pg from 'pg';
import config from './config';
import expressConfig from './express';
import * as knexConfig from './models/knexfile';

const logger = console as any;

const app = express();

if (config.NODE_ENV === 'production') {
  // compress all responses
  app.use(compression());
}

// Adjust how postgres deserializes date columns from PostgreSQL
// Ensures date strings are returned instead of timestamps
const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID, val => {
  return val;
});

const knex = Knex((knexConfig as any)[config.NODE_ENV || 'development']);
Model.knex(knex);

export type Env = 'production' | 'development' | 'test';

export interface IMainOptions {
  env: Env;
  transaction?: Transaction;
  allowCrossDomainRequests?: boolean;
}

export async function main(options: IMainOptions) {
  await expressConfig(app, options.transaction, options.allowCrossDomainRequests);

  const server = new HttpServer(app);

  const engine = new ApolloEngine({
    apiKey: 'no-key',
    origins: [{ supportsBatch: true }],
    reporting: {
      noTraceErrors: true,
      noTraceVariables: true,
      disabled: config.NODE_ENV !== 'production',
    },
  });

  engine.listen({ port: app.get('port'), httpServer: server });
  return {
    stop: async () => {
      await engine.stop();
      await server.close();
    },
  };
}

if (require.main === module) {
  try {
    /* tslint:disable-next-line:no-floating-promises */
    main({ env: config.NODE_ENV as Env });
  } catch (err) {
    logger.error(err);
  }
}
