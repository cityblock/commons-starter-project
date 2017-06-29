import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { TableLoadingError } from '../table-loading-error';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders empty div', () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <TableLoadingError
          isLoading={false}
          error={undefined}
          onRetryClick={() => false}
        />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders error', () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <TableLoadingError
          isLoading={false}
          error={'my error'}
          onRetryClick={() => false}
        />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders loading', () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <TableLoadingError
          isLoading={true}
          error={undefined}
          onRetryClick={() => false}
        />
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
