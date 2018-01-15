import { shallow } from 'enzyme';

import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { task, user } from '../../util/test-data';
import { TaskRow } from '../task-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

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
              <TaskRow task={task} selectedTaskId={task.id} routeBase={'/foo/bar'} />
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
              <TaskRow task={task} selectedTaskId={task.id} routeBase={'/foo/bar'} />
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
      <TaskRow task={task} selectedTaskId="sansaStark" routeBase={'/foo/bar'} />,
    );

    expect(wrapper.find('.inactive').length).toBe(1);
    expect(wrapper.find('.selected').length).toBe(0);
  });

  it('applies selected styles if task row selected', () => {
    const wrapper = shallow(
      <TaskRow task={task} selectedTaskId={task.id} routeBase={'/foo/bar'} />,
    );

    expect(wrapper.find('.inactive').length).toBe(0);
    expect(wrapper.find('.selected').length).toBe(1);
  });
});
