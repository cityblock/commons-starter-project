import { shallow } from 'enzyme';
import * as React from 'react';
import { LoginContainer as Component } from '../login-container';

it('renders login form correctly', () => {
  const history = { push: jest.fn() } as any;
  const location = { state: { from: '/tasks' } };
  const tree = shallow(
    <Component
      history={history}
      logIn={(() => false) as any}
      currentUser={null as any}
      refetchCurrentUser={jest.fn()}
      setCurrentUser={jest.fn()}
      isAuthenticated={false}
      loading={false}
      location={location}
      error={null}
    />,
  );
  expect(tree.find('.background').length).toEqual(1);
});
