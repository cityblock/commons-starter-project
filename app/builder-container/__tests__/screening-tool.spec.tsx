import { shallow } from 'enzyme';
import React from 'react';
import { screeningTool } from '../../shared/util/test-data';
import { ScreeningTool as Component } from '../screening-tool';

const match = {
  params: {
    screeningToolId: screeningTool.id,
  },
};

describe('shallow rendered', () => {
  const refetchScreeningTool = jest.fn();
  const editScreeningTool = jest.fn();
  const onDelete = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        match={match}
        routeBase={'/route/base'}
        screeningTool={screeningTool}
        screeningToolId={screeningTool.id}
        screeningToolLoading={false}
        screeningToolError={null}
        onDelete={onDelete}
        refetchScreeningTool={refetchScreeningTool}
        editScreeningTool={editScreeningTool}
      />,
    );
    instance = component.instance() as Component;
  });

  it('renders with screening tool', () => {
    expect(instance.render()).toMatchSnapshot();
  });

  it('confirms delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onConfirmDelete();
    expect(onDelete).toBeCalledWith(screeningTool.id);
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
    expect(editScreeningTool).toBeCalledWith({
      variables: {
        screeningToolId: screeningTool.id,
        title: 'new title',
      },
    });
  });
});
