import * as dotenv from 'dotenv';
dotenv.config();
import * as newrelic from 'newrelic';

import { ErrorReporting } from '@google-cloud/error-reporting';
import * as compression from 'compression';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import * as Knex from 'knex';
import * as kue from 'kue';
import { Model, Transaction } from 'objection';
import * as pg from 'pg';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import config from './config';
import expressConfig from './express';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';
import { createRedisClient } from './lib/redis';
import Logging from './logging';

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

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

/* tslint:disable no-var-requires */
const knexConfig = require('./models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

kue.createQueue({ redis: createRedisClient() });

export type Env = 'production' | 'development' | 'test';

export interface IMainOptions {
  env: Env;
  transaction?: Transaction;
  allowCrossDomainRequests?: boolean;
}

export async function main(options: IMainOptions) {
  const errorReporting = new ErrorReporting({
    credentials: JSON.parse(String(config.GCP_CREDS)),
  });

  await expressConfig(
    app,
    logger,
    errorReporting,
    options.transaction,
    options.allowCrossDomainRequests,
    newrelic,
  );

  const ws = createServer(app);

  return ws.listen(app.get('port'), () => {
    /* tslint:disable no-unused-expression */
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams: { authToken: string }) => {
          return getGraphQLContext(connectionParams.authToken, logger, {
            errorReporting,
          });
        },
      } as any,
      {
        server: ws,
        path: '/subscriptions',
      },
    );
    /* tslint:enable no-unused-expression */
  });
}

if (require.main === module) {
  try {
    main({ env: config.NODE_ENV as Env });
  } catch (err) {
    logger.error(err);
  }
}
