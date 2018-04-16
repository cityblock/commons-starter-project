import * as dotenv from 'dotenv';
dotenv.config();
import * as compression from 'compression';
import * as express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { Transaction } from 'objection';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import expressConfig from './express';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';

let logger = console;

if (process.env.NODE_ENV === 'production') {
  /* tslint:disable no-var-requires */
  const CaptureOutput = require('./lib/capture-output').default;
  /* tslint:enable no-var-requires */

  const captureOutput = new CaptureOutput('web');
  captureOutput.capture();
  logger = captureOutput;
}

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
    console.error(err);
  }
}
