import { render } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import configureMockStore from 'redux-mock-store';
import LoginContainer from '../login-container';

it('renders login form correctly', () => {
  document.body.innerHTML =
    '<div id="app"></div>';

  const mockStore = configureMockStore([]);

  const tree = render(
    <MockedProvider mocks={[]} store={mockStore()}>
      <LoginContainer />
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
