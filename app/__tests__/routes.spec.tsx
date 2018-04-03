import { render } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import ReduxConnectedIntlProvider from '../redux-connected-intl-provider';
import Routes from '../routes';

// TODO: use shallow instead of snapshot
it('renders routes correctly', () => {
  const mockStore = configureMockStore([]);

  const locale = { messages: { 'login.logInGoogle': 'Sign in with Google' } };
  const popup = { name: '', options: {} };

  const tree = render(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, popup, idle: { isIdle: false } })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>{Routes}</BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
