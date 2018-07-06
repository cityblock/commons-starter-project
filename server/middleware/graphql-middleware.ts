import express from 'express';
import { graphqlExpress } from 'graphql-server-express';
import { Transaction } from 'objection';
import schema from '../graphql/make-executable-schema';

/**
 *  An unorthodx setup for Apollo Server Express
 *
 * This allows us to catch and report errors
 */
export const graphqlMiddleware = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
  existingTxn?: Transaction,
) => {
  try {
    const context = {};
    return graphqlExpress({
      schema: schema as any,
      context,
      debug: false,
      tracing: true,
      cacheControl: true,
    })(request, response, next);
  } catch (e) {
    console.error(e);

    return response.sendStatus(422);
  }
};
