import { shallow } from 'enzyme';
import * as React from 'react';
import Avatar from '../../../shared/library/avatar/avatar';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import { user } from '../../../shared/util/test-data';
import CareTeamMember from '../care-team-member';

describe('Patient Left Navigation Care Team Member', () => {
  const wrapper = shallow(
    <CareTeamMember
      careTeamMember={user}
      handleClick={() => true as any}
      isSelected={false}
      isLead={false}
    />,
  );

  it('renders container for content', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders user avatar', () => {
    expect(wrapper.find(Avatar).props().src).toBe(user.googleProfileImageUrl);
    expect(wrapper.find(Avatar).props().size).toBe('large');
  });

  it('renders user name', () => {
    expect(wrapper.find(SmallText).length).toBe(2);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().isBold,
    ).toBeTruthy();
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().size,
    ).toBe('largest');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe('first last');
  });

  it('renders formatted care team member role', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().isBold,
    ).toBeFalsy();
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe('Physician');
  });

  it('does not render lead star by default', () => {
    expect(wrapper.find(Icon).length).toBe(0);
  });

  it('renders divider', () => {
    expect(wrapper.find('.divider').length).toBe(1);
  });

  it('renders star icon if care team lead', () => {
    wrapper.setProps({ isLead: true });

    expect(wrapper.find(Icon).props().name).toBe('stars');
    expect(wrapper.find(Icon).props().color).toBe('blue');
  });
});
