import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { goal } from '../../shared/util/test-data';
import BuilderGoals, { BuilderGoals as Component } from '../builder-goals';

const oldDate = Date.now;
beforeAll(() => {
  Date.now = jest.fn(() => 1500494779252);
});
afterAll(() => {
  Date.now = oldDate;
});

const match = {
  params: {
    goalId: null,
  },
};

it('renders builder goals', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const task = { taskId: 'foo' };
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, task })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <BuilderGoals
              match={match}
              refetchGoals={() => false}
              routeBase="/route/base"
              goals={[goal]}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders goal create', () => {
  const component = shallow(
    <Component
      match={match}
      refetchGoals={jest.fn()}
      routeBase={'/builder/goals'}
      goalId={null}
      loading={false}
      error={null}
    />,
  );
  const instance = component.instance() as Component;
  instance.showCreateGoal();
  expect(instance.render()).toMatchSnapshot();
});
