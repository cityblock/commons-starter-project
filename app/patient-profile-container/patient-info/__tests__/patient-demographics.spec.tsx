import { shallow } from 'enzyme';
import * as React from 'react';
import { basicInfo, coreIdentity } from '../../../shared/util/test-data';
import BasicInformation from '../basic-information';
import CoreIdentity from '../core-identity';
import PatientDemographics from '../patient-demographics';

describe('Render Patient Demographics Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <PatientDemographics
      patient={{
        core: coreIdentity,
        basic: basicInfo,
      }}
      routeBase={'/foo/bar'}
      onChange={onChange}
    />,
  );

  it('renders basic info', () => {
    expect(wrapper.find(BasicInformation).length).toBe(1);
    expect(wrapper.find(BasicInformation).props().patientInformation).toBe(basicInfo);
    expect(wrapper.find(BasicInformation).props().onChange).toBe(onChange);
  });

  it('renders core identity', () => {
    expect(wrapper.find(CoreIdentity).length).toBe(1);
    expect(wrapper.find(CoreIdentity).props().patientIdentity).toBe(coreIdentity);
  });
});
