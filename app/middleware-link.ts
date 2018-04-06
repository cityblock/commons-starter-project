import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { ErrorLink } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { throttle } from 'lodash';

async function setLastAction() {
  await localStorage.setItem('lastAction', new Date().valueOf().toString());
}

export const debouncedSetLastAction = throttle(setLastAction, 500, {
  leading: true,
  trailing: true,
});

export const getMiddlewareLink = () => {
  const httpLink = new HttpLink({ uri: '/graphql' });

  let middlewareLink = setContext(() => ({
    headers: {
      auth_token: localStorage.getItem('authToken'),
    },
  }));

  const loggingMiddleware = new ApolloLink(
    (operation, forward) =>
      forward
        ? forward(operation).map(data => {
            /* tslint:disable no-console */
            console.log(operation, data);
            /* tslint:enable no-console */

            return data;
          })
        : null,
  );

  // update last action for our idle timeout
  const lastActionMiddleware = new ApolloLink((operation, forward) => {
    debouncedSetLastAction();
    return forward ? forward(operation) : null;
  });

  const errorHandler = new ErrorLink(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        /* tslint:disable no-console */
        console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`);
        /* tslint:enable no-console */
      });
    }
    if (networkError) {
      /* tslint:disable no-console */
      console.error(`[Network error]: ${networkError}`);
      /* tslint:enable no-console */
    }
  });

  if (process.env.NODE_ENV === 'development') {
    middlewareLink = middlewareLink.concat(loggingMiddleware);
    middlewareLink = middlewareLink.concat(errorHandler);
  }
  middlewareLink = middlewareLink.concat(lastActionMiddleware);
  return middlewareLink.concat(httpLink);
};
