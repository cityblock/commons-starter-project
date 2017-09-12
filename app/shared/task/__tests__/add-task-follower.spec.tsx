import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { currentUser, patient, taskWithComment, user } from '../../util/test-data';
import AddTaskFollower, { AddTaskFollower as AddFollower } from '../add-task-follower';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const history = createMemoryHistory();

it('correctly renders/does not render the add task follower button', () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task: taskWithComment })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <AddTaskFollower
            patientId={patient.id}
            taskId={taskWithComment.id}
            followers={[currentUser, user]}
            careTeam={[currentUser, user]}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('correctly renders with button', () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={taskWithComment.id}
      followers={[currentUser]}
      careTeam={[currentUser, user]}
      addTaskFollower={addTaskFollower as any}
    />,
  );

  const instance = component.instance() as AddFollower;
  expect(instance.getValidNewFollowers()).toEqual([user]);
});

it('correctly renders without button', () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={taskWithComment.id}
      followers={[currentUser, user]}
      careTeam={[currentUser, user]}
      addTaskFollower={addTaskFollower as any}
    />,
  );

  const instance = component.instance() as AddFollower;
  expect(instance.getValidNewFollowers()).toEqual([]);
});

it('renders care team', () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={taskWithComment.id}
      followers={[currentUser]}
      careTeam={[currentUser, user]}
      addTaskFollower={addTaskFollower as any}
    />,
  );

  const instance = component.instance() as AddFollower;
  expect(instance.renderCareTeamMembers([currentUser, user])).toMatchSnapshot();
});

it('handles onclick', async () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={taskWithComment.id}
      followers={[currentUser]}
      careTeam={[currentUser, user]}
      addTaskFollower={addTaskFollower as any}
    />,
  );

  const instance = component.instance() as AddFollower;
  await instance.onCareTeamMemberClick(currentUser.id);
  expect(addTaskFollower).toBeCalled();
  expect(instance.state).toEqual({
    open: false,
    loading: false,
    addFollowerError: undefined,
    lastCareTeamMemberId: undefined,
  });
});
