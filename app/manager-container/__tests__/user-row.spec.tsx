import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { currentUser, featureFlags, user } from '../../shared/util/test-data';
import { UserRow } from '../user-row';

const oldDate = Date.now;

describe('user row', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders manager users with users', () => {
    const mockStore = configureMockStore([]);

    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const deleteUser = () => false;
    const editUserRole = (userRole: string, userEmail: string) => false;
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <UserRow
                currentUser={currentUser}
                featureFlags={featureFlags}
                user={user}
                deleteUser={deleteUser}
                editUserRole={editUserRole}
              />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
