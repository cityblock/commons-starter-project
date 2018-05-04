import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import { CareTeamMattermost } from '../care-team-mattermost';

describe('Left Nav Care Team Mattermost', () => {
  const patientId = 'aryaStark';

  const wrapper = shallow(
    <CareTeamMattermost patientId={patientId} getMattermostLink={() => true as any} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders people icon', () => {
    expect(wrapper.find('.iconContainer').length).toBe(1);

    expect(wrapper.find(Icon).props().name).toBe('people');
    expect(wrapper.find(Icon).props().color).toBe('blue');
  });

  it('renders header text', () => {
    expect(wrapper.find(SmallText).length).toBe(2);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().messageId,
    ).toBe('careTeam.chat');
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
        .props().color,
    ).toBe('black');
  });

  it('renders detail text', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().messageId,
    ).toBe('careTeam.chatDetail');
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
        .props().color,
    ).toBe('black');
  });

  it('renders divider', () => {
    expect(wrapper.find('.divider').length).toBe(1);
  });
});