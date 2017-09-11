import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { currentUser } from '../../shared/util/test-data';
import Header from '../header';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const eventNotifications = { count: 0 };
const mockStore = configureMockStore([]);

it('renders header', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, eventNotifications })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Header
            currentUser={currentUser}
            notificationsCount={0}
            updateNotificationsCount={(count: any) => true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
