import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientEncounters from '../patient-encounters';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders encounter', () => {
  const encounter = {
    encounterType: 'encounter type',
    providerName: 'provider name',
    providerRole: 'provider role',
    location: 'location',
    diagnoses: [{
      code: 'code',
      codeSystem: 'code system',
      description: 'desc',
    }],
    reasons: ['reason'],
    dateTime: '10/10/2010',
  };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <PatientEncounters
          patientId={'1234'}
          patientEncounters={[encounter]} />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
