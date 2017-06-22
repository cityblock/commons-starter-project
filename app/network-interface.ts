import { createBatchingNetworkInterface } from 'react-apollo';
import { API_URL } from './config';

export default () => {
  const networkInterface = createBatchingNetworkInterface({
    uri: process.env.NODE_ENV === 'test' ? `https://localhost:3000${API_URL}` : API_URL,
    batchInterval: 10,
  });

  networkInterface.use([
    {
      async applyBatchMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}; // Create the header object if needed.
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
  return networkInterface;
};
