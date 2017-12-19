import { shallow } from 'enzyme';
import * as React from 'react';
import UnderlineTab from '../../underline-tab/underline-tab';
import UnderlineTabs from '../underline-tabs';

describe('Library Underline Tabs Component', () => {
  const messageId = 'chaosIsALatter';
  const messageId2 = 'bendTheKnee';

  const wrapper = shallow(
    <UnderlineTabs>
      <UnderlineTab messageId={messageId} selected={false} />
      <UnderlineTab messageId={messageId2} selected={true} />
    </UnderlineTabs>,
  );

  it('renders container for tabs', () => {
    expect(wrapper.find('.tabs').length).toBe(1);
  });

  it('renders nested individual tabs', () => {
    expect(wrapper.find(UnderlineTab).length).toBe(2);
    expect(wrapper.find(UnderlineTab).at(0).props().messageId).toBe(messageId);
    expect(wrapper.find(UnderlineTab).at(0).props().selected).toBeFalsy();
    expect(wrapper.find(UnderlineTab).at(1).props().messageId).toBe(messageId2);
    expect(wrapper.find(UnderlineTab).at(1).props().selected).toBeTruthy();
  });

  it('makes tabs container white if specified', () => {
    wrapper.setProps({ color: 'white' });
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('div').props().className).toBe('tabs white');
  });
});
