import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
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

            // update last action for our idle timeout
            debouncedSetLastAction();

            return data;
          })
        : null,
  );

  if (process.env.NODE_ENV === 'development') {
    middlewareLink = middlewareLink.concat(loggingMiddleware);
  }
  return middlewareLink.concat(httpLink);
};
