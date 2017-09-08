import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import TaskTemplate from '../task-template';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const taskTemplate = {
  id: 'task-template-1',
  title: 'Task Title',
  priority: 'high' as any,
  completedWithinNumber: 1,
  completedWithinInterval: 'week' as any,
  repeating: false,
  goalSuggestionTemplateId: 'goal-suggestion-template-1',
  careTeamAssigneeRole: 'physician' as any,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
  deletedAt: null,
};

const oldDate = Date.now;

beforeAll(() => { Date.now = jest.fn(() => 1500494779252); });
afterAll(() => { Date.now = oldDate; });

it('renders a selected task template', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskTemplate
            taskTemplate={taskTemplate}
            selected={true}
            onToggleRemoved={(id: string) => true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders a removed task template', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskTemplate
            taskTemplate={taskTemplate}
            selected={false}
            onToggleRemoved={(id: string) => true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
