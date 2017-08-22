import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import TaskTemplateCreateEdit from '../task-template-create-edit';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders task template create-edit', () => {
  const history = createMemoryHistory();
  const taskTemplate = {
    id: 'task-template-id',
    title: 'task template value',
    goalSuggestionTemplateId: 'goal-id',
    priority: 'medium' as any,
    repeating: true,
    completedWithinNumber: 1,
    completedWithinInterval: 'week' as any,
    careTeamAssigneeRole: 'healthCoach' as any,
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskTemplateCreateEdit
            goalSuggestionTemplateId='goal-id'
            taskTemplate={taskTemplate} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
