import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { assignedTask, completedTask } from '../../util/test-data';
import Task, { Task as Component } from '../task';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders task', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task: assignedTask })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Task
            task={assignedTask}
            taskId={assignedTask.id}
            taskLoading={false}
            selectTask={() => false}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders missing task', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task: assignedTask })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Task
            task={undefined}
            taskId={assignedTask.id}
            taskLoading={false}
            selectTask={() => false}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('method tests', () => {
  let instance: any;
  const completeTask = jest.fn();
  const unCompleteTask = jest.fn();
  const editTask = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    const component = shallow(
      <Component
        task={assignedTask}
        taskId={assignedTask.id}
        taskLoading={false}
        selectTask={() => false}
        routeBase='/route/base'
        refetchTask={() => false}
        completeTask={completeTask}
        uncompleteTask={unCompleteTask}
        editTask={editTask}
        onDelete={onDelete}
      />,
    );
    instance = component.instance();
  });

  it('updates title and description if it gets a new task', () => {
    completedTask.id = 'new-id';
    completedTask.title = 'new title';
    (completedTask.description as any) = 'new description';
    instance.componentWillReceiveProps({
      task: completedTask,
    });
    expect(instance.state.editedTitle).toEqual('new title');
    expect(instance.state.editedDescription).toEqual('new description');
  });

  it('calls complete and uncomplete task', () => {
    instance.onClickToggleCompletion();
    expect(completeTask).toBeCalled();
    instance.props.task.completedAt = new Date().toISOString();
    instance.onClickToggleCompletion();
    expect(unCompleteTask).toBeCalled();
  });

  it('onKey down correctly handles title', () => {
    const editedTitle = {
      keyCode: 13,
      preventDefault: jest.fn(),
      currentTarget: {
        name: 'editedTitle',
      },
    };
    instance.onKeyDown(editedTitle);
    expect(editTask).toBeCalled();
  });

  it('onKey down correctly handles description', () => {
    const editedDescription = {
      keyCode: 13,
      preventDefault: jest.fn(),
      currentTarget: {
        name: 'editedDescription',
      },
    };
    instance.onKeyDown(editedDescription);
    expect(editTask).toBeCalled();
  });

});
