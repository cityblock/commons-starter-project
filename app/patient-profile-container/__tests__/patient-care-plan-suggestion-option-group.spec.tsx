import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientCarePlanSuggestionOptionGroup from '../patient-care-plan-suggestion-option-group';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const patient = {
  id: 'patient-id',
  firstName: 'Bob',
  middleName: null,
  lastName: 'Smith',
  language: 'en',
  dateOfBirth: '01/01/1999',
  gender: 'male',
  zip: 10001,
  homeClinicId: 'clinic-id',
  createdAt: '2017-09-07T13:45:14.532Z',
  scratchPad: 'Note',
  consentToCall: true,
  consentToText: true,
};

const carePlan = {
  goals: [],
  concerns: [
    {
      id: 'patient-concern-1',
      order: 1,
      concernId: 'concern-id-1',
      concern: {
        id: 'concern-id-1',
        title: 'Concern 1',
        createdAt: '2017-09-07T13:45:14.532Z',
        updatedAt: '2017-09-07T13:45:14.532Z',
        deletedAt: null,
      },
      patientGoals: [],
      patientId: 'patient-id',
      patient,
      startedAt: null,
      completedAt: null,
      createdAt: '2017-09-07T13:45:14.532Z',
      updatedAt: '2017-09-07T13:45:14.532Z',
      deletedAt: null,
    }, {
      id: 'patient-concern-2',
      order: 2,
      concernId: 'concern-id-2',
      concern: {
        id: 'concern-id-2',
        title: 'Concern 2',
        createdAt: '2017-09-07T13:45:14.532Z',
        updatedAt: '2017-09-07T13:45:14.532Z',
        deletedAt: null,
      },
      patientGoals: [],
      patientId: 'patient-id',
      patient,
      startedAt: '2017-09-07T13:45:14.532Z',
      completedAt: null,
      createdAt: '2017-09-07T13:45:14.532Z',
      updatedAt: '2017-09-07T13:45:14.532Z',
      deletedAt: null,
    },
  ],
};

const carePlanSuggestion = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient: {
    id: 'patient-id',
    firstName: 'Bob',
    middleName: null,
    lastName: 'Smith',
    language: 'en',
    gender: 'male',
    dateOfBirth: '01/01/1995',
    zip: 10001,
    createdAt: '2017-08-16T19:27:36.378Z',
    consentToCall: true,
    consentToText: true,
  },
  suggestionType: 'concern' as any,
  concernId: 'concern-id',
  concern: {
    id: 'concern-id',
    title: 'Concern Title',
    createdAt: '2017-08-16T19:27:36.378Z',
    updatedAt: '2017-08-16T19:27:36.378Z',
    deletedAt: null,
  },
  goalSuggestionTemplateId: null,
  goalSuggestionTemplate: null,
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
};

it('renders options for suggested concerns', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientCarePlanSuggestionOptionGroup
            carePlan={carePlan}
            carePlanSuggestions={[carePlanSuggestion]}
            optionType={'suggested'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders options for active concerns', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientCarePlanSuggestionOptionGroup
            carePlan={carePlan}
            carePlanSuggestions={[carePlanSuggestion]}
            optionType={'active'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders options for inactive concerns', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientCarePlanSuggestionOptionGroup
            carePlan={carePlan}
            carePlanSuggestions={[carePlanSuggestion]}
            optionType={'inactive'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
