import { shallow } from 'enzyme';

import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { question, questionWithOtherTextAnswer } from '../../shared/util/test-data';
import AnswerCreateEdit from '../answer-create-edit';
import Question, { Question as Component } from '../question';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const match = {
  params: {
    questionId: question.id,
  },
};

it('renders question', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, question })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <Question routeBase="/route/base" match={match} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('shallow rendered', () => {
  const refetchQuestion = jest.fn();
  const editQuestion = jest.fn();
  const onDelete = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        match={match}
        routeBase={'/route/base'}
        question={question}
        questions={[question]}
        questionId={question.id}
        questionLoading={false}
        questionError={null}
        onDelete={onDelete}
        refetchQuestion={refetchQuestion}
        editQuestion={editQuestion}
      />,
    );
    instance = component.instance() as Component;
  });

  it('renders with screening tool', () => {
    expect(instance.render()).toMatchSnapshot();
  });

  it('confirms delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onConfirmDelete();
    expect(onDelete).toBeCalledWith(question.id);
    expect(instance.state.deleteConfirmationInProgress).toBeFalsy();
  });

  it('cancels delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onCancelDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeFalsy();
  });

  it('handles editing', async () => {
    await instance.setState({ editedTitle: 'new title' });
    await instance.onKeyDown({
      keyCode: 13,
      currentTarget: {
        name: 'editedTitle',
      },
      preventDefault: jest.fn(),
    });
    expect(editQuestion).toBeCalledWith({
      variables: {
        questionId: question.id,
        title: 'new title',
      },
    });
  });
});

describe('shallow rendered with other text answer', () => {
  const refetchQuestion = jest.fn();
  const editQuestion = jest.fn();
  const onDelete = jest.fn();

  it('does not render the other text answer', async () => {
    const wrapper = shallow(
      <Component
        match={match}
        routeBase={'/route/base'}
        question={questionWithOtherTextAnswer}
        questions={[questionWithOtherTextAnswer]}
        questionId={questionWithOtherTextAnswer.id}
        questionLoading={false}
        questionError={null}
        onDelete={onDelete}
        refetchQuestion={refetchQuestion}
        editQuestion={editQuestion}
      />,
    );
    // 1 for the non-otherTextAnswer + 1 empty one
    expect(wrapper.find(AnswerCreateEdit).length).toBe(2);
  });
});
