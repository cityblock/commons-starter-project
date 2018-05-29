import { ErrorReporting } from '@google-cloud/error-reporting';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { graphiqlExpress } from 'graphql-server-express';
import * as morgan from 'morgan';
import { Transaction } from 'objection';
import * as path from 'path';
import 'regenerator-runtime/runtime';
import * as webpack from 'webpack';
import renderApp from './app';
import config from './config';
import {
  renderCBOReferralFormPdf,
  renderPrintableCalendarPdf,
  renderPrintableMapPdf,
} from './handlers/pdf/render-pdf';
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
import Logging from './logging';
import { addSecurityHeadersMiddleware } from './middleware/add-security-headers-middleware';
import { allowCrossDomainMiddleware } from './middleware/allow-cross-domain-middleware';
import { checkAuthMiddleware } from './middleware/check-auth-middleware';
import { ensurePostMiddleware } from './middleware/ensure-post-middleware';
import { graphqlMiddleware } from './middleware/graphql-middleware';

export const TWILIO_COMPLETE_ENDPOINT = '/twilio-complete-phone-call';

export default async (
  app: express.Application,
  logger: Logging,
  errorReporting: ErrorReporting,
  existingTxn?: Transaction,
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
    // Enable webpack dev middleware
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
    // Development templates
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view cache', false);
  }

  // Static assets
  app.use('/assets', express.static(path.join(__dirname, '..', '..', 'public')));

  if (config.NODE_ENV === 'development') {
    // GraphiQL
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

  // Graphql API
  app.use(
    '/graphql',
    addSecurityHeadersMiddleware,
    ensurePostMiddleware,
    bodyParser.json(),
    async (req: express.Request, res: express.Response, next: express.NextFunction) =>
      graphqlMiddleware(req, res, next, logger, errorReporting, existingTxn),
  );

  // Pingdom check endpoints
  app.get(
    '/ping/postgres',
    checkAuthMiddleware('pingdom', config.PINGDOM_CHECK_PASSWORD),
    checkPostgresHandler,
  );
  app.get(
    '/ping/redis',
    checkAuthMiddleware('pingdom', config.PINGDOM_CHECK_PASSWORD),
    checkRedisHandler,
  );

  // Google PubSub
  app.post('/pubsub/push', bodyParser.json(), pubsubValidator, pubsubPushHandler);

  // PDF Generation
  app.get('/pdf/:taskId/referral-form.pdf', renderCBOReferralFormPdf);
  app.get('/pdf/:patientId/printable-map.pdf', renderPrintableMapPdf);
  app.get('/pdf/:patientId/:year/:month/printable-calendar.pdf', renderPrintableCalendarPdf);

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

  // Render a blank HTML page for the react app
  app.get('*', addSecurityHeadersMiddleware, renderApp);

  // Error handling middleware should be attached after all other routes and use() calls.
  app.use(errorReporting.express);

  if (config.NODE_ENV !== 'test') {
    logger.log('--------------------------');
    logger.log(`  Starting server on port: ${app.get('port')}`);
    logger.log(`  Environment: ${config.NODE_ENV}`);
    logger.log('--------------------------');
  }
};
