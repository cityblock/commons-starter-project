import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, eventNotifications })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <Header currentUser={currentUser} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
