import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import AuthenticationContainer from '../authentication-container';

const currentUser = {
  id: 'id',
  locale: 'en',
  firstName: 'first',
  lastName: 'last',
  userRole: 'physician' as any,
  email: 'a@b.com',
  homeClinicId: '1',
  googleProfileImageUrl: null,
};

it('renders authentication container correctly', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ idle: { isIdle: false } })}>
      <AuthenticationContainer loading={true}>
        <div />
      </AuthenticationContainer>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders authentication container correctly with current user', () => {
  const mockStore = configureMockStore([]);
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ idle: { isIdle: false } })}>
      <AuthenticationContainer loading={false} currentUser={currentUser}>
        <div />
      </AuthenticationContainer>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
