import * as stackDriver from '@google-cloud/error-reporting';
import { Engine } from 'apollo-engine';
import * as basicAuth from 'basic-auth';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as webpack from 'webpack';
import renderApp from './app';
import config from './config';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';
import { checkPostgresHandler } from './handlers/pingdom/check-postgres-handler';
import { pubsubPushHandler } from './handlers/pubsub/push-handler';
import { pubsubValidator } from './handlers/pubsub/validator';

export const checkAuth = (username: string, password: string) => (
  req: any,
  res: any,
  next: express.NextFunction,
) => {
  const user = basicAuth(req);

  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  next();
};

export default async (app: express.Application, logger: Console) => {
  /* istanbul ignore next */
  if (config.NODE_ENV === 'development') {
    // enable webpack dev middleware
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack/webpack.config');
    const devConfig = webpackConfig()[0];
    const compiler = webpack(devConfig);
    app.use(
      webpackDevMiddleware(compiler, { noInfo: true, publicPath: devConfig.output.publicPath }),
    );
  }

  // Setup apollo engine
  const engine = new Engine({
    graphqlPort: Number(process.env.PORT) || 3000,
    endpoint: '/graphql',
    engineConfig: {
      apiKey: config.ENGINE_API_KEY,
      stores: [
        {
          name: 'pq',
          inMemory: {
            cacheSize: 5000000,
          },
        },
      ],
      persistedQueries: {
        store: 'pq',
      },
    },
  });

  engine.start();
  app.use(engine.expressMiddleware());

  // This adds request logging using some decent defaults.
  /* istanbul ignore next */
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (config.NODE_ENV === 'production') {
    /* istanbul ignore next */
    app.use(morgan('combined'));
  }

  app.set('port', config.PORT);

  // X-Powered-By header has no functional value.
  app.disable('x-powered-by');

  if (config.NODE_ENV === 'development') {
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view cache', false);
  }

  app.use('/assets', express.static(path.join(__dirname, '..', '..', 'public')));
  // Note: eventually we should add an asset hash, and cache our assets but currently causes problems
  // ie: add { maxAge: '24h', },

  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(async (request: express.Request | undefined) => ({
      schema: schema as any,
      context: await getGraphQLContext(request!, logger),
      debug: false,
      // for apollo-engine
      tracing: true,
      cacheControl: true,
    })),
  );

  // Pingdom check endpoints
  app.get(
    '/ping/postgres',
    checkAuth('pingdom', process.env.PINGDOM_CHECK_PASSWORD || 'fake'),
    checkPostgresHandler,
  );

  // Google PubSub
  app.post('/pubsub/push', bodyParser.json(), pubsubValidator, pubsubPushHandler);

  app.get('*', renderApp);

  /* istanbul ignore next */
  if (config.NODE_ENV !== 'test') {
    /* tslint:disable no-console */
    console.log('--------------------------');
    console.log(`  Starting server on port: ${app.get('port')}`);
    console.log(`  Environment: ${config.NODE_ENV}`);
    console.log('--------------------------');
    /* tslint:enable no-console */
  }

  /* istanbul ignore next */
  if (config.GCLOUD_PROJECT && config.GCLOUD_API_KEY) {
    const errors = stackDriver({
      projectId: config.GCLOUD_PROJECT,
      key: config.GCLOUD_API_KEY,
    });
    process.on('uncaughtException', e => {
      // Write the error to stderr.
      console.error(e);
      // Report that same error the Stackdriver Error Service
      errors.report(e);
    });

    // Note that express error handling middleware should be attached after all
    // the other routes and use() calls.
    app.use(errors.express);
  }
};
