import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { riskArea } from '../../shared/util/test-data';
import BuilderQuestions from '../builder-questions';

const match = {
  params: {
    riskAreaId: riskArea.id,
    progressNoteTemplateId: undefined,
    toolId: undefined,
    questionId: undefined,
  },
};

describe('builder concerns', () => {
  it('renders builder questions', () => {
    const mockStore = configureMockStore([]);
    const history = createMemoryHistory();
    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, riskArea })}>
          <ReduxConnectedIntlProvider>
            <ConnectedRouter history={history}>
              <BuilderQuestions
                match={match}
                routeBase="/route/base"
                riskAreaId="risk-area-id"
                questionId="cool-question-id"
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
