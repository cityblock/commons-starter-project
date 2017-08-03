import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import Question from '../question';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders question', () => {
  const question = {
    id: 'cool-question-id',
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
    title: 'title',
    order: 1,
    validatedSource: 'validated source',
    answerType: 'radio' as any,
    riskAreaId: 'risk-area-id',
    answers: [{
      id: 'answer-id',
      displayValue: 'answer value',
      value: 'true',
      valueType: 'boolean' as any,
      riskAdjustmentType: 'increment' as any,
      inSummary: true,
      summaryText: 'summary text',
      questionId: 'cool-task-id',
      order: 1,
    }],
    applicableIfQuestionConditions: [{
      id: 'question-condition',
      questionId: 'cool-question-id',
      answerId: 'answer-id',
    }],
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, question })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Question
            routeBase='/route/base'
            question={question}
            questionId={question.id}
            questionLoading={false}
            questionError={null} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('question error', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Question
            routeBase='/route/base'
            questionLoading={false}
            questionError={'an error'} />
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
          <Question
            routeBase='/route/base'
            questionLoading={false}
            questionError={'an error'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
