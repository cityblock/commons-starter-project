import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import RiskAreaQuestions from '../risk-area-questions';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const questions = [{
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
}, {
  id: '987',
  createdAt: 'Wed Aug 02 2017 18:31:45 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'Question',
  answerType: 'multiselect' as any,
  riskAreaId: '321',
  order: 1,
  validatedSource: 'Duke Population Health',
  answers: [{
    id: '567',
    displayValue: 'Answer',
    value: 'answer',
    valueType: 'string' as any,
    questionId: '987',
    order: 1,
    riskAdjustmentType: null,
    inSummary: false,
    summaryText: null,
  }],
  applicableIfType: null,
  applicableIfQuestionConditions: null,
}];

it('renders risk area questions in non-editing mode', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskAreaQuestions
            riskAreaQuestions={questions}
            patientId={'123'}
            editing={false}
            riskAreaId={'321'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders risk area questions in editing mode', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskAreaQuestions
            riskAreaQuestions={questions}
            patientId={'123'}
            editing={true}
            riskAreaId={'321'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
