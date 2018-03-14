import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { nonLeadUserForCareTeam, userForCareTeam } from '../../../shared/util/test-data';
import CareTeam from '../care-team';
import CareTeamList from '../care-team-list';
import ContactList from '../contact-list';

describe('Printable MAP care team (right pane)', () => {
  const wrapper = shallow(<CareTeam careTeam={[userForCareTeam]} />);

  it('renders view container', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders care team list', () => {
    expect(wrapper.find(CareTeamList).props().careTeam).toEqual([userForCareTeam]);
  });

  it('renders contact list', () => {
    wrapper.setProps({ careTeam: [nonLeadUserForCareTeam, userForCareTeam] });
    expect(wrapper.find(ContactList).props().leadFirstName).toBe(userForCareTeam.firstName);
    expect(wrapper.find(ContactList).props().leadPhone).toBe(userForCareTeam.phone);
    expect(wrapper.find(ContactList).props().careTeamPhone).toBe('371-402-0313');
  });
});
