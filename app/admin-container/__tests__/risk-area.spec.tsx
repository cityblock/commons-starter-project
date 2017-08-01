import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import RiskArea from '../risk-area';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders risk area', () => {
  const riskArea = {
    id: 'cool-task-id',
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
    title: 'title',
    order: 1,
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, riskArea })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskArea
            riskArea={riskArea}
            riskAreaId={riskArea.id}
            riskAreaLoading={false}
            riskAreaError={null} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('risk area error', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskArea
            riskArea={null}
            riskAreaId={null}
            riskAreaLoading={false}
            riskAreaError={'error'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('risk area loading', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskArea
            riskArea={null}
            riskAreaId={null}
            riskAreaLoading={false}
            riskAreaError={'error'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
