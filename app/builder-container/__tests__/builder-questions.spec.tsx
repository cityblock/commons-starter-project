import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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

    const locale = { messages: ENGLISH_TRANSLATION.messages };
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, riskArea })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <BuilderQuestions match={match} history={{} as any} />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
