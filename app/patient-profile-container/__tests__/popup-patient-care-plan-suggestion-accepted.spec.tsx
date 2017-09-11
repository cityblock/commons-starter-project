import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import {
  carePlanSuggestionWithConcern,
  carePlanSuggestionWithGoal,
} from '../../shared/util/test-data';
import PopupPatientCarePlanSuggestionAccepted from '../popup-patient-care-plan-suggestion-accepted';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders popup for concern suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PopupPatientCarePlanSuggestionAccepted
            visible={true}
            suggestion={carePlanSuggestionWithConcern}
            patientId={'patient-id'}
            suggestionType={'concern'}
            onDismiss={() => true}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders popup for goal suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PopupPatientCarePlanSuggestionAccepted
            patientId={'patient-id'}
            visible={true}
            suggestion={carePlanSuggestionWithGoal}
            suggestionType={'goal'}
            onDismiss={() => true}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
