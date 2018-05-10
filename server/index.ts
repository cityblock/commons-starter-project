import * as dotenv from 'dotenv';
dotenv.config();
import { ErrorReporting } from '@google-cloud/error-reporting';
import * as trace from '@google-cloud/trace-agent';
import config from './config';
import Logging from './logging';
if (config.NODE_ENV !== 'test') {
  /* tslint:disable no-var-requires */
  const credentials = JSON.parse(String(config.GCP_CREDS));
  trace.start({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    projectId: credentials.project_id,
  });
}
/* tslint:enable no-var-requires */
import * as compression from 'compression';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { Transaction } from 'objection';
import * as pg from 'pg';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import expressConfig from './express';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

const app = express();

if (config.NODE_ENV === 'production') {
  // compress all responses
  app.use(compression());
}

// Adjust how postgres deserializes date columns from postgres so that date strings are returned instead of timestamps
const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID, val => {
  return val;
});

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
