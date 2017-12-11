import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { concern } from '../../shared/util/test-data';
import BuilderConcerns from '../builder-concerns';

const oldDate = Date.now;
const match = {
  params: {
    goalId: null,
  },
};

describe('builder concerns', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders builder concerns', () => {
    const mockStore = configureMockStore([]);
    const history = createMemoryHistory();
    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, concern })}>
          <ReduxConnectedIntlProvider>
            <ConnectedRouter history={history}>
              <BuilderConcerns
                match={match}
                routeBase="/route/base"
                concernId={concern.id}
                concerns={[concern]}
              />
            </ConnectedRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
