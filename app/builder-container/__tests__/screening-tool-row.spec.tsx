import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
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
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, screeningTool })}>
          <ReduxConnectedIntlProvider>
            <ConnectedRouter history={history}>
              <ScreeningToolRow
                screeningTool={screeningTool}
                selected={true}
                routeBase={'/foo/bar'}
              />
            </ConnectedRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
