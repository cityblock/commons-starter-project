import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import HeaderText from '../../shared/header-text';
import ContactList from '../contact-list';
import copy from '../copy/copy';
import TextGroup from '../text-group';

describe('Printable MAP contact list', () => {
  const leadFirstName = 'Arya';
  const leadPhone = '(123) 456-7890';
  const careTeamPhone = '(212) 555-1234';

  const wrapper = shallow(
    <ContactList
      leadFirstName={leadFirstName}
      leadPhone={leadPhone}
      careTeamPhone={careTeamPhone}
    />,
  );

  it('renders container view', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders header text for contact section', () => {
    expect(wrapper.find(HeaderText).props().label).toBe(copy.contact);
  });

  it('renders phone number of care team lead', () => {
    expect(wrapper.find(TextGroup).length).toBe(2);

    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().label,
    ).toBe(`${copy.textOrCall} Arya:`);
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().value,
    ).toBe(leadPhone);
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().fullWidth,
    ).toBeTruthy();
  });

  it('renders phone number of general care team', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().label,
    ).toBe(`${copy.textOrCall} ${copy.careTeam}`);
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().value,
    ).toBe(careTeamPhone);
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().fullWidth,
    ).toBeTruthy();
  });
});
