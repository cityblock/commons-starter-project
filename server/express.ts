import * as basicAuth from 'basic-auth';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import * as morgan from 'morgan';
import OpticsAgent from 'optics-agent';
import * as path from 'path';
import renderApp from './app';
import config from './config';
import schema from './graphql/make-executable-schema';
import { getGraphQLContext } from './graphql/shared/utils';
import { checkAthenaApiHandler } from './handlers/pingdom/check-athena-api-handler';
import { checkPostgresHandler } from './handlers/pingdom/check-postgres-handler';
import { checkRabbitHandler } from './handlers/pingdom/check-rabbit-handler';

export const checkAuth = (
  username: string, password: string,
) => (req: any, res: any, next: express.NextFunction) => {
  const user = basicAuth(req);

  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }

  next();
};

export default async (app: express.Application) => {
  // This adds request logging using some decent defaults.
  /* istanbul ignore if  */
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else if (config.NODE_ENV === 'production') {
    /* istanbul ignore next  */
    app.use(morgan('combined'));
  }

  app.set('port', config.PORT);

  // X-Powered-By header has no functional value.
  app.disable('x-powered-by');

  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view cache', false);

  app.use('/assets', express.static(path.join(__dirname, '..', 'public'), {
    maxAge: '24h',
  }));

  /* istanbul ignore if  */
  if (config.NODE_ENV === 'production') {
    OpticsAgent.instrumentSchema(schema);
    app.use(OpticsAgent.middleware());
  }

  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  app.use('/graphql', bodyParser.json(), graphqlExpress(async (request: express.Request) => ({
    schema: (schema as any),
    context: await getGraphQLContext(request),
    debug: false,
  })));

  // Pingdom check endpoints
  app.get(
    '/ping/athena-api',
    checkAuth('pingdom', process.env.PINGDOM_CHECK_PASSWORD || 'fake'),
    checkAthenaApiHandler,
  );
  app.get(
    '/ping/postgres',
    checkAuth('pingdom', process.env.PINGDOM_CHECK_PASSWORD || 'fake'),
    checkPostgresHandler,
  );
  app.get(
    '/ping/rabbit',
    checkAuth('pingdom', process.env.PINGDOM_CHECK_PASSWORD || 'fake'),
    checkRabbitHandler,
  );

  app.get('*', renderApp);

  /* istanbul ignore if  */
  if (config.NODE_ENV !== 'test') {
    /* tslint:disable no-console */
    console.log('--------------------------');
    console.log(`  Starting server on port: ${app.get('port')}`);
    console.log(`  Environment: ${config.NODE_ENV}`);
    console.log('--------------------------');
    /* tslint:enable no-console */
  }
};
