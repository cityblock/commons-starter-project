import { render } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import Settings from '../settings';

it('renders settings form correctly', () => {
  const mockStore = configureMockStore([]);
  const locale = { messages: ENGLISH_TRANSLATION.messages  };
  const tree = render(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <Settings />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
