import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import {
  carePlanSuggestionWithConcern,
  carePlanSuggestionWithGoal,
  concern,
} from '../../shared/util/test-data';
import PopupPatientCarePlanSuggestionAcceptedModalBody from '../popup-patient-care-plan-suggestion-accepted-modal-body';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const carePlan = {
  concerns: [],
  goals: [],
};

it('renders popup modal body for concern suggestion', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PopupPatientCarePlanSuggestionAcceptedModalBody
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithGoal]}
              concernId={'concern-id'}
              concernType={'active'}
              concerns={[concern]}
              suggestion={carePlanSuggestionWithConcern}
              onChange={(event: any) => true}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders popup modal body for goal suggestion', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PopupPatientCarePlanSuggestionAcceptedModalBody
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithConcern]}
              concernId={'concern-id'}
              concernType={'active'}
              concerns={[concern]}
              suggestion={carePlanSuggestionWithGoal}
              onChange={(event: any) => true}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
