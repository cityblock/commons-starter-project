import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { patient, patientScreeningToolSubmission } from '../../../shared/util/test-data';
import ScreeningToolResultsPopup, {
  ScreeningToolResultsPopup as Component,
} from '../screening-tool-results-popup';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders screening tool results popup', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <ScreeningToolResultsPopup
              patientScreeningToolSubmissionId={patientScreeningToolSubmission.id}
              patientRoute={'/patients/patient-id'}
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the correct results', async () => {
  const component = shallow(
    <Component
      patientScreeningToolSubmissionId={patientScreeningToolSubmission.id}
      redirectToCarePlanSuggestions={() => true}
      patientRoute={`/patients/${patient.id}`}
      loading={false}
      error={null}
      patientScreeningToolSubmission={patientScreeningToolSubmission}
    />,
  );
  const instance = component.instance() as Component;
  expect(instance.getConcernCount()).toEqual(1);
  expect(instance.getGoalCount()).toEqual(1);
  expect(instance.getTaskCount()).toEqual(1);
  expect(instance.render()).toMatchSnapshot();
});
