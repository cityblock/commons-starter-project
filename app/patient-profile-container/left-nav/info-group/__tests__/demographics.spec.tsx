import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../../shared/util/test-data';
import InfoGroupContainer from '../container';
import Demographics from '../demographics';
import InfoGroupHeader from '../header';
import InfoGroupItem from '../item';

describe('Patient Left Nav Demographics', () => {
  const wrapper = shallow(
    <Demographics isOpen={false} onClick={() => true as any} patient={patient} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders info group header', () => {
    expect(wrapper.find(InfoGroupHeader).props().selected).toBe('demographics');
    expect(wrapper.find(InfoGroupHeader).props().isOpen).toBeFalsy();
  });

  it('renders info group container', () => {
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeFalsy();
  });

  it('renders info group item for date of birth', () => {
    expect(wrapper.find(InfoGroupItem).length).toBe(2);

    expect(
      wrapper
        .find(InfoGroupItem)
        .at(0)
        .props().labelMessageId,
    ).toBe('demographics.dateOfBirth');
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(0)
        .props().value,
    ).toBe('Jan 1, 1999');
  });

  it('renders info group for gender', () => {
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(1)
        .props().labelMessageId,
    ).toBe('demographics.gender');
    expect(
      wrapper
        .find(InfoGroupItem)
        .at(1)
        .props().valueMessageId,
    ).toBe(`gender.${patient.patientInfo.gender}`);
  });

  it('opens info group container and header', () => {
    wrapper.setProps({ isOpen: true });

    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
    expect(wrapper.find(InfoGroupContainer).props().isOpen).toBeTruthy();
  });
});
