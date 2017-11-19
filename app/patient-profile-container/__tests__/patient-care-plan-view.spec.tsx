import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { patient } from '../../shared/util/test-data';
import PatientCarePlanSuggestions from '../patient-care-plan-suggestions';
import { allProps, PatientCarePlanView } from '../patient-care-plan-view';
import { PatientMap } from '../patient-map';

describe('Patient Care Plan View Component', () => {
  const patientId = patient.id;
  const routeBase = '/patients';

  it('renders patient suggestions when on suggestions tab', () => {
    const match = { params: { patientId: patient.id, subTab: 'suggestions' as any } };
    const wrapper = shallow(<PatientCarePlanView match={match} />);

    const suggestions = wrapper.find<allProps>(PatientCarePlanSuggestions);

    expect(suggestions.length).toBe(1);

    expect(wrapper.find(PatientMap).length).toBe(0);
  });

  it('renders patient MAP when on active tab tab', () => {
    const match = { params: { patientId: patient.id, subTab: 'active' as any } };
    const wrapper = shallow(<PatientCarePlanView match={match} />);

    const suggestions = wrapper.find(PatientMap);

    expect(suggestions.length).toBe(1);
    expect(suggestions.props().routeBase).toBe(`${routeBase}/${patient.id}/map/active`);
    expect(suggestions.props().patientId).toBe(patientId);

    expect(wrapper.find(PatientCarePlanSuggestions).length).toBe(0);
  });

  it('renders two tabs', () => {
    const match = { params: { patientId: patient.id, subTab: 'active' as any } };
    const wrapper = shallow(<PatientCarePlanView match={match} />);

    const tabs = wrapper.find(FormattedMessage);
    expect(tabs.length).toBe(2);
  });
});
