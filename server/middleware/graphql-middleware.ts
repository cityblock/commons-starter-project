import { ErrorReporting } from '@google-cloud/error-reporting';
import * as express from 'express';
import { graphqlExpress } from 'graphql-server-express';
import { Transaction } from 'objection';
import { IGraphQLResponseError } from 'schema';
import config from '../config';
import schema from '../graphql/make-executable-schema';
import { getGraphQLContext } from '../graphql/shared/utils';
import Logging from '../logging';

export function formatError(error: IGraphQLResponseError): IGraphQLResponseError {
  const errorReporting = new ErrorReporting({
    credentials: JSON.parse(String(config.GCP_CREDS)),
  });
  if (error.path || error.name !== 'GraphQLError') {
    errorReporting.report(error.message);
  } else {
    errorReporting.report(`GraphQLWrongQuery: ${error.message}`);
  }
  return {
    ...error.extensions,
    message: error.message || 'An unknown error occurred.',
    locations: error.locations && config.NODE_ENV === 'development' ? error.locations : [],
    stack: error.stack && config.NODE_ENV === 'development' ? error.stack.split('\n') : [],
    path: error.path,
  };
}
/**
 *  An unorthodx setup for Apollo Server Express
 *
 * This allows us to catch and report errors
 */
export const graphqlMiddleware = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
  logger: Logging,
  errorReporting: ErrorReporting,
  existingTxn?: Transaction,
) => {
  try {
    const context = await getGraphQLContext((request.headers.auth_token as string) || '', logger, {
      request,
      response,
      errorReporting,
    });
    return graphqlExpress({
      schema: schema as any,
      context,
      formatError,
      debug: false,
    })(request, response, next);
  } catch (e) {
    errorReporting.report(e);
    return response.sendStatus(422);
  }
};