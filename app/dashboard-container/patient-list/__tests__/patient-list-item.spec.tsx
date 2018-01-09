import { shallow } from 'enzyme';
import * as React from 'react';
import { formatFullName } from '../../../shared/helpers/format-helpers';
import Icon from '../../../shared/library/icon/icon';
import { patient } from '../../../shared/util/test-data';
import { DEFAULT_AVATAR_URL, PatientListItem } from '../patient-list-item';

describe('Dashboard Patient List Item', () => {
  const placeholderFn = () => true as any;
  const wrapper = shallow(<PatientListItem patient={patient} redirectToPatient={placeholderFn} />);

  it('wraps item in link to patient profile', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders image of patient avatar', () => {
    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find('img').props().className).toBe('avatar');
    expect(wrapper.find('img').props().src).toBe(DEFAULT_AVATAR_URL);
  });

  it('renders patient full name', () => {
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').text()).toBe(formatFullName(patient.firstName, patient.lastName));
  });

  it('renders arrow link to patient profile', () => {
    expect(
      wrapper
        .find('div')
        .at(3)
        .props().className,
    ).toBe('profileLink');
  });

  it('renders arrow icon inside arrow link', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('keyboardArrowRight');
    expect(wrapper.find(Icon).props().className).toBe('arrow');
  });

  it('does not link to patient profile if viewing urgent tasks patient list', () => {
    wrapper.setProps({ taskView: true });
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container noCursor');
  });
});
