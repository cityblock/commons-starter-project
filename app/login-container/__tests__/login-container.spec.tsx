import { render } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import LoginContainer from '../login-container';

it('renders login form correctly', () => {
  document.body.innerHTML = '<div id="app"></div>';

  const mockStore = configureMockStore([]);
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const tree = render(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <LoginContainer />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
