import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { goal } from '../../shared/util/test-data';
import Goal from '../goal';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders goal', () => {
  const history = createMemoryHistory();
  const match = {
    params: {
      objectId: goal.id,
    },
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, goal })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Goal routeBase={'/route/base'} match={match} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
