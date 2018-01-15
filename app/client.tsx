import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { getMiddlewareLink } from './middleware-link';
import ReduxConnectedIntlProvider from './redux-connected-intl-provider';
import Routes from './routes';
import createStore from './store';

const client = new ApolloClient<any>({
  link: getMiddlewareLink(),
  cache: new InMemoryCache().restore({}) as any,
});

const history = createHistory();
const store = createStore(history);

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ReduxConnectedIntlProvider>
        <BrowserRouter>{Routes}</BrowserRouter>
      </ReduxConnectedIntlProvider>
    </Provider>
  </ApolloProvider>,
  document.getElementById('app'),
);
