import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import AdminQuestions from '../admin-questions';

const riskArea = {
  id: 'cool-task-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'title',
  order: 1,
};

it('renders admin questions', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, riskArea })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <AdminQuestions
            routeBase='/route/base'
            riskAreaId='risk-area-id'
            questionId='cool-question-id'
            riskAreas={[riskArea]} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
