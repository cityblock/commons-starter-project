import { render } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import configureMockStore from 'redux-mock-store';
import ReduxConnectedIntlProvider from '../redux-connected-intl-provider';
import Routes from '../routes';

it('renders routes correctly', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale =  { messages: {'login.logInGoogle': 'Sign in with Google'} };

  const tree = render(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          {Routes}
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
