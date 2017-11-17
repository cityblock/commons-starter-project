import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PatientCarePlanSuggestions from '../patient-care-plan-suggestions';
import { IProps, PatientCarePlanView } from '../patient-care-plan-view';
import PatientMap from '../patient-map';

describe('Patient Care Plan View Component', () => {
  const patientId = 'aryaStark';
  const routeBase = '/patients';

  it('renders patient suggestions when on suggestions tab', () => {
    const wrapper = shallow(
      <PatientCarePlanView patientId={patientId} routeBase={routeBase} subTabId="suggestions" />,
    );

    const suggestions = wrapper.find<IProps>(PatientCarePlanSuggestions);

    expect(suggestions.length).toBe(1);
    expect(suggestions.props().routeBase).toBe(routeBase);
    expect(suggestions.props().patientId).toBe(patientId);

    expect(wrapper.find(PatientMap).length).toBe(0);
  });

  it('renders patient MAP when on active tab tab', () => {
    const wrapper = shallow(<PatientCarePlanView patientId={patientId} routeBase={routeBase} />);

    const suggestions = wrapper.find(PatientMap);

    expect(suggestions.length).toBe(1);
    expect(suggestions.props().routeBase).toBe(`${routeBase}/active`);
    expect(suggestions.props().patientId).toBe(patientId);

    expect(wrapper.find(PatientCarePlanSuggestions).length).toBe(0);
  });

  it('renders two tabs', () => {
    const wrapper = shallow(<PatientCarePlanView patientId={patientId} routeBase={routeBase} />);

    const tabs = wrapper.find(FormattedMessage);
    expect(tabs.length).toBe(2);
  });
});
