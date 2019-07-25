import { ApolloServer } from 'apollo-server-express';
import { Transaction } from 'objection';
import schema from '../graphql/make-executable-schema';
import { getOrCreateTransaction } from '../graphql/shared/utils';

/**
 *  An unorthodx setup for Apollo Server Express
 *
 * This allows us to catch and report errors
 */
export const graphqlMiddleware = async (existingTxn?: Transaction) => {
  return new ApolloServer({
    schema,
    context: { getOrCreateTransaction },
    debug: false,
    tracing: true,
    cacheControl: true,
  });
};
