import { shallow } from 'enzyme';
import * as React from 'react';
import { Gender } from '../../../../graphql/types';
import { formatAgeDetails, formatDateOfBirth } from '../../../helpers/format-helpers';
import PatientAge from '../patient-age';

describe('Library Patient Age Component', () => {
  const dateOfBirth = '2000-12-01 12:00:00+00:00';
  const gender = Gender.female;

  const wrapper = shallow(<PatientAge dateOfBirth={dateOfBirth} gender={gender} />);

  it('renders patient date of birth', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').props().className).toBe('dateOfBirth');
    expect(wrapper.find('p').text()).toBe(
      `${formatDateOfBirth(dateOfBirth)}${formatAgeDetails(dateOfBirth, gender)}`,
    );
  });

  it('renders a span of age and gender', () => {
    expect(wrapper.find('span').text()).toBe(`${formatAgeDetails(dateOfBirth, gender)}`);
    expect(wrapper.find('span').props().className).toBe('ageDetail');
  });
});
