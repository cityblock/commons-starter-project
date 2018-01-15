import { shallow } from 'enzyme';
import * as React from 'react';
import { concern } from '../../shared/util/test-data';
import { Concern as Component } from '../concern';

const match = {
  params: {
    objectId: concern.id,
  },
};

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
        concernError={null}
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
