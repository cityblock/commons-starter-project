import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../shared/library/spinner/spinner';
import Text from '../../shared/library/text/text';
import { currentUser, currentUserHours } from '../../shared/util/test-data';
import SettingsLeftRail from '../left-rail';
import { SettingsContainer } from '../settings-container';

describe('Settings Container Component', () => {
  const wrapper = shallow(
    <SettingsContainer currentUser={currentUser} currentUserHours={currentUserHours} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders header text', () => {
    expect(wrapper.find(Text).props().messageId).toBe('settings.settings');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().font).toBe('baseticaBold');
    expect(wrapper.find(Text).props().isHeader).toBeTruthy();
  });

  it('renders divider', () => {
    expect(wrapper.find('.divider').length).toBe(1);
  });

  it('renders settings left rail', () => {
    expect(wrapper.find(SettingsLeftRail).props().currentUser).toEqual(currentUser);
  });

  it('renders spinner if loading', () => {
    wrapper.setProps({ userLoading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(Text).length).toBe(0);
  });
});
