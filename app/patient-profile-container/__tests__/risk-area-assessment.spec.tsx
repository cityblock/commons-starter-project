import { shallow } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import RiskAreaAssessment, { RiskAreaAssessment as Component } from '../risk-area-assessment';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders a risk area assessment', async () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <RiskAreaAssessment
          riskAreaId={'risk-area-1'}
          patientId={'patient-1'}
          routeBase={`/patients/patient-1/360`} />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders questions with correct visibility', () => {
  const component = shallow(
    <Component
      riskAreaId={'risk-area-id'}
      riskAreaQuestions={[{
        id: 'question-1',
        createdAt: '2017-08-16T19:27:36.378Z',
        deletedAt: null,
        validatedSource: null,
        applicableIfType: null,
        title: 'Question 1',
        answerType: 'radio' as any,
        riskAreaId: 'risk-area-id',
        order: 1,
        answers: [{
          id: 'answer-1',
          displayValue: 'answer-1',
          value: 'answer-1',
          valueType: 'text' as any,
          questionId: 'question-1',
          order: 1,
          riskAdjustmentType: 'inactive',
          inSummary: false,
          summaryText: 'None',
        }],
        applicableIfQuestionConditions: null,
      }, {
        id: 'question-2',
        createdAt: '2017-08-16T19:27:36.378Z',
        deletedAt: null,
        validatedSource: null,
        title: 'Question 2',
        answerType: 'radio' as any,
        riskAreaId: 'risk-area-id',
        order: 2,
        applicableIfType: 'allTrue' as any,
        answers: [{
          id: 'question-2-answer-1',
          displayValue: 'answer-1',
          value: 'answer-1',
          valueType: 'text' as any,
          questionId: 'question-2',
          order: 1,
          riskAdjustmentType: 'increment',
          inSummary: false,
          summaryText: 'None',
        }],
        applicableIfQuestionConditions: [{
          id: 'condition-1',
          questionId: 'question-1',
          answerId: 'answer-1',
        }],
      }]}
      patientId={'patient-id'}
      routeBase={'/patients/patient-id/360'} />);
  const instance = component.instance() as Component;
  instance.setState({
    questions: {
      'question-1': { answers: [], oldAnswers: [], changed: false },
      'question-2': { answers: [], oldAnswers: [], changed: false },
    },
  });
  expect(instance.renderRiskAreaQuestions()).toMatchSnapshot();
});
