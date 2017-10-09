import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { concern } from '../../shared/util/test-data';
import Concern from '../concern';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders concern', () => {
  const history = createMemoryHistory();
  const match = {
    params: {
      objectId: concern.id,
    },
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, concern })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Concern
            routeBase={'/route/base'}
            match={match}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
