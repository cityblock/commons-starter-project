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
  concern,
} from '../../shared/util/test-data';

/* tslint:disable:max-line-length */
import PopupPatientCarePlanSuggestionAcceptedModalBody from '../popup-patient-care-plan-suggestion-accepted-modal-body';
/* tslint:enable:max-line-length */

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const carePlan = {
  concerns: [],
  goals: [],
};

it('renders popup modal body for concern suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PopupPatientCarePlanSuggestionAcceptedModalBody
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithGoal]}
              concernId={'concern-id'}
              concernType={'active'}
              concerns={[concern]}
              suggestion={carePlanSuggestionWithConcern}
              onDismiss={() => true}
              onSubmit={() => true}
              onChange={(event: any) => true}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders popup modal body for goal suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PopupPatientCarePlanSuggestionAcceptedModalBody
              carePlan={carePlan}
              carePlanSuggestions={[carePlanSuggestionWithConcern]}
              concernId={'concern-id'}
              concernType={'active'}
              concerns={[concern]}
              suggestion={carePlanSuggestionWithGoal}
              onDismiss={() => true}
              onSubmit={() => true}
              onChange={(event: any) => true}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
