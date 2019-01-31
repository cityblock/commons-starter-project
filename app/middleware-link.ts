import { createHttpLink } from 'apollo-link-http';

export const getMiddlewareLink = () => {
  return createHttpLink({ uri: '/graphql' });
};
