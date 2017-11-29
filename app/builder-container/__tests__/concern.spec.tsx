import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { concern } from '../../shared/util/test-data';
import Concern, { Concern as Component } from '../concern';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const match = {
  params: {
    objectId: concern.id,
  },
};

it('renders without concern', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, concern })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <Concern routeBase={'/route/base'} match={match} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('shallow rendered', () => {
  const editConcern = jest.fn();
  const refetchConcern = jest.fn();
  const onDelete = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        routeBase={'/route/base'}
        match={match}
        concern={concern}
        concernLoading={false}
        concernError={undefined}
        refetchConcern={refetchConcern}
        editConcern={editConcern}
        onDelete={onDelete}
        concernId={concern.id}
      />,
    );
    instance = component.instance() as Component;
  });

  it('renders with concern', () => {
    expect(instance.render()).toMatchSnapshot();
  });

  it('confirms delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onConfirmDelete();
    expect(onDelete).toBeCalledWith(concern.id);
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
    expect(editConcern).toBeCalledWith({
      variables: {
        concernId: concern.id,
        title: 'new title',
      },
    });
  });
});
