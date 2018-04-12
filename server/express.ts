import { ErrorReporting } from '@google-cloud/error-reporting';
import * as basicAuth from 'basic-auth';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import GraphQLDog from 'graphql-dog';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import * as kue from 'kue';
import * as morgan from 'morgan';
import { Transaction } from 'objection';
import * as path from 'path';
import 'regenerator-runtime/runtime';
import * as webpack from 'webpack';
import renderApp from './app';
import config from './config';
import schema from './graphql/make-executable-schema';
import { formatError, formatResponse, getGraphQLContext } from './graphql/shared/utils';
import { renderCBOReferralFormPdf, renderPrintableMapPdf } from './handlers/pdf/render-pdf';
import { checkPostgresHandler } from './handlers/pingdom/check-postgres-handler';
import { pubsubPushHandler } from './handlers/pubsub/push-handler';
import { pubsubValidator } from './handlers/pubsub/validator';
import { twilioSmsHandler } from './handlers/twilio/sms-message-handler';
import { createRedisClient } from './lib/redis';

kue.createQueue({ redis: createRedisClient() });

export const checkAuth = (username: string, password: string) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const user = basicAuth(req);

  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  next();
};

export const allowCrossDomainMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, auth_token');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else next();
};

export const addHeadersMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://accounts.google.com blob:; script-src 'self' *.google.com unpkg.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' blob:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' *.googleusercontent.com https://storage.googleapis.com data: blob:; connect-src 'self' https://storage.googleapis.com",
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
};

export default async (
  app: express.Application,
  logger: Console,
  txn?: Transaction,
  allowCrossDomainRequests?: boolean,
) => {
  let errorReporting: ErrorReporting | undefined;
  if (config.NODE_ENV === 'production' && config.GCP_CREDS) {
    errorReporting = new ErrorReporting({ credentials: JSON.parse(String(config.GCP_CREDS)) });
    process.on('uncaughtException', e => {
      // Write the error to stderr.
      console.error(e);
      // Report that same error the Stackdriver Error Service
      if (errorReporting) {
        errorReporting.report(e);
      }
    });

    // Ensure stackdriver is working
    errorReporting.report('Server Restarting');
  }

  if (config.NODE_ENV === 'development') {
    // enable webpack dev middleware
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack/webpack.config');
    const devConfig = webpackConfig()[0];
    const compiler = webpack(devConfig);
    app.use(
      webpackDevMiddleware(compiler, { noInfo: true, publicPath: devConfig.output.publicPath }),
    );
    app.use(require('webpack-hot-middleware')(compiler));
  }

  // This adds request logging using some decent defaults.

  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (config.NODE_ENV === 'production') {
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

  // should be near in this list to when we add the graphql middleware
  if (process.env.DATADOG_API_KEY) {
    GraphQLDog.instrumentSchema(schema);
    app.use(GraphQLDog.middleware());
  }

  if (config.NODE_ENV === 'development') {
    app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  }

  // Used for integration tests
  if (allowCrossDomainRequests && config.NODE_ENV === 'test') {
    app.use(allowCrossDomainMiddleware);
  }

  app.use(
    '/graphql',
    addHeadersMiddleware,
    bodyParser.json(),
    graphqlExpress(
      async (request: express.Request | undefined, response: express.Response | undefined) => ({
        schema: schema as any,
        context: await getGraphQLContext(
          request!,
          response!,
          logger,
          txn || undefined,
          process.env.DATADOG_API_KEY ? GraphQLDog : null,
          errorReporting,
        ),
        formatResponse,
        formatError,
        debug: false,
        // for apollo-engine
        tracing: true,
        cacheControl: true,
      }),
    ),
  );

  // Pingdom check endpoints
  app.get(
    '/ping/postgres',
    checkAuth('pingdom', process.env.PINGDOM_CHECK_PASSWORD || 'fake'),
    checkPostgresHandler,
  );

  // Google PubSub
  app.post('/pubsub/push', bodyParser.json(), pubsubValidator, pubsubPushHandler);

  // Kue UI
  app.use('/kue', checkAuth('jobManager', process.env.KUE_UI_PASSWORD || 'fake'), kue.app);

  // PDF Generation
  app.get('/pdf/:taskId/referral-form.pdf', renderCBOReferralFormPdf);
  app.get('/pdf/:patientId/printable-map.pdf', renderPrintableMapPdf);

  // Twilio SMS Messages and Calls
  app.post('/twilio-sms-message', bodyParser(), twilioSmsHandler);

  app.get('*', addHeadersMiddleware, renderApp);

  if (config.NODE_ENV !== 'test') {
    /* tslint:disable no-console */
    console.log('--------------------------');
    console.log(`  Starting server on port: ${app.get('port')}`);
    console.log(`  Environment: ${config.NODE_ENV}`);
    console.log('--------------------------');
    /* tslint:enable no-console */
  }

  if (errorReporting) {
    // Note that express error handling middleware should be attached after all
    // the other routes and use() calls.
    app.use(errorReporting.express);
  }
};
