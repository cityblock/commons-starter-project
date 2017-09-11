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
/* tslint:disable:max-line-length */
import PopupPatientCarePlanSuggestionDismissed from '../popup-patient-care-plan-suggestion-dismissed';
/* tslint:enable:max-line-length */

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders popup for concern suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PopupPatientCarePlanSuggestionDismissed
            visible={true}
            suggestion={carePlanSuggestionWithConcern}
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
          <PopupPatientCarePlanSuggestionDismissed
            visible={true}
            suggestion={carePlanSuggestionWithGoal}
            onDismiss={() => true}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
