import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { screeningTool } from '../../shared/util/test-data';
import { ScreeningToolRow } from '../screening-tool-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

describe('screening tool row', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders screening tool row', () => {
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, screeningTool })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <ScreeningToolRow
                screeningTool={screeningTool}
                selected={true}
                routeBase={'/foo/bar'}
              />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
