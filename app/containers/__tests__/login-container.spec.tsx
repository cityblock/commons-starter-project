import { render } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import configureMockStore from 'redux-mock-store';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import LoginContainer from '../login-container';

it('renders login form correctly', () => {
  document.body.innerHTML =
    '<div id="app"></div>';

  const mockStore = configureMockStore([]);
  const locale =  { messages: {'login.logInGoogle': 'Sign in with Google'} };
  const tree = render(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <LoginContainer />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
