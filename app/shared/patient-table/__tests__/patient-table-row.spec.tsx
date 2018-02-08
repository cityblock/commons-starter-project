import { shallow } from 'enzyme';
import * as React from 'react';
import { Link } from 'react-router-dom';
import PatientAge from '../../library/patient-age/patient-age';
import PatientTableRow from '../patient-table-row';

describe('Patient Table Row Component', () => {
  const firstName = 'Sansa';
  const lastName = 'Stark';
  const id = 'ladyOfWinterfell';
  const dateOfBirth = '2000-12-01 12:00:00+00:00';
  const gender = 'female';

  const getSearchResult = (userCareTeam: boolean) => ({
    firstName,
    lastName,
    id,
    dateOfBirth,
    patientInfo: {
      gender,
    },
    userCareTeam,
  });
  const query = 'sansa';

  const wrapper = shallow(<PatientTableRow query={query} patient={getSearchResult(true)} />);

  it('renders a link to the patient MAP', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`/patients/${id}/map/active`);
    expect(wrapper.find(Link).props().className).toBe('result');
  });

  it("renders a dot next to patient on user's care team", () => {
    expect(wrapper.find('.userCareTeam').length).toBe(1);
  });

  it('renders patient name', () => {
    expect(wrapper.find('h4').length).toBe(1);
    expect(wrapper.find('h4').props().className).toBe('name');
    expect(wrapper.find('h4').text()).toBe(`${firstName} ${lastName}`);
  });

  it('renders patient status', () => {
    expect(wrapper.find('.status').length).toBe(1);
  });

  it('renders patient member ID', () => {
    expect(wrapper.find('.memberId').length).toBe(1);
  });

  it('renders patient age information', () => {
    expect(wrapper.find(PatientAge).length).toBe(1);
    expect(wrapper.find(PatientAge).props().dateOfBirth).toBe(dateOfBirth);
    expect(wrapper.find(PatientAge).props().gender).toBe(gender);
  });

  it('renders patient address', () => {
    expect(wrapper.find('.address').length).toBe(1);
  });

  it("does not return dot if patient not on user's care team", () => {
    wrapper.setProps({ patient: getSearchResult(false) });
    expect(wrapper.find('.userCareTeam').length).toBe(0);
  });
});
