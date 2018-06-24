import { shallow } from 'enzyme';

import { clone } from 'lodash';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { question } from '../../util/test-data';
import QuestionAnswers, { QuestionAnswers as Component } from '../question-answers';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const answerData = [{ id: 'answser-id', value: '1' }];

it('renders question answers', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <QuestionAnswers
              question={question}
              onChange={() => true}
              answerData={answerData}
              editable={true}
            />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('rendering the correct answer type', () => {
  it('renders radio answers', async () => {
    const component = shallow(
      <Component
        question={question}
        onChange={() => true}
        answerData={answerData}
        editable={true}
      />,
    );
    const instance = component.instance() as Component;
    const result = instance.render();
    expect(result.type.toString()).toMatch(/RadioAnswer/);
  });

  it('renders dropdown answers', async () => {
    const multiSelectQuestion = clone(question);
    multiSelectQuestion.answerType = 'dropdown';

    const component = shallow(
      <Component
        question={multiSelectQuestion}
        onChange={() => true}
        answerData={answerData}
        editable={true}
      />,
    );
    const instance = component.instance() as Component;
    const result = instance.render();
    expect(result.type.toString()).toMatch(/DropdownAnswer/);
  });

  it('renders free text answers', async () => {
    const multiSelectQuestion = clone(question);
    multiSelectQuestion.answerType = 'freetext';

    const component = shallow(
      <Component
        question={multiSelectQuestion}
        onChange={() => true}
        answerData={answerData}
        editable={true}
      />,
    );
    const instance = component.instance() as Component;
    const result = instance.render();
    expect(result.type.toString()).toMatch(/FreeTextAnswer/);
  });

  it('renders multi select answers', async () => {
    const multiSelectQuestion = clone(question);
    multiSelectQuestion.answerType = 'multiselect';

    const component = shallow(
      <Component
        question={multiSelectQuestion}
        onChange={() => true}
        answerData={answerData}
        editable={true}
      />,
    );
    const instance = component.instance() as Component;
    const result = instance.render();
    // This one is weird becuase the top level is not a MultiSelectAnswer
    expect(result.type.toString()).not.toMatch(/RadioAnswer/);
    expect(result.type.toString()).not.toMatch(/FreeTextAnswer/);
    expect(result.type.toString()).not.toMatch(/DropdownAnswer/);
  });
});
