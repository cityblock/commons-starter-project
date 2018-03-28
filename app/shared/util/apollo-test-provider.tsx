import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { print } from 'graphql';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as schema from '../../../server/graphql/schema.graphql';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import createStore from '../../store';

const history = createHistory();
const store = createStore(history);

interface IProps {
  graphqlMocks: any;
}

// Helper in our codebase to create the apollo client
// from http://blog.dideric.is/2018/03/18/Testing-apollo-containers/
export default class ApolloTestProvider extends React.Component<IProps> {
  static createSchema = () => makeExecutableSchema({ typeDefs: print(schema) });

  apolloClient: any;
  schema: any;

  constructor(props: IProps) {
    super(props);
    // Every instance should have it's own schema instance so tests
    // don't bleed into one another
    this.schema = ApolloTestProvider.createSchema();
    this.apolloClient = new ApolloClient<any>({
      link: new SchemaLink({ schema: this.schema }),
      cache: new InMemoryCache().restore({}) as any,
    });
    this.addDefaultMocks();
  }

  componentWillMount() {
    const { graphqlMocks } = this.props;
    this.mockGraphql(graphqlMocks);
  }

  componentWillReceiveProps({ graphqlMocks }: any) {
    this.mockGraphql(graphqlMocks);
  }

  addDefaultMocks() {
    addMockFunctionsToSchema({
      schema: this.schema,
    });
  }

  mockGraphql(mocks = {}) {
    addMockFunctionsToSchema({
      schema: this.schema,
      mocks,
    });
  }

  render() {
    const { children } = this.props;
    return (
      <Provider store={store}>
        <ApolloProvider client={this.apolloClient}>
          <ReduxConnectedIntlProvider defaultLocale="en">
            <MemoryRouter>{children}</MemoryRouter>
          </ReduxConnectedIntlProvider>
        </ApolloProvider>
      </Provider>
    );
  }
}
