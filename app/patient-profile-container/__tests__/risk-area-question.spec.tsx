import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import RiskAreaQuestion from '../risk-area-question';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders a risk area question', () => {
  const history = createMemoryHistory();
  const question = {
    id: '123',
    createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
    deletedAt: null,
    title: 'Question',
    answerType: 'multiselect' as any,
    riskAreaId: '321',
    order: 1,
    validatedSource: 'Duke Population Health',
    answers: [{
      id: '456',
      displayValue: 'Answer',
      value: 'answer',
      valueType: 'string' as any,
      questionId: '123',
      order: 1,
      riskAdjustmentType: null,
      inSummary: false,
      summaryText: null,
    }],
    applicableIfType: null,
    applicableIfQuestionConditions: null,
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskAreaQuestion
            visible={true}
            answerData={{ answers: [], oldAnswers: [], changed: false }}
            onChange={() => true}
            question={question}
            editable={true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
