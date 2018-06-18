import { shallow } from 'enzyme';
import React from 'react';
import { computedField } from '../../shared/util/test-data';
import { ComputedField as Component } from '../computed-field';

const match = {
  params: {
    objectId: computedField.id,
  },
};

describe('shallow rendered', () => {
  const refetchComputedField = jest.fn();
  const onDelete = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        routeBase={'/route/base'}
        match={match}
        computedField={computedField}
        computedFieldLoading={false}
        computedFieldError={null}
        refetchComputedField={refetchComputedField}
        onDelete={onDelete}
        computedFieldId={computedField.id}
      />,
    );
    instance = component.instance() as Component;
  });

  it('confirms delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onConfirmDelete();
    expect(onDelete).toBeCalledWith(computedField.id);
    expect(instance.state.deleteConfirmationInProgress).toBeFalsy();
  });

  it('cancels delete', async () => {
    await instance.onClickDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeTruthy();

    await instance.onCancelDelete();
    expect(instance.state.deleteConfirmationInProgress).toBeFalsy();
  });
});
