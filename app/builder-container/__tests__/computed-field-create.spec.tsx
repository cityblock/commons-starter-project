import { shallow } from 'enzyme';
import * as React from 'react';
import { ComputedFieldCreate as Component } from '../computed-field-create';

describe('shallow rendered', () => {
  const createComputedField = jest.fn();
  let instance: any;

  beforeEach(() => {
    const component = shallow(
      <Component
        routeBase="/builder/computed-fields"
        createComputedField={createComputedField}
        onClose={() => false}
      />,
    );
    instance = component.instance() as Component;
  });

  it('submits changed property', async () => {
    instance.onChange({
      target: {
        name: 'label',
        value: 'label to create',
      },
      preventDefault: jest.fn(),
    });
    await instance.onSubmit({
      preventDefault: jest.fn(),
    });

    expect(createComputedField).toBeCalledWith({
      variables: {
        label: 'label to create',
        dataType: 'boolean', // This is the default
      },
    });
  });
});
