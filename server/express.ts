import express from 'express';
import morgan from 'morgan';
import { Transaction } from 'objection';
import path from 'path';
import 'regenerator-runtime/runtime';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack/webpack.config';
import renderApp from './app';
import config from './config';
import { addSecurityHeadersMiddleware } from './middleware/add-security-headers-middleware';
import { allowCrossDomainMiddleware } from './middleware/allow-cross-domain-middleware';
import { ensurePostMiddleware } from './middleware/ensure-post-middleware';
import { graphqlMiddleware } from './middleware/graphql-middleware';

export default async (
  app: express.Application,
  existingTxn?: Transaction,
  allowCrossDomainRequests?: boolean,
) => {
  process.on('uncaughtException', e => {
    const text = `Uncaught Exception ${e.message} ${e.stack}`;
    // Write the error to stderr.
    console.error(text);
  });

  if (config.NODE_ENV === 'development') {
    // Enable webpack dev middleware
    const devConfig = webpackConfig;
    const compiler = webpack(devConfig);
    app.use(webpackDevMiddleware(compiler, { publicPath: devConfig.output!.publicPath! }));
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

  // Used for integration tests
  if (allowCrossDomainRequests && config.NODE_ENV === 'test') {
    app.use(allowCrossDomainMiddleware);
  }

  const server = await graphqlMiddleware(existingTxn);

  // Graphql API
  app.use(server.graphqlPath, addSecurityHeadersMiddleware, ensurePostMiddleware);
  server.applyMiddleware({ app });

  // Render a blank HTML page for the react app
  app.get('*', addSecurityHeadersMiddleware, renderApp);

  /* tslint:disable no-console */
  if (config.NODE_ENV !== 'test') {
    console.log('--------------------------');
    console.log(`  Starting server on port: ${app.get('port')}`);
    console.log(`  Environment: ${config.NODE_ENV}`);
    console.log('--------------------------');
  }
  /* tslint:enable no-console */
};
