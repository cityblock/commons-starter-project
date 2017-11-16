import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { currentUser } from '../../shared/util/test-data';
import CareTeamWidgetMember from '../care-team-widget-member';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders care team widget', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <CareTeamWidgetMember
            careTeamMember={currentUser}
            selected={false}
            onClick={() => false}
          />
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
