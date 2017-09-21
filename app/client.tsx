import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import createNetworkInterface from './network-interface';
import ReduxConnectedIntlProvider from './redux-connected-intl-provider';
import Routes from './routes';
import createStore from './store';

const history = createHistory();
const client = new ApolloClient({ networkInterface: createNetworkInterface() });
const store = createStore(client, history);

render(
  <ApolloProvider store={store} client={client}>
    <ReduxConnectedIntlProvider>
      <ConnectedRouter history={history}>
        {Routes}
      </ConnectedRouter>
    </ReduxConnectedIntlProvider>
  </ApolloProvider>, document.getElementById('app'));

if ((module as any).hot) {
  (module as any).hot.accept();
}
