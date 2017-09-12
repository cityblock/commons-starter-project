import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { TaskMissing } from '../task-missing';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

describe('task missing', () => {
  it('renders various task missing states', () => {
    const history = createMemoryHistory();
    const reloadTask = () => false;
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <div>
              <TaskMissing taskLoading={true} reloadTask={reloadTask} />
              <TaskMissing taskLoading={false} taskError={'error'} reloadTask={reloadTask} />
              <TaskMissing taskLoading={false} taskError={undefined} reloadTask={reloadTask} />
            </div>
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
