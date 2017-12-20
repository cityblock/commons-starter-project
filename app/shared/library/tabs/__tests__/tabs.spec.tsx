import { shallow } from 'enzyme';
import * as React from 'react';
import Tab from '../../tab/tab';
import Tabs from '../tabs';

describe('Library Tabs Component', () => {
  const messageId = 'chaosIsALatter';
  const messageId2 = 'bendTheKnee';

  const wrapper = shallow(
    <Tabs>
      <Tab messageId={messageId} selected={false} />
      <Tab messageId={messageId2} selected={true} />
    </Tabs>,
  );

  it('renders container for tabs', () => {
    expect(wrapper.find('.tabs').length).toBe(1);
  });

  it('renders nested individual tabs', () => {
    expect(wrapper.find(Tab).length).toBe(2);
    expect(
      wrapper
        .find(Tab)
        .at(0)
        .props().messageId,
    ).toBe(messageId);
    expect(
      wrapper
        .find(Tab)
        .at(0)
        .props().selected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Tab)
        .at(1)
        .props().messageId,
    ).toBe(messageId2);
    expect(
      wrapper
        .find(Tab)
        .at(1)
        .props().selected,
    ).toBeTruthy();
  });

  it('makes tabs container white if specified', () => {
    wrapper.setProps({ color: 'white' });
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('div').props().className).toBe('tabs white');
  });
});
