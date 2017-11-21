import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientConcerns from '../../shared/concerns';
import PatientCarePlan from '../patient-care-plan';
const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders patient care plan', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientCarePlan
              carePlan={{ concerns: [], goals: [] }}
              patientId={'patient-1'}
              loading={false}
              routeBase={'/patients/patient-1/map'}
              selectedTaskId=''
            />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Patient Care Plan Component', () => {
  const patientId = 'aryaStark';
  const routeBase = `/patients/${patientId}/map`;

  it('does not render concerns if loading', () => {
    const wrapper = shallow(
      <PatientCarePlan
        carePlan={{ concerns: [], goals: [] }}
        patientId={patientId}
        loading={true}
        routeBase={routeBase}
        selectedTaskId=''
      />,
    );

    expect(wrapper.find(PatientConcerns).length).toBe(0);
  });
});
