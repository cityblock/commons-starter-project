import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import PatientEnrollment from '../patient-enrollment';

it('renders patient enrollment container correctly', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();

  const tree = create(
    <MockedProvider mocks={[]} store={mockStore()}>
      <ConnectedRouter history={history}>
        <PatientEnrollment />
      </ConnectedRouter>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
