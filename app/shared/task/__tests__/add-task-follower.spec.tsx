import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import AddTaskFollower, { AddTaskFollower as AddFollower } from '../add-task-follower';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const patient = {
  id: 'unique-id',
  firstName: 'first',
  middleName: 'middle',
  lastName: 'last',
  language: null,
  gender: null,
  dateOfBirth: null,
  zip: null,
  createdAt: null,
  consentToText: false,
  consentToCall: false,
};
const user1 = {
  id: 'id1',
  locale: 'en',
  firstName: 'first',
  lastName: 'last',
  userRole: 'physician' as any,
  email: 'a@b.com',
  homeClinicId: '1',
  googleProfileImageUrl: null,
};
const user2 = {
  id: 'id2',
  locale: 'en',
  firstName: 'first',
  lastName: 'last',
  userRole: 'physician' as any,
  email: 'b@c.com',
  homeClinicId: '1',
  googleProfileImageUrl: null,
};
const task = {
  id: 'cool-task-id',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  title: 'title',
  description: 'description',
  patient,
  patientId: patient.id,
  assignedTo: user1,
  createdBy: user1,
  followers: [user1],
};
const history = createMemoryHistory();

it('correctly renders/does not render the add task follower button', () => {
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <AddTaskFollower
            patientId={patient.id}
            taskId={task.id}
            followers={[user1, user2]}
            careTeam={[user1, user2]} />
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
      taskId={task.id}
      followers={[user1]}
      careTeam={[user1, user2]}
      addTaskFollower={addTaskFollower as any} />);

  const instance = component.instance() as AddFollower;
  expect(instance.getValidNewFollowers()).toEqual([user2]);
});

it('correctly renders without button', () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={task.id}
      followers={[user1, user2]}
      careTeam={[user1, user2]}
      addTaskFollower={addTaskFollower as any} />);

  const instance = component.instance() as AddFollower;
  expect(instance.getValidNewFollowers()).toEqual([]);
});

it('renders care team', () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={task.id}
      followers={[user1]}
      careTeam={[user1, user2]}
      addTaskFollower={addTaskFollower as any} />);

  const instance = component.instance() as AddFollower;
  expect(instance.renderCareTeamMembers([user1, user2])).toMatchSnapshot();
});

it('handles onclick', async () => {
  const addTaskFollower = jest.fn();
  const component = shallow(
    <AddFollower
      patientId={patient.id}
      taskId={task.id}
      followers={[user1]}
      careTeam={[user1, user2]}
      addTaskFollower={addTaskFollower as any} />);

  const instance = component.instance() as AddFollower;
  await instance.onCareTeamMemberClick(user1.id);
  expect(addTaskFollower).toBeCalled();
  expect(instance.state).toEqual({
    open: false,
    loading: false,
    addFollowerError: undefined,
    lastCareTeamMemberId: undefined,
  });
});
