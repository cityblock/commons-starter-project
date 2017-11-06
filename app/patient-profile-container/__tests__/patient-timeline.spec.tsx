import * as React from 'react';
import { gql } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { encounter } from '../../shared/util/test-data';
import { patient, progressNote } from '../../shared/util/test-data';
import PatientTimeline from '../patient-timeline';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

export const query = gql(`
mutation progressNoteGetOrCreate($patientId: String!) {
  progressNoteGetOrCreate(input: {patientId: $patientId}) {
    ...FullProgressNote
    __typename
  }
}

fragment FullProgressNote on ProgressNote {
  id
  patientId
  userId
  completedAt
  createdAt
  updatedAt
  deletedAt
  progressNoteTemplate {
    ...FullProgressNoteTemplate
    __typename
  }
  __typename
}

fragment FullProgressNoteTemplate on ProgressNoteTemplate {
  id
  title
  createdAt
  deletedAt
  __typename
}`);

it('renders timeline', () => {
  const tree = create(
    <MockedProvider
      mocks={[
        {
          request: {
            query,
            variables: {
              patientId: patient.id,
            },
          },
          result: {
            data: {
              progressNoteGetOrCreate: progressNote,
            },
          },
        },
      ]}
      store={mockStore({ locale })}
    >
      <ReduxConnectedIntlProvider>
        <PatientTimeline patientId={patient.id} patientEncounters={[encounter]} />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
