import { shallow } from 'enzyme';
import * as React from 'react';
import TextInput from '../../../library/text-input/text-input';
import CreateTaskOtherCBO from '../other-cbo';

describe('Create Task Modal Other CBO Component', () => {
  const CBOName = "Arya's Meat Pie Pantry";
  const CBOUrl = 'www.agirlhasnoname.com';
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <CreateTaskOtherCBO CBOName={CBOName} CBOUrl={CBOUrl} onChange={placeholderFn} />,
  );

  it('renders text input for CBO name', () => {
    expect(wrapper.find(TextInput).length).toBe(2);

    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().value,
    ).toBe(CBOName);
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().placeholderMessageId,
    ).toBe('taskCreate.CBOName');
    expect(
      wrapper
        .find(TextInput)
        .at(0)
        .props().className,
    ).toBe('marginTop');
  });

  it('renders text input for CBO URL', () => {
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().value,
    ).toBe(CBOUrl);
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().placeholderMessageId,
    ).toBe('taskCreate.CBOUrl');
    expect(
      wrapper
        .find(TextInput)
        .at(1)
        .props().className,
    ).toBe('marginTop');
  });
});
