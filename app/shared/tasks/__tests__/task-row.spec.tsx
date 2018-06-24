import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { CBO_REFERRAL_ACTION_TITLE } from '../../../../shared/constants';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { isDueSoon } from '../../helpers/format-helpers';
import { task, user } from '../../util/test-data';
import { TaskRow } from '../task-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;
const userId = 'jonSnow';

describe('task row', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders task row', () => {
    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, task })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <TaskRow
                task={task}
                selectedTaskId={task.id}
                routeBase={'/foo/bar'}
                currentUserId={userId}
              />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders task row with multiple followers', () => {
    const user2 = {
      id: 'id2',
      locale: 'en',
      firstName: 'first2',
      lastName: 'last2',
      userRole: 'physician' as any,
      email: 'b@c.com',
      homeClinicId: '1',
      googleProfileImageUrl: null,
    };
    (task as any).followers = [user, user2];

    const tree = create(
      <MockedProvider mocks={[]}>
        <Provider store={mockStore({ locale, task })}>
          <ReduxConnectedIntlProvider>
            <BrowserRouter>
              <TaskRow
                task={task}
                selectedTaskId={task.id}
                routeBase={'/foo/bar'}
                currentUserId={userId}
              />
            </BrowserRouter>
          </ReduxConnectedIntlProvider>
        </Provider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Task Row Component', () => {
  it('applies inactive styles if task row not selected', () => {
    const wrapper = shallow(
      <TaskRow
        task={task}
        selectedTaskId="sansaStark"
        routeBase={'/foo/bar'}
        currentUserId={userId}
      />,
    );

    expect(wrapper.find('.inactive').length).toBe(1);
    expect(wrapper.find('.selected').length).toBe(0);
    expect(wrapper.find('.dateValue').length).toBe(1);
    expect(wrapper.find('.dateValue').text()).toBe('May 16, 2017');
  });

  it('applies selected styles if task row selected', () => {
    const wrapper = shallow(
      <TaskRow
        task={task}
        selectedTaskId={task.id}
        routeBase={'/foo/bar'}
        currentUserId={userId}
      />,
    );

    expect(wrapper.find('.inactive').length).toBe(0);
    expect(wrapper.find('.selected').length).toBe(1);
  });

  it('shows a notification badge when the task has notifications', () => {
    const wrapper = shallow(
      <TaskRow
        task={task}
        selectedTaskId={task.id}
        routeBase={'/foo/bar'}
        currentUserId={userId}
      />,
    );

    const task2 = cloneDeep(task);
    task2.dueAt = new Date(Date.now() + 60 * 60 * 24 * 5 * 1000).toISOString();
    task2.id = 'task-id-2';

    // The current task is overdue
    expect(isDueSoon(task.dueAt)).toBe(true);
    expect(wrapper.find('.notificationBadge').length).toBe(1);

    // Set notification on task and have it be overdue
    wrapper.setProps({ taskIdsWithNotifications: [task.id] });
    expect(wrapper.find('.notificationBadge').length).toBe(1);

    // Set task to be due 5 days in the future and have no notifications
    wrapper.setProps({ task: task2, taskIdsWithNotifications: [] });
    expect(wrapper.find('.notificationBadge').length).toBe(0);

    // Set notification on task inside of concern
    wrapper.setProps({ taskIdsWithNotifications: [task2.id] });
    expect(wrapper.find('.notificationBadge').length).toBe(1);

    wrapper.setProps({ taskIdsWithNotifications: [task.id] });
    expect(wrapper.find('.notificationBadge').length).toBe(0);
  });

  it('shows a notification badge if a CBO referral task has action required', () => {
    const taskAction = {
      ...task,
      title: CBO_REFERRAL_ACTION_TITLE,
    };

    const wrapper = shallow(
      <TaskRow task={taskAction} selectedTaskId="" routeBase={'/foo/bar'} currentUserId={userId} />,
    );

    expect(wrapper.find('.notificationBadge').length).toBe(1);
  });
});
