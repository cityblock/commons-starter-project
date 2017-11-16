import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { TableLoadingError } from '../table-loading-error';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders empty div', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <TableLoadingError isLoading={false} error={undefined} onRetryClick={() => false} />
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders error', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <TableLoadingError isLoading={false} error={'my error'} onRetryClick={() => false} />
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders loading', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <TableLoadingError isLoading={true} error={undefined} onRetryClick={() => false} />
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
