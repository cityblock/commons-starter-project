import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import {
  carePlanSuggestionWithConcern,
  carePlanSuggestionWithGoal,
} from '../../shared/util/test-data';
import PatientCarePlanSuggestion from '../patient-care-plan-suggestion';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const oldDate = Date.now;

beforeAll(() => {
  Date.now = jest.fn(() => 1500494779252);
});
afterAll(() => {
  Date.now = oldDate;
});

it('renders patient care plan suggestion (concern)', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientCarePlanSuggestion
              suggestion={carePlanSuggestionWithConcern}
              onDismiss={suggestion => true}
              onAccept={(suggestion, type) => true}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders patient care plan suggestion (goal)', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientCarePlanSuggestion
              suggestion={carePlanSuggestionWithGoal}
              onDismiss={suggestion => true}
              onAccept={(suggestion, type) => true}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
