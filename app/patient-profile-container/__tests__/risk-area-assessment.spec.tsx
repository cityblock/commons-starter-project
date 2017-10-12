import { shallow } from 'enzyme';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { patientAnswer, question } from '../../shared/util/test-data';
import RiskAreaAssessment, { RiskAreaAssessment as Component } from '../risk-area-assessment';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const oldDate = Date.now;
beforeAll(() => { Date.now = jest.fn(() => 1500494779252); });
afterAll(() => { Date.now = oldDate; });

const riskAreaQuestions = [
  question,
  {
    id: 'question-2',
    createdAt: '2017-08-16T19:27:36.378Z',
    deletedAt: null,
    validatedSource: null,
    title: 'Question 2',
    answerType: 'radio' as any,
    riskAreaId: 'risk-area-id',
    screeningToolId: null,
    order: 2,
    applicableIfType: 'allTrue' as any,
    answers: [
      {
        id: 'question-2-answer-1',
        displayValue: 'answer-1',
        value: 'answer-1',
        valueType: 'text' as any,
        questionId: 'question-2',
        order: 1,
        riskAdjustmentType: 'increment' as any,
        inSummary: false,
        summaryText: 'None',
        concernSuggestions: [],
        goalSuggestions: [],
      },
    ],
    applicableIfQuestionConditions: [
      {
        id: 'condition-1',
        questionId: 'question-1',
        answerId: 'answer-1',
      },
    ],
  },
];

it('renders a risk area assessment', async () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <RiskAreaAssessment
          riskAreaId={'risk-area-1'}
          patientId={'patient-1'}
          routeBase={`/patients/patient-1/360`}
          refetchRiskArea={() => true}
          refetchRiskAreaQuestions={() => true}
          refetchPatientAnswers={() => true}
        />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('method tests', () => {
  it('renders questions with correct visibility', () => {
    const component = shallow(
      <Component
        riskAreaId={'risk-area-id'}
        riskAreaQuestions={riskAreaQuestions}
        patientId={'patient-id'}
        routeBase={'/patients/patient-id/360'}
        refetchRiskArea={() => true}
        refetchRiskAreaQuestions={() => true}
        refetchPatientAnswers={() => true}
      />,
    );
    const instance = component.instance() as Component;

    instance.setState({
      questions: {
        'question-1': { answers: [], oldAnswers: [], changed: false },
        'question-2': { answers: [], oldAnswers: [], changed: false },
      },
    });
    expect(instance.renderRiskAreaQuestions()).toMatchSnapshot();
  });

  it('sets state with new patient answers', () => {
    const component = shallow(
      <Component
        riskAreaId={'risk-area-id'}
        riskAreaQuestions={undefined}
        patientId={'patient-id'}
        routeBase={'/patients/patient-id/360'}
        refetchRiskArea={() => true}
        refetchRiskAreaQuestions={() => true}
        refetchPatientAnswers={() => true}
      />,
    );
    const instance = component.instance() as Component;

    instance.componentWillReceiveProps({
      riskAreaId: 'risk-area-id',
      patientId: 'patient-id',
      routeBase: '/patients/patient-id/360',
      riskAreaQuestions: undefined,
      patientAnswers: [patientAnswer],
      refetchRiskArea: () => true,
      refetchRiskAreaQuestions: () => true,
      refetchPatientAnswers: () => true,
    });
    expect(instance.state.questions[question.id]).toEqual({
      answers: [{
        id: patientAnswer.answerId,
        value: patientAnswer.answerValue,
      }],
      changed: false,
      oldAnswers: [{
        id: patientAnswer.answerId,
        value: patientAnswer.answerValue,
      }],
    });
  });

  it('adds new risk area questions', () => {
    const component = shallow(
      <Component
        riskAreaId={'risk-area-id'}
        riskAreaQuestions={undefined}
        patientId={'patient-id'}
        routeBase={'/patients/patient-id/360'}
        refetchRiskArea={() => true}
        refetchRiskAreaQuestions={() => true}
        refetchPatientAnswers={() => true}
      />,
    );
    const instance = component.instance() as Component;

    instance.componentWillReceiveProps({
      riskAreaId: 'risk-area-id',
      patientId: 'patient-id',
      routeBase: '/patients/patient-id/360',
      riskAreaQuestions,
      refetchRiskArea: () => true,
      refetchRiskAreaQuestions: () => true,
      refetchPatientAnswers: () => true,
    });
    expect(instance.state.questions[question.id]).toEqual({
      answers: [],
      changed: false,
      oldAnswers: [],
    });
  });
});
