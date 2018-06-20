import { shallow } from 'enzyme';
import React from 'react';
import Button from '../../../shared/library/button/button';
import UnderlineTab from '../../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../../shared/library/underline-tabs/underline-tabs';
import { basicInfo, coreIdentity, patient } from '../../../shared/util/test-data';
import PatientDemographics from '../patient-demographics';
import { PatientInfo, SelectableTabs } from '../patient-info';

const match = {
  params: {
    patientId: patient.id,
    subTab: 'demographics' as SelectableTabs,
  },
};

describe('Render Patient Info Component', () => {
  const editPatientInfo = jest.fn();
  const wrapper = shallow(
    <PatientInfo
      match={match}
      editPatientInfo={editPatientInfo}
      patient={patient}
      loading={false}
      error={null}
    />,
  );

  it('renders underline tabs for documents and demographics', () => {
    expect(wrapper.find(UnderlineTabs).length).toBe(1);
    expect(wrapper.find(UnderlineTab).length).toBe(2);
    expect(wrapper.find(Button).length).toBe(1);

    const routeBase = `/patients/${patient.id}/member-info`;
    const tab1 = wrapper
      .find(UnderlineTab)
      .at(0)
      .props();
    expect(tab1.messageId).toBe('patientInfo.demographics');
    expect(tab1.href).toBe(`${routeBase}/demographics`);
    expect(tab1.selected).toBeTruthy();

    const tab2 = wrapper
      .find(UnderlineTab)
      .at(1)
      .props();
    expect(tab2.messageId).toBe('patientInfo.documents');
    expect(tab2.href).toBe(`${routeBase}/documents`);
    expect(tab2.selected).toBeFalsy();

    expect(wrapper.find(Button).props().messageId).toBe('patientInfo.save');
  });

  it('renders demographics tab body', () => {
    expect(wrapper.find(PatientDemographics).length).toBe(1);

    const routeBase = `/patients/${patient.id}/member-info`;
    expect(wrapper.find(PatientDemographics).props().routeBase).toBe(routeBase);
    expect(wrapper.find(PatientDemographics).props().patientDemographics).toMatchObject({
      core: coreIdentity,
      basic: basicInfo,
    });
  });

  it('switches tabs', () => {
    wrapper.setProps({ match: { params: { patientId: patient.id, subTab: 'documents' } } });
    expect(
      wrapper
        .find(UnderlineTab)
        .at(0)
        .props().selected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(UnderlineTab)
        .at(1)
        .props().selected,
    ).toBeTruthy();
    expect(wrapper.find(PatientDemographics).length).toBe(0);
    expect(wrapper.find(Button).length).toBe(1);
  });
});
