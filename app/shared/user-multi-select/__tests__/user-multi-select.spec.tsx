import { shallow } from 'enzyme';
import React from 'react';
import SelectDropdownOption from '../../library/select-dropdown-option/select-dropdown-option';
import SelectDropdown from '../../library/select-dropdown/select-dropdown';
import UserMultiSelect from '../user-multi-select';

describe('Care Team Multi Select', () => {
  const placeholderFn = jest.fn();
  const name = 'careMember';
  const placeholderMessageId = 'something.id';

  const user1 = {
    id: 'id1',
    name: 'Martin Blank',
    role: 'Primary_Care_Physician',
    email: 'user1@cityblock.com',
    avatar: 'https://avatar1.com',
  };

  const user2 = {
    id: 'id2',
    name: 'Jenny Blank',
    role: 'Community_Health_Partner',
    email: 'user2@cityblock.com',
    avatar: 'https://avatar2.com',
  };

  const wrapper = shallow(
    <UserMultiSelect
      onChange={placeholderFn}
      selectedUsers={[]}
      users={[user1, user2]}
      placeholderMessageId={placeholderMessageId}
      name={name}
      isLoading={false}
    />,
  );

  it('renders select component', () => {
    expect(wrapper.find(SelectDropdown)).toHaveLength(1);

    const dropdownProps = wrapper.find(SelectDropdown).props();
    expect(dropdownProps.value).toBe('');
    expect(dropdownProps.largeFont).toBeTruthy();
    expect(dropdownProps.loading).toBeFalsy();
    expect(dropdownProps.error).toBeFalsy();
    expect(dropdownProps.placeholderMessageId).toBe(placeholderMessageId);
  });

  it('renders select options', () => {
    expect(wrapper.find(SelectDropdownOption)).toHaveLength(2);

    const option1Props = wrapper
      .find(SelectDropdownOption)
      .at(0)
      .props();
    expect(option1Props.avatarUrl).toBe(user1.avatar);
    expect(option1Props.value).toBe(user1.name);
    expect(option1Props.detail).toBe(user1.role);
    expect(option1Props.detailMessageId).toBeFalsy();

    const option2Props = wrapper
      .find(SelectDropdownOption)
      .at(1)
      .props();
    expect(option2Props.avatarUrl).toBe(user2.avatar);
    expect(option2Props.value).toBe(user2.name);
    expect(option2Props.detail).toBe(user2.role);
    expect(option2Props.detailMessageId).toBeFalsy();
  });

  it('renders displays selected users', () => {
    wrapper.setProps({ selectedUsers: [user1] });
    expect(wrapper.find(SelectDropdown)).toHaveLength(1);

    const dropdownProps = wrapper.find(SelectDropdown).props();
    expect(dropdownProps.value).toBe('');

    expect(wrapper.find(SelectDropdownOption)).toHaveLength(1);
    expect(wrapper.find(SelectDropdownOption).props().value).toBe(user2.name);

    const userField = wrapper.find('div.user');
    expect(userField).toHaveLength(1);
    expect(userField.find('h4').text()).toBe(user1.name);
  });
});
