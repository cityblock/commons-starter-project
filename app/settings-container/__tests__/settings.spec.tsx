import { render } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import Settings from '../settings-container';

it('renders settings form correctly', () => {
  const mockStore = configureMockStore([]);
  const locale = { messages: ENGLISH_TRANSLATION.messages  };
  const updateUser = (options: any) => (true);

  const tree = render(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <Settings updateUser={updateUser} loading={false} />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  );
  expect(tree).toMatchSnapshot();
});
