import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { progressNoteTemplate } from '../../shared/util/test-data';
import { ProgressNoteTemplateRow } from '../progress-note-template-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

describe('question row', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders progress note template row', () => {
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <ProgressNoteTemplateRow
                routeBase="/route/base"
                progressNoteTemplate={progressNoteTemplate}
                selected={true}
              />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
