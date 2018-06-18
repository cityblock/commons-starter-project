import { shallow } from 'enzyme';
import React from 'react';
import Avatar from '../../avatar/avatar';
import SelectDropdownOption from '../select-dropdown-option';

describe('Library Select Dropdown Option Component', () => {
  const value = 'Sansa Stark';
  const onClick = jest.fn();

  it('renders basic option component', () => {
    const wrapper = shallow(<SelectDropdownOption value={value} onClick={onClick} />);

    expect(wrapper.find('.option').length).toBe(1);
    expect(wrapper.find('.option').props().onClick).toBe(onClick);
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').text()).toBe(value);
    expect(wrapper.find('img').length).toBe(0);
    expect(wrapper.find('p').length).toBe(0);
  });

  it('renders avatar and detail if provided', () => {
    const detail = 'Winterfell';
    const avatarUrl = 'sansa.png';

    const wrapper = shallow(
      <SelectDropdownOption value={value} detail={detail} avatarUrl={avatarUrl} />,
    );

    expect(wrapper.find(Avatar).length).toBe(1);
    expect(wrapper.find(Avatar).props().src).toBe(avatarUrl);
    expect(wrapper.find(Avatar).props().size).toBe('medium');
    expect(wrapper.find(Avatar).props().className).toBe('avatar');
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(`(${detail})`);
  });
});
