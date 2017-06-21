import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import LoginContainer from '../login-container';

// Struggling to get this to render correctly
xit('renders login form correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore()}>
      <LoginContainer />
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
