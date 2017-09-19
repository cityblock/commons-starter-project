import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { goal } from '../../shared/util/test-data';
import BuilderGoals, { BuilderGoals as Component } from '../builder-goals';

it('renders builder goals', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const task = { taskId: 'foo' };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <BuilderGoals refetchGoals={() => false} routeBase='/route/base' goals={[goal]} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders goal create', () => {
  const component = shallow(
    <Component refetchGoals={() => false} routeBase='/route/base' goals={[goal]} />,
  );
  const instance = component.instance() as Component;
  instance.showCreateGoal();
  expect(instance.render()).toMatchSnapshot();
});
