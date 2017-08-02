import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { QuestionRow } from '../question-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

const question = {
  id: 'cool-task-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  title: 'title',
  order: 1,
  validatedSource: 'validated source',
  answerType: 'radio' as any,
  riskAreaId: 'risk-area-id',
  applicableIfType: 'allTrue' as any,
};

describe('question row', () => {

  beforeAll(() => { Date.now = jest.fn(() => 1500494779252); });
  afterAll(() => { Date.now = oldDate; });

  it('renders question row', () => {
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale, question })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <QuestionRow
              question={question}
              selected={true}
              routeBase={'/foo/bar'} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
