import { shallow } from 'enzyme';
import * as React from 'react';
import InfoGroupContainer from '../container';
import InfoGroupHeader from '../header';
import InfoGroupItem from '../item';
import Medications from '../medications';

describe('Patient Left Nav Medications Accordion', () => {
  const wrapper = shallow(<Medications isOpen={false} onClick={() => true as any} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders info group header', () => {
    expect(wrapper.find(InfoGroupHeader).props().selected).toBe('medications');
    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeFalsy();
    expect(wrapper.find(InfoGroupHeader).props().itemCount).toBe(4);
  });

  it('renders info group container', () => {
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeFalsy();
  });

  it('renders info group items for each medication', () => {
    expect(wrapper.find(InfoGroupItem).length).toBe(4);
  });

  it('opens info group container and header', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
  });
});
