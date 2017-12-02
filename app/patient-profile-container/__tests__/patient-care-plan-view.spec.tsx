import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { patient } from '../../shared/util/test-data';
import PatientCarePlanSuggestions from '../patient-care-plan-suggestions';
import { PatientCarePlanView } from '../patient-care-plan-view';
import PatientMap from '../patient-map';

describe('Patient Care Plan View Component', () => {
  const patientId = patient.id;
  const routeBase = '/patients';
  const placeholderFn = () => true as any;

  it('renders patient suggestions when on suggestions tab', () => {
    const match = { params: { patientId: patient.id, subTab: 'suggestions' as any } };
    const wrapper = shallow(<PatientCarePlanView match={match} addConcern={placeholderFn} />);

    const suggestions = wrapper.find(PatientCarePlanSuggestions);

    expect(suggestions.length).toBe(1);

    expect(wrapper.find(PatientMap).length).toBe(0);
  });

  it('renders patient MAP when on active tab', () => {
    const match = { params: { patientId: patient.id, subTab: 'active' as any } };
    const wrapper = shallow(<PatientCarePlanView match={match} addConcern={placeholderFn} />);

    const map = wrapper.find(PatientMap);

    expect(map.length).toBe(1);
    expect(map.props().routeBase).toBe(`${routeBase}/${patient.id}/map/active`);
    expect(map.props().patientId).toBe(patientId);

    expect(wrapper.find(PatientCarePlanSuggestions).length).toBe(0);
  });

  it('renders two tabs', () => {
    const match = { params: { patientId: patient.id, subTab: 'active' as any } };
    const wrapper = shallow(<PatientCarePlanView match={match} addConcern={placeholderFn} />);

    const tabs = wrapper.find(FormattedMessage);
    expect(tabs.length).toBe(2);
  });
});
