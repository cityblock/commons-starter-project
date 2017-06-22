import { render } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import configureMockStore from 'redux-mock-store';
import Routes from '../routes';

it('renders routes correctly', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();

  const tree = render(
    <MockedProvider mocks={[]} store={mockStore()}>
      <ConnectedRouter history={history}>
        {Routes}
      </ConnectedRouter>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
