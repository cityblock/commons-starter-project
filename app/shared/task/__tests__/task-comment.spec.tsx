import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { assignedTask, comment, currentUser, user } from '../../util/test-data';
import TaskComment, { TaskComment as Comment } from '../task-comment';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('correctly renders a comment as editable or not', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task: assignedTask })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskComment comment={comment} onEdit={() => true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const editable = new Comment({
    comment,
    currentUser,
    onEdit: () => true,
  });
  const nonEditable = new Comment({
    comment,
    currentUser: user,
    onEdit: () => true,
  });

  expect(editable.isEditable()).toEqual(true);
  expect(nonEditable.isEditable()).toEqual(false);
});
