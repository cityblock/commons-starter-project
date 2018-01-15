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
} from '../../shared/util/test-data';
import PopupPatientCarePlanSuggestionDismissedModalBody from '../popup-patient-care-plan-suggestion-dismissed-modal-body';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders popup modal body for concern suggestion', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PopupPatientCarePlanSuggestionDismissedModalBody
              suggestion={carePlanSuggestionWithConcern}
              dismissedReason={'Because'}
              onDismiss={() => true}
              onSubmit={() => true}
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
            <PopupPatientCarePlanSuggestionDismissedModalBody
              suggestion={carePlanSuggestionWithGoal}
              dismissedReason={'Because'}
              onDismiss={() => true}
              onSubmit={() => true}
              onChange={(event: any) => true}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
