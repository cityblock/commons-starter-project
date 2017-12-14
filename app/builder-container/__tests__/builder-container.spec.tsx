import gql from 'graphql-tag';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import BuilderContainer from '../builder-container';

const query = gql(`
 query getRiskAreaGroups {
   riskAreaGroups {
      ...FullRiskAreaGroup
      __typename
    }
  }

  fragment FullRiskAreaGroup on RiskAreaGroup {
    id
    createdAt
    updatedAt
    deletedAt
    title
    mediumRiskThreshold
    highRiskThreshold
    __typename
  }
`);

it('renders builder container', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const task = { taskId: 'foo' };
  const tree = create(
    <MockedProvider mocks={[
      {
        request: { query },
        result: { data: { riskAreaGroups: [] }},
      },
    ]}>
      <Provider store={mockStore({ locale, task })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <Route component={BuilderContainer} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
