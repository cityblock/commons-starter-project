import { ErrorReporting } from '@google-cloud/error-reporting';
import * as basicAuth from 'basic-auth';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import * as Knex from 'knex';
import * as kue from 'kue';
import * as morgan from 'morgan';
import { Transaction } from 'objection';
import { Model } from 'objection';
import * as path from 'path';
import 'regenerator-runtime/runtime';
import * as webpack from 'webpack';
import renderApp from './app';
import config from './config';
import schema from './graphql/make-executable-schema';
import { formatError, formatResponse, getGraphQLContext, IContext } from './graphql/shared/utils';
import { renderCBOReferralFormPdf, renderPrintableMapPdf } from './handlers/pdf/render-pdf';
import { checkPostgresHandler } from './handlers/pingdom/check-postgres-handler';
import { checkRedisHandler } from './handlers/pingdom/check-redis-handler';
import { pubsubPushHandler } from './handlers/pubsub/push-handler';
import { pubsubValidator } from './handlers/pubsub/validator';
import {
  twilioCompleteCallHandler,
  twilioIncomingCallHandler,
  twilioOutgoingCallHandler,
} from './handlers/twilio/phone-call-handler';
import {
  twilioIncomingSmsHandler,
  twilioOutgoingSmsHandler,
} from './handlers/twilio/sms-message-handler';
import { contactsVcfHandler } from './handlers/vcf/vcard-handler';
import { createRedisClient } from './lib/redis';
import Logging from './logging';

/* tslint:disable no-var-requires */
const knexConfig = require('./models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

kue.createQueue({ redis: createRedisClient() });

const subscriptionsEndpoint = config.SUBSCRIPTIONS_ENDPOINT;
export const TWILIO_COMPLETE_ENDPOINT = '/twilio-complete-phone-call';

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
    `default-src 'self' https://accounts.google.com blob:; script-src 'self' *.google.com unpkg.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' blob:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' *.googleusercontent.com https://storage.googleapis.com data: blob:; connect-src 'self' https://storage.googleapis.com ${subscriptionsEndpoint}`,
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
};

export default async (
  app: express.Application,
  logger: Logging,
  errorReporting: ErrorReporting,
  txn?: Transaction,
  allowCrossDomainRequests?: boolean,
) => {
  process.on('uncaughtException', e => {
    const text = `Uncaught Exception ${e.message} ${e.stack}`;
    // Write the error to stderr.
    console.error(text);
    // Report that same error the Stackdriver Error Service
    errorReporting.report(text);
  });

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

  if (config.NODE_ENV === 'development') {
    app.get(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `wss://localhost:3000/subscriptions`,
      }),
    );
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
      async (request: express.Request | undefined, response: express.Response | undefined) => {
        let context: null | IContext = null;
        try {
          context = await getGraphQLContext((request!.headers.auth_token as string) || '', logger, {
            existingTxn: txn,
            request,
            response,
            errorReporting,
          });
        } catch (e) {
          errorReporting.report(e);
          console.error(e);
        }

        return {
          schema: schema as any,
          context,
          formatResponse,
          formatError,
          debug: false,
        };
      },
    ),
  );

  // Pingdom check endpoints
  app.get(
    '/ping/postgres',
    checkAuth('pingdom', config.PINGDOM_CHECK_PASSWORD),
    checkPostgresHandler,
  );
  app.get('/ping/redis', checkAuth('pingdom', config.PINGDOM_CHECK_PASSWORD), checkRedisHandler);

  // Google PubSub
  app.post('/pubsub/push', bodyParser.json(), pubsubValidator, pubsubPushHandler);

  // Kue UI
  app.use('/kue', checkAuth('jobManager', config.KUE_UI_PASSWORD), kue.app);

  // PDF Generation
  app.get('/pdf/:taskId/referral-form.pdf', renderCBOReferralFormPdf);
  app.get('/pdf/:patientId/printable-map.pdf', renderPrintableMapPdf);

  // Twilio SMS Messages and Calls
  app.post(
    '/twilio-incoming-sms-message',
    bodyParser.urlencoded({ extended: true }),
    twilioIncomingSmsHandler,
  );
  app.post(
    '/twilio-outgoing-sms-message',
    bodyParser.urlencoded({ extended: true }),
    twilioOutgoingSmsHandler,
  );
  app.post(
    '/twilio-incoming-phone-call',
    bodyParser.urlencoded({ extended: true }),
    twilioIncomingCallHandler,
  );
  app.post(
    '/twilio-outgoing-phone-call',
    bodyParser.urlencoded({ extended: true }),
    twilioOutgoingCallHandler,
  );
  app.post(
    TWILIO_COMPLETE_ENDPOINT,
    bodyParser.urlencoded({ extended: true }),
    twilioCompleteCallHandler,
  );

  // vCard Generation
  app.get('/vcf-contacts', contactsVcfHandler);

  app.get('*', addHeadersMiddleware, renderApp);

  if (config.NODE_ENV !== 'test') {
    logger.log('--------------------------');
    logger.log(`  Starting server on port: ${app.get('port')}`);
    logger.log(`  Environment: ${config.NODE_ENV}`);
    logger.log('--------------------------');
    /* tslint:enable no-console */
  }

  // Note that express error handling middleware should be attached after all other routes and use() calls.
  app.use(errorReporting.express);
};
