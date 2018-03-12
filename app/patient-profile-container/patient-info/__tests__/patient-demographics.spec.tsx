import { shallow } from 'enzyme';
import * as React from 'react';
import {
  advancedDirectives,
  basicInfo,
  contactInfo,
  coreIdentity,
} from '../../../shared/util/test-data';
import BasicInfo from '../basic-info';
import ContactInfo from '../contact-info';
import CoreIdentity from '../core-identity';
import PatientDemographics from '../patient-demographics';

describe('Render Patient Demographics Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <PatientDemographics
      patient={{
        core: coreIdentity,
        basic: basicInfo,
        contact: contactInfo,
        advanced: advancedDirectives,
      }}
      routeBase={'/foo/bar'}
      onChange={onChange}
    />,
  );

  it('renders basic info', () => {
    expect(wrapper.find(BasicInfo)).toHaveLength(1);
  });

  it('renders core identity', () => {
    expect(wrapper.find(CoreIdentity)).toHaveLength(1);
    expect(wrapper.find(CoreIdentity).props().patientIdentity).toBe(coreIdentity);
  });

  it('renders contact info', () => {
    expect(wrapper.find(ContactInfo)).toHaveLength(1);
    expect(wrapper.find(ContactInfo).props().contactInfo).toBe(contactInfo);
  });
});
