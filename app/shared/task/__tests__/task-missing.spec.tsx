import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { TaskMissing } from '../task-missing';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

describe('task missing', () => {
  it('renders various task missing states', () => {
    const reloadTask = () => false;
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <div>
                <TaskMissing taskError={null} taskLoading={true} reloadTask={reloadTask} />
                <TaskMissing taskLoading={false} taskError={'error'} reloadTask={reloadTask} />
                <TaskMissing taskLoading={false} taskError={null} reloadTask={reloadTask} />
              </div>
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
