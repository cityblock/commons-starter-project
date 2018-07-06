import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

interface IProps {
  client: any;
}

export default class App extends React.Component<IProps> {
  render() {
    return (
      <React.StrictMode>
        <ApolloProvider client={this.props.client}>
          <BrowserRouter>{Routes}</BrowserRouter>
        </ApolloProvider>
      </React.StrictMode>
    );
  }
}
