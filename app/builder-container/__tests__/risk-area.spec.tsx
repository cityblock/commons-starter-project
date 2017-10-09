import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { riskArea } from '../../shared/util/test-data';
import RiskArea from '../risk-area';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders risk area', () => {
  const history = createMemoryHistory();
  const match = {
    params: {
      riskAreaId: riskArea.id,
    },
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, riskArea })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskArea routeBase={'/route/base'} match={match} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
