import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import MainContainer from '../main';

it('renders main container correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore()}>
      <MainContainer />
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
