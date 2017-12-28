import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../shared/library/button/button';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import { patient } from '../../shared/util/test-data';
import PatientCarePlanSuggestions from '../patient-care-plan-suggestions';
import { PatientCarePlanView } from '../patient-care-plan-view';
import PatientMap, { IProps } from '../patient-map';

describe('Patient Care Plan View Component', () => {
  const patientId = patient.id;
  const routeBase = '/patients';
  const placeholderFn = () => true as any;
  const match = { params: { patientId: patient.id, subTab: 'active' as any } };
  const wrapper = shallow(
    <PatientCarePlanView
      match={match}
      addConcern={placeholderFn}
      isPopupOpen={false}
      closePopup={placeholderFn}
    />,
  );

  it('renders patient MAP when on active tab', () => {
    const map = wrapper.find<IProps>(PatientMap);

    expect(map.length).toBe(1);
    expect(map.props().routeBase).toBe(`${routeBase}/${patient.id}/map/active`);
    expect(map.props().patientId).toBe(patientId);

    expect(wrapper.find(PatientCarePlanSuggestions).length).toBe(0);
  });

  it('renders two tabs', () => {
    const tabs = wrapper.find(UnderlineTab);
    expect(tabs.length).toBe(2);
  });

  it('renders button to add concern', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('concernCreate.addConcern');
  });

  it('renders patient suggestions when on suggestions tab', () => {
    const match2 = { params: { patientId: patient.id, subTab: 'suggestions' as any } };
    const wrapper2 = shallow(
      <PatientCarePlanView
        match={match2}
        addConcern={placeholderFn}
        isPopupOpen={false}
        closePopup={placeholderFn}
      />,
    );

    expect(wrapper2.find(PatientCarePlanSuggestions).length).toBe(1);
    expect(wrapper2.find(PatientMap).length).toBe(0);
  });
});
