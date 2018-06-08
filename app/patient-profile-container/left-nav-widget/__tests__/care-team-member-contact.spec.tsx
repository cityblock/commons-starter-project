import { shallow } from 'enzyme';
import * as React from 'react';
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
      getMattermostLink={() => true as any}
    />,
  );

  it('renders container styles correctly if visible', () => {
    expect(wrapper.find('.container').props().className).toBe('container expanded');
  });

  it('renders phone icon', () => {
    expect(wrapper.find(Icon).length).toBe(2);

    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().name,
    ).toBe('phone');
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().color,
    ).toBe('black');
  });

  it('renders small text to call care team member', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('careTeam.call');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageValues,
    ).toEqual({ name: firstName });
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().size,
    ).toBe('medium');
  });

  it('renders mattermost icon', () => {
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().name,
    ).toBe('mattermost');
  });

  it('renders small text to mattermost care team member', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageId,
    ).toBe('careTeam.mattermost');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageValues,
    ).toEqual({ name: firstName });
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().size,
    ).toBe('medium');
  });

  it('applies collapsed styles if not visible', () => {
    wrapper.setProps({ isVisible: false });

    expect(wrapper.find('.container').props().className).toBe('container collapsed');
  });
});
