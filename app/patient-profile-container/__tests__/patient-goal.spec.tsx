import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientGoal from '../patient-goal';

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

const user = {
  id: 'user-id',
  locale: 'en',
  firstName: 'Dan',
  lastName: 'Plant',
  email: 'dan@plant.com',
  userRole: 'physician' as any,
  createdAt: '2017-09-07T13:45:14.532Z',
  homeClinicId: 'clinic-id',
  googleProfileImageUrl: 'http://google.com/picture',
};

const task = {
  id: 'task-id',
  title: 'Task Title',
  description: null,
  patientId: 'patient-id',
  patient,
  dueAt: '2017-09-07T13:45:14.532Z',
  priority: 'high' as any,
  createdBy: user,
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
  completedBy: null,
  completedAt: null,
  assignedTo: null,
  followers: [],
};

const goalSuggestionTemplate = {
  id: 'goal-suggestion-template-id',
  title: 'Goal Title',
  taskTemplates: [],
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

const patientGoal = {
  id: 'patient-goal-id',
  title: 'Goal Title',
  patientId: 'patient-id',
  patient,
  patientConcernId: 'patient-concern-id',
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  goalSuggestionTemplate,
  tasks: [task],
  createdAt: '2017-09-07T13:45:14.532Z',
  updatedAt: '2017-09-07T13:45:14.532Z',
  deletedAt: null,
};

it('renders patient goal', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientGoal patientGoal={patientGoal} goalNumber={1} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
