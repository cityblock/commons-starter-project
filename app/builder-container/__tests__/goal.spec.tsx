import { shallow } from 'enzyme';

import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { goal } from '../../shared/util/test-data';
import Goal, { Goal as Component } from '../goal';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders without goal', () => {
  const match = {
    params: {
      objectId: goal.id,
    },
  };
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, goal })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <Goal routeBase={'/route/base'} match={match} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('shallow rendered', () => {
  const editGoal = jest.fn();
  const refetchGoal = jest.fn();
  const onDelete = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        routeBase={'/route/base'}
        goal={goal}
        goalLoading={false}
        goalError={null}
        refetchGoal={refetchGoal}
        editGoal={editGoal}
        onDelete={onDelete}
        goalId={goal.id}
      />,
    );
    instance = component.instance() as Component;
  });

  it('renders with goal', () => {
    expect(instance.render()).toMatchSnapshot();
  });

  it('confirms delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onConfirmDelete();
    expect(onDelete).toBeCalledWith(goal.id);
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
    expect(editGoal).toBeCalledWith({
      variables: {
        goalSuggestionTemplateId: goal.id,
        title: 'new title',
      },
    });
  });
});
