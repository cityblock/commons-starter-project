import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { GoalRow } from '../goal-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

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
const goal = {
  id: 'goal-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Goal Title',
  taskTemplates: [taskTemplate],
};

describe('goal row', () => {
  beforeAll(() => { Date.now = jest.fn(() => 1500494779252); });
  afterAll(() => { Date.now = oldDate; });

  it('renders goal row', () => {
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale, goal })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <GoalRow
              goal={goal}
              selected={true}
              routeBase={'/foo/bar'} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
