import dotenv from 'dotenv';
dotenv.config();
import { ErrorReporting } from '@google-cloud/error-reporting';
import { ApolloEngine } from 'apollo-engine';
import compression from 'compression';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { Server as HttpServer } from 'http';
import Knex from 'knex';
import kue from 'kue';
import { Model, Transaction } from 'objection';
import pg from 'pg';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import config from './config';
import expressConfig from './express';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';
import { createRedisClient } from './lib/redis';
import Logging from './logging';
import knexConfig from './models/knexfile';

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
  const credentials = JSON.parse(String(config.GCP_CREDS));
  const errorReporting = new ErrorReporting({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    projectId: credentials.project_id,
  });

  await expressConfig(
    app,
    logger,
    errorReporting,
    options.transaction,
    options.allowCrossDomainRequests,
  );

  const server = new HttpServer(app);

  const engine = new ApolloEngine({
    apiKey: config.ENGINE_API_KEY,
    origins: [{ supportsBatch: true }],
    reporting: {
      privateHeaders: ['auth_token'],
      noTraceErrors: true,
      noTraceVariables: true,
      disabled: config.NODE_ENV !== 'production',
    },
  });

  engine.listen({ port: app.get('port'), httpServer: server }, () => {
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
        server,
        path: '/subscriptions',
      },
    );
    /* tslint:enable no-unused-expression */
  });
  return {
    stop: async () => {
      await engine.stop();
      await server.close();
    },
  };
}

if (require.main === module) {
  try {
    main({ env: config.NODE_ENV as Env });
  } catch (err) {
    logger.error(err);
  }
}
