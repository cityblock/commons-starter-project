import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ReduxConnectedIntlProvider from './redux-connected-intl-provider';
import Routes from './routes';

interface IProps {
  client: any;
  store: any;
}

export default class App extends React.Component<IProps> {
  render() {
    return (
      <ApolloProvider client={this.props.client}>
        <Provider store={this.props.store}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>{Routes}</BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </ApolloProvider>
    );
  }
}
