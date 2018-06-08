import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { carePlanSuggestionWithConcern, concern, patient } from '../../../shared/util/test-data';
import PatientCarePlanSuggestionOptionGroup from '../patient-care-plan-suggestion-option-group';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const carePlan = {
  goals: [],
  concerns: [
    {
      id: 'patient-concern-1',
      order: 1,
      concernId: 'concern-id-1',
      concern,
      patientGoals: [],
      patientId: 'patient-id',
      patient,
      startedAt: null,
      completedAt: null,
      createdAt: '2017-09-07T13:45:14.532Z',
      updatedAt: '2017-09-07T13:45:14.532Z',
      deletedAt: null,
    },
    {
      id: 'patient-concern-2',
      order: 2,
      concernId: 'concern-id-2',
      concern: {
        id: 'concern-id-2',
        title: 'Concern 2',
        createdAt: '2017-09-07T13:45:14.532Z',
        updatedAt: '2017-09-07T13:45:14.532Z',
        deletedAt: null,
        diagnosisCodes: [],
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

it('renders options for suggested concerns', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PatientCarePlanSuggestionOptionGroup
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithConcern]}
              optionType={'suggested'}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders options for active concerns', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PatientCarePlanSuggestionOptionGroup
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithConcern]}
              optionType={'active'}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders options for inactive concerns', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PatientCarePlanSuggestionOptionGroup
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithConcern]}
              optionType={'inactive'}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
