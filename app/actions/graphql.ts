import ApolloClient, { createBatchingNetworkInterface, ApolloQueryResult } from 'apollo-client';
import { API_URL } from '../config';
import * as types from '../graphql/types';

/* tslint:disable no-var-requires */
const graphQLDocs = require('../documents.json');
/* tslint:enable no-var-requires */

// This creates middleware for the Apollo client which adds an auth token.
const networkInterface = createBatchingNetworkInterface({
  uri: process.env.NODE_ENV === 'test' ? `https://localhost:3000${API_URL}` : API_URL,
  batchInterval: 10,
});
networkInterface.use([
  {
    async applyBatchMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      // This returns null if authToken is not in store.
      const authToken = await localStorage.getItem('authToken');
      if (authToken) {
        req.options.headers.auth_token = authToken;
      }
      next();
    },
  },
]);
const client = new ApolloClient({ networkInterface });

export type User = types.FullUserFragment;

export async function executeQuery<Input, Output>(
  fileName: string,
  variables: Input,
): Promise<ApolloQueryResult<Output>> {
  const doc = graphQLDocs[fileName];
  if (!doc) {
    throw new Error(`Unable to find GraphQL file: ${fileName}`);
  }

  return client.query<Output>({
    query: doc,
    variables,
  });
}

export function getQuery(fileName: string) {
  return graphQLDocs[fileName];
}

export async function executeMutation<Input, Output>(
  fileName: string,
  variables: Input,
): Promise<ApolloQueryResult<Output>> {
  const doc = graphQLDocs[fileName];
  if (!doc) {
    throw new Error(`Unable to find GraphQL file: ${fileName}`);
  }

  return client.mutate<Output>({
    mutation: doc,
    variables,
  });
}

// Aliases for all the queries / mutations.
// These could plausibly be generated from the GraphQL files.
export async function logIn(input: types.LogInUserMutationVariables) {
  return executeMutation<types.LogInUserMutationVariables, types.LogInUserMutation>(
    'app/graphql/queries/log-in-user-mutation.graphql', input);
}

export async function fetchCurrentUser(input: {}) {
  return executeQuery<{}, types.GetCurrentUserQuery>(
    'app/graphql/queries/get-current-user.graphql', {});
}
