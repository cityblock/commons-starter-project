import { shallow } from 'enzyme';
import * as React from 'react';
import SelectDropdownOption from '../../select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../select-dropdown';

describe('Library Select Dropdown Component', () => {
  const value = 'Jon Snow';

  it('renders basic select dropdown', () => {
    const wrapper = shallow(<SelectDropdown value={value} />);

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
    const avatarUrl = 'jon-snow.png';
    const detail = "Night's Watch";

    const wrapper = shallow(<SelectDropdown value={value} avatarUrl={avatarUrl} detail={detail} />);

    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find('img').props().src).toBe(avatarUrl);
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(`(${detail})`);
  });
});
