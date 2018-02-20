import { shallow } from 'enzyme';
import * as React from 'react';
import { LoginContainer as Component } from '../login-container';

it('renders login form correctly', () => {
  const history = { push: jest.fn() } as any;
  const tree = shallow(
    <Component
      history={history}
      featureFlags={null as any}
      logIn={(() => false) as any}
      currentUser={null as any}
      loading={false}
      error={null}
    />,
  );
  expect(tree.find('.background').length).toEqual(1);
});
