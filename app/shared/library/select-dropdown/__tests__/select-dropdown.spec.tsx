import { shallow } from 'enzyme';
import React from 'react';
import Avatar from '../../avatar/avatar';
import SelectDropdownOption from '../../select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../select-dropdown';

describe('Library Select Dropdown Component', () => {
  const value = 'Jon Snow';
  const avatarUrl = 'jon-snow.png';

  it('renders basic select dropdown', () => {
    const wrapper = shallow(<SelectDropdown value={value} avatarUrl={avatarUrl} />);

    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('img').length).toBe(0);
    expect(wrapper.find('p').length).toBe(0);
  });

  it('renders error and loading if present', () => {
    const error = 'White walkers breached the wall!';

    const wrapper = shallow(
      <SelectDropdown value={value} error={error} loading={true} children={[]} />,
    );

    wrapper.setState({ open: true });
    expect(wrapper.find('h4').length).toBe(2);
    expect(
      wrapper
        .find('h4')
        .at(1)
        .text(),
    ).toBe(error);
    expect(
      wrapper
        .find('h4')
        .at(1)
        .props().className,
    ).toBe('errorText');

    expect(wrapper.find(SelectDropdownOption).length).toBe(1);
    expect(wrapper.find(SelectDropdownOption).props().value).toBe('Loading...');
  });

  it('renders avatar and detail if present', () => {
    const detail = "Night's Watch";

    const wrapper = shallow(<SelectDropdown value={value} avatarUrl={avatarUrl} detail={detail} />);

    expect(wrapper.find(Avatar).length).toBe(1);
    expect(wrapper.find(Avatar).props().src).toBe(avatarUrl);
    expect(wrapper.find(Avatar).props().size).toBe('medium');
    expect(wrapper.find(Avatar).props().className).toBe('avatar');
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(`(${detail})`);
  });

  it('applies custom styles if specified', () => {
    const className = 'custom';

    const wrapper = shallow(
      <SelectDropdown value={value} loading={false} children={[]} className={className} />,
    );

    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe(`container ${className}`);
  });

  it('applies large font styles if specified', () => {
    const wrapper = shallow(
      <SelectDropdown value={value} avatarUrl={avatarUrl} largeFont={true} />,
    );

    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe('container largeFont');
    expect(wrapper.find(Avatar).props().className).toBe('avatar largeLeftMargin');
  });
});
