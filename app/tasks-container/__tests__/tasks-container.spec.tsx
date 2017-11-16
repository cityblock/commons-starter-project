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
import TasksContainer from '../tasks-container';

it('renders tasks container', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const task = { taskId: 'foo' };
  const eventNotifications = { count: 0 };
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, task, eventNotifications })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <Route component={TasksContainer as any} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
