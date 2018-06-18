import { shallow } from 'enzyme';
import React from 'react';
import { formatAddress } from '../../../helpers/format-helpers';
import DefaultText from '../../../library/default-text/default-text';
import Link from '../../../library/link/link';
import { CBO as CBOItem } from '../../../util/test-data';
import CreateTaskCBODetail from '../cbo-detail';

describe('Create Task Modal CBO Detail', () => {
  const wrapper = shallow(<CreateTaskCBODetail CBO={CBOItem} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders name of CBO', () => {
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').text()).toBe(CBOItem.name);
  });

  it('renders formatted address', () => {
    expect(wrapper.find(DefaultText).length).toBe(5);
    expect(
      wrapper
        .find(DefaultText)
        .at(0)
        .props().label,
    ).toBe(formatAddress(CBOItem.address, CBOItem.city, CBOItem.state, CBOItem.zip));
  });

  it('renders label for phone', () => {
    expect(
      wrapper
        .find(DefaultText)
        .at(1)
        .props().messageId,
    ).toBe('CBO.phone');
    expect(
      wrapper
        .find(DefaultText)
        .at(1)
        .props().color,
    ).toBe('lightBlue');
  });

  it('renders phone number', () => {
    expect(
      wrapper
        .find(DefaultText)
        .at(2)
        .props().label,
    ).toBe(CBOItem.phone);
  });

  it('renders label for fax', () => {
    expect(
      wrapper
        .find(DefaultText)
        .at(3)
        .props().messageId,
    ).toBe('CBO.fax');
    expect(
      wrapper
        .find(DefaultText)
        .at(3)
        .props().color,
    ).toBe('lightBlue');
  });

  it('renders fax number', () => {
    expect(
      wrapper
        .find(DefaultText)
        .at(4)
        .props().label,
    ).toBe(CBOItem.fax);
  });

  it('renders link to CBO website', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().label).toBe(CBOItem.url);
    expect(wrapper.find(Link).props().className).toBe('link');
    expect(wrapper.find(Link).props().newTab).toBeTruthy();
  });

  it('renders placeholder for unknown fax if needed', () => {
    wrapper.setProps({
      CBO: {
        ...CBOItem,
        fax: null,
      },
    });

    expect(
      wrapper
        .find(DefaultText)
        .at(4)
        .props().messageId,
    ).toBe('CBO.noFax');
  });
});
