import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import MainContainer from '../main-container';

it('renders main container correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore()}>
      <MainContainer />
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
