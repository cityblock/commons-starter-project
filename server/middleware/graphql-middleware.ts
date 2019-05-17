import { ApolloServer } from 'apollo-server-express';
import { Transaction } from 'objection';
import schema from '../graphql/make-executable-schema';

/**
 *  An unorthodx setup for Apollo Server Express
 *
 * This allows us to catch and report errors
 */
export const graphqlMiddleware = async (existingTxn?: Transaction) => {
  return new ApolloServer({
    schema,
    debug: false,
    tracing: true,
    cacheControl: true,
  });
};
