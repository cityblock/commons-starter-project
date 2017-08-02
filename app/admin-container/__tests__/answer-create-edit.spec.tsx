import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import AnswerCreateEdit from '../answer-create-edit';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders answer create-edit', () => {
  const history = createMemoryHistory();
  const answer = {
    id: 'answer-id',
    displayValue: 'answer value',
    value: 'true',
    valueType: 'boolean' as any,
    riskAdjustmentType: 'increment' as any,
    inSummary: true,
    summaryText: 'summary text',
    questionId: 'cool-task-id',
    order: 1,
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <AnswerCreateEdit
            questionId='question-id'
            answer={answer} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
