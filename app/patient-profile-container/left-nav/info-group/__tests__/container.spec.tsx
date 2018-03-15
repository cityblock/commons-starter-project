import { shallow } from 'enzyme';
import * as React from 'react';
import InfoGroupContainer from '../container';
import InfoGroupItem from '../item';

describe('Patient Left Navigation Info Group Container', () => {
  const labelMessageId = 'kingInTheNorth';
  const value = 'Jon Snow';

  const wrapper = shallow(
    <InfoGroupContainer isOpen={false}>
      <InfoGroupItem labelMessageId={labelMessageId} value={value} />
    </InfoGroupContainer>,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('sets height to zero if not open', () => {
    expect(wrapper.find('.container').props().style!.height).toBe('0');
  });

  it('renders info group item children', () => {
    expect(wrapper.find(InfoGroupItem).props().labelMessageId).toBe(labelMessageId);
    expect(wrapper.find(InfoGroupItem).props().value).toBe(value);
  });

  it('sets height appropriately if open', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find('.container').props().style!.height).toBe('58px');
  });
});
