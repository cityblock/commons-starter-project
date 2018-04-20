import * as dotenv from 'dotenv';
dotenv.config();
import * as trace from '@google-cloud/trace-agent';
import config from './config';
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
import { SubscriptionServer } from 'subscriptions-transport-ws';
import expressConfig from './express';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';

const logger = console;

const app = express();

if (process.env.NODE_ENV === 'production') {
  // compress all responses
  app.use(compression());
}

export type Env = 'production' | 'development' | 'test';

export interface IMainOptions {
  env: Env;
  transaction?: Transaction;
  allowCrossDomainRequests?: boolean;
}

export async function main(options: IMainOptions) {
  await expressConfig(app, logger, options.transaction, options.allowCrossDomainRequests);

  const ws = createServer(app);

  return ws.listen(app.get('port'), () => {
    /* tslint:disable no-unused-expression */
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams: { authToken: string }) => {
          return getGraphQLContext(connectionParams.authToken, logger, {});
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
    main({ env: process.env.NODE_ENV as Env });
  } catch (err) {
    logger.error(err);
  }
}
