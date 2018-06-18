import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { goal } from '../../shared/util/test-data';
import { GoalRow } from '../goal-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

describe('goal row', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders goal row', () => {
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, goal })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <GoalRow goal={goal} selected={true} routeBase={'/foo/bar'} />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
