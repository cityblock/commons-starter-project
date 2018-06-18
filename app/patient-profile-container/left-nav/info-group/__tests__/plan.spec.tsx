import { shallow } from 'enzyme';
import React from 'react';
import { patient } from '../../../../shared/util/test-data';
import InfoGroupContainer from '../container';
import InfoGroupHeader from '../header';
import InfoGroupItem from '../item';
import Plan from '../plan';

describe('Patient Left Nav Plan Accordion', () => {
  const wrapper = shallow(<Plan isOpen={false} onClick={jest.fn()} patient={patient} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders info group header', () => {
    expect(wrapper.find(InfoGroupHeader).props().selected).toBe('plan');
    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeFalsy();
  });

  it('renders info group container', () => {
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeFalsy();
  });

  it('renders info group item for Cityblock ID', () => {
    expect(wrapper.find(InfoGroupItem).length).toBe(4);

    expect(
      wrapper
        .find(InfoGroupItem)
        .at(0)
        .props().labelMessageId,
    ).toBe('plan.cityblockId');
  });

  it('renders info group for insurance carrier', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(1)
        .props().labelMessageId,
    ).toBe('plan.insurance');
  });

  it('renders info group for insurance plan description', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(2)
        .props().labelMessageId,
    ).toBe('plan.planDescription');
  });

  it('renders info group for insurance member id', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(3)
        .props().labelMessageId,
    ).toBe('plan.memberId');
  });

  it('opens info group container and header', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
  });
});
