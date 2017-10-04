import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { user } from '../../shared/util/test-data';
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
    const history = createMemoryHistory();
    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const deleteUser = () => false;
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <UserRow user={user} deleteUser={deleteUser} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
