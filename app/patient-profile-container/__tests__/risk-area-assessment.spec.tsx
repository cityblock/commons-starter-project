import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import RiskAreaAssessment from '../risk-area-assessment';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders a risk area assessment', async () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <RiskAreaAssessment
          riskAreaId={'risk-area-1'}
          patientId={'patient-1'}
          routeBase={`/patients/patient-1/360`} />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
