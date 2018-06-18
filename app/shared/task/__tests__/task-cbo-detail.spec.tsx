import { shallow } from 'enzyme';
import React from 'react';
import { formatAddress } from '../../helpers/format-helpers';
import DefaultText from '../../library/default-text/default-text';
import FormLabel from '../../library/form-label/form-label';
import Link from '../../library/link/link';
import { CBO as CBOItem, CBOReferral, CBOReferralOther } from '../../util/test-data';
import TaskCBODetail from '../task-cbo-detail';

describe('Task CBO Detail', () => {
  const { CBO } = CBOReferral;
  const wrapper = shallow(<TaskCBODetail CBOReferral={CBOReferral} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders label for CBO', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('task.CBO');
    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
    expect(wrapper.find(FormLabel).props().small).toBeTruthy();
  });

  it('renders name of CBO', () => {
    expect(wrapper.find('h3').length).toBe(2);
    expect(
      wrapper
        .find('h3')
        .at(0)
        .text(),
    ).toBe(CBOReferral.CBO.name);
  });

  it('renders address if CBO from preset list', () => {
    expect(
      wrapper
        .find('h3')
        .at(1)
        .text(),
    ).toBe(formatAddress(CBO.address, CBO.city, CBO.state, CBO.zip));
  });

  it('renders phone and fax if defined CBO', () => {
    expect(wrapper.find(DefaultText).length).toBe(4);
  });

  it('renders phone information', () => {
    expect(
      wrapper
        .find(DefaultText)
        .at(0)
        .props().messageId,
    ).toBe('CBO.phone');
    expect(
      wrapper
        .find(DefaultText)
        .at(0)
        .props().color,
    ).toBe('lightBlue');

    expect(
      wrapper
        .find(DefaultText)
        .at(1)
        .props().label,
    ).toBe(CBO.phone);
  });

  it('renders fax information', () => {
    expect(
      wrapper
        .find(DefaultText)
        .at(2)
        .props().messageId,
    ).toBe('CBO.fax');
    expect(
      wrapper
        .find(DefaultText)
        .at(2)
        .props().color,
    ).toBe('lightBlue');

    expect(
      wrapper
        .find(DefaultText)
        .at(3)
        .props().label,
    ).toBe(CBO.fax);
  });

  it('renders link to CBO', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(CBO.url);
    expect(wrapper.find(Link).props().newTab).toBeTruthy();
  });

  it('renders unknown fax information if fax not provided', () => {
    wrapper.setProps({
      CBOReferral: {
        ...CBOReferral,
        CBO: {
          ...CBOItem,
          fax: null,
        },
      },
    });

    expect(
      wrapper
        .find(DefaultText)
        .at(3)
        .props().messageId,
    ).toBe('CBO.noFax');
  });

  it('renders user provided name if other CBO', () => {
    wrapper.setProps({ CBOReferral: CBOReferralOther });

    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').text()).toBe(CBOReferralOther.name);
  });

  it('does not render contact information if other CBO', () => {
    expect(wrapper.find(DefaultText).length).toBe(0);
  });

  it('renders url provided by user for other CBO', () => {
    expect(wrapper.find(Link).props().to).toBe(CBOReferralOther.url);
  });
});
