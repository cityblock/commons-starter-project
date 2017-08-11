import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import RiskAreaMultiSelectAnswer from '../risk-area-multi-select-answer';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders a multi-select answer', () => {
  const history = createMemoryHistory();
  const answer = {
    id: '456',
    displayValue: 'Answer',
    value: 'answer',
    valueType: 'string' as any,
    questionId: '123',
    order: 1,
    riskAdjustmentType: null,
    inSummary: false,
    summaryText: null,
  };

  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <RiskAreaMultiSelectAnswer
            onClick={() => true}
            answer={answer}
            selected={false}
            editable={true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
