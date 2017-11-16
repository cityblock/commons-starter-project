import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';

import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import MainContainer from '../main-container';

it('renders main container correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore()}>
        <MainContainer />
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
