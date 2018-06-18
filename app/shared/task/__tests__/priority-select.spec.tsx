import { shallow } from 'enzyme';
import React from 'react';
import Option from '../../library/option/option';
import Select from '../../library/select/select';
import PrioritySelect from '../priority-select';

describe('Task Priority Select Component', () => {
  const priority = 'high' as any;
  const onPriorityClick = jest.fn();

  const wrapper = shallow(<PrioritySelect priority={priority} onPriorityClick={onPriorityClick} />);

  it('renders select tag with correct value', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBe(priority);
  });

  it('renders four options for each priority level and instructions', () => {
    expect(wrapper.find(Option).length).toBe(4);

    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBe('');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe('low');
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBe('medium');
    expect(
      wrapper
        .find(Option)
        .at(3)
        .props().value,
    ).toBe('high');
  });

  it('passes custom styles if specified', () => {
    const className = 'custom';
    const wrapper2 = shallow(
      <PrioritySelect
        priority={priority}
        onPriorityClick={onPriorityClick}
        className={className}
      />,
    );

    expect(wrapper2.find(Select).props().className).toBe(`select red ${className}`);
  });
});
