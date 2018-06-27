import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
import { CareTeamMemberContact } from '../care-team-member-contact';

describe('Patient Left Navigation Care Team Contact', () => {
  const careTeamMemberId = 'sansaStark';
  const firstName = 'Sansa';

  const wrapper = shallow(
    <CareTeamMemberContact
      careTeamMemberId={careTeamMemberId}
      firstName={firstName}
      isVisible={true}
      email="sansa@cityblock.com"
      getMattermostLink={jest.fn()}
    />,
  );

  it('renders container styles correctly if visible', () => {
    expect(wrapper.find('.container').props().className).toBe('container expanded');
  });

  it('renders mattermost icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('mattermost');
  });

  it('renders small text to mattermost care team member', () => {
    expect(wrapper.find(Text).length).toBe(1);

    expect(wrapper.find(Text).props().messageId).toBe('careTeam.mattermost');
    expect(wrapper.find(Text).props().messageValues).toEqual({ name: firstName });
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().size).toBe('medium');
  });

  it('applies collapsed styles if not visible', () => {
    wrapper.setProps({ isVisible: false });

    expect(wrapper.find('.container').props().className).toBe('container collapsed');
  });
});
