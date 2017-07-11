import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import AuthenticationContainer from '../authentication-container';

it('renders authentication container correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore()}>
      <AuthenticationContainer />
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
