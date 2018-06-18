import { shallow } from 'enzyme';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
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

  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const task = { taskId: 'foo' };
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, task })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <BuilderGoals history={{} as any} match={match} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders goal create', () => {
  const history = { push: jest.fn } as any;
  const component = shallow(
    <Component
      match={match}
      refetchGoals={jest.fn()}
      routeBase={'/builder/goals'}
      goalId={null}
      loading={false}
      error={null}
      history={history}
    />,
  );
  const instance = component.instance() as Component;
  instance.showCreateGoal();
  expect(instance.render()).toMatchSnapshot();
});
