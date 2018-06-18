import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { assignedTask, comment, currentUser, user } from '../../util/test-data';
import TaskComment, { TaskComment as Comment } from '../task-comment';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('correctly renders a comment as editable or not', () => {
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, task: assignedTask })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <TaskComment comment={comment} onEdit={() => true} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const editable = new Comment({
    comment,
    currentUser,
    onEdit: () => true,
    loading: false,
    error: null,
  });
  const nonEditable = new Comment({
    comment,
    currentUser: user,
    onEdit: () => true,
    loading: false,
    error: null,
  });

  expect(editable.isEditable()).toEqual(true);
  expect(nonEditable.isEditable()).toEqual(false);
});
