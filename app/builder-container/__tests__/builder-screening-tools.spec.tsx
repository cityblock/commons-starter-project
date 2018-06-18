import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import BuilderScreeningTools from '../builder-screening-tools';

const oldDate = Date.now;
describe('builder screening tools', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  const match = {
    params: {
      goalId: null,
      toolId: null,
    },
  };

  it('renders builder screening tools', () => {
    const mockStore = configureMockStore([]);

    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <BuilderScreeningTools match={match} />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
