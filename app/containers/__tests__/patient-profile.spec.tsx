import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import PatientProfile from '../patient-profile';

it('renders patient enrollment container correctly', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();

  const tree = create(
    <MockedProvider mocks={[]} store={mockStore()}>
      <ConnectedRouter history={history}>
        <Route component={PatientProfile as any} />
      </ConnectedRouter>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
