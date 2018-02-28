import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { user } from '../../../shared/util/test-data';
import CareTeam from '../care-team';
import CareTeamList from '../care-team-list';
import ContactList from '../contact-list';

describe('Printable MAP care team (right pane)', () => {
  const wrapper = shallow(<CareTeam careTeam={[user]} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders care team list', () => {
    expect(wrapper.find(CareTeamList).props().careTeam).toEqual([user]);
  });

  it('renders contact list', () => {
    expect(wrapper.find(ContactList).props().leadFirstName).toBe(user.firstName);
    expect(wrapper.find(ContactList).props().leadPhone).toBe('142-719-8667');
    expect(wrapper.find(ContactList).props().careTeamPhone).toBe('371-402-0313');
  });
});
