import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { riskArea, screeningTool } from '../../shared/util/test-data';
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
      goalId: undefined,
    },
  };

  it('renders builder screening tools', () => {
    const mockStore = configureMockStore([]);
    const history = createMemoryHistory();
    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale })}>
          <ReduxConnectedIntlProvider>
            <ConnectedRouter history={history}>
              <BuilderScreeningTools
                match={match}
                routeBase="/foo/bar"
                screeningToolId={screeningTool.id}
                screeningTools={[screeningTool]}
                riskAreas={[riskArea]}
              />
            </ConnectedRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
