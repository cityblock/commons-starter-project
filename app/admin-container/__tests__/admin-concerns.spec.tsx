import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import AdminConcerns from '../admin-concerns';

const oldDate = Date.now;
const concern = {
  id: 'concern-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'title',
};

describe('admin concerns', () => {
  beforeAll(() => { Date.now = jest.fn(() => 1500494779252); });
  afterAll(() => { Date.now = oldDate; });

  it('renders admin concerns', () => {
    const mockStore = configureMockStore([]);
    const history = createMemoryHistory();
    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale, concern })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <AdminConcerns
              routeBase='/route/base'
              concernId={concern.id}
              concerns={[concern]} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
