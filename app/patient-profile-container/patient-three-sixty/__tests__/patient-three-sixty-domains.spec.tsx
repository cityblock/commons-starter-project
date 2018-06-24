import { shallow } from 'enzyme';
import React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import UnderlineTab from '../../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../../shared/library/underline-tabs/underline-tabs';
import { fullRiskAreaGroup } from '../../../shared/util/test-data';
import { DomainSummaries } from '../domain-summaries';
import { PatientThreeSixtyDomains } from '../patient-three-sixty-domains';

describe('Patient 360 Domains Component', () => {
  const patientId = 'aryaStark';
  const routeBase = '/patients/aryaStark/360';
  const wrapper = shallow(
    <PatientThreeSixtyDomains
      patientId={patientId}
      riskAreaGroups={[fullRiskAreaGroup]}
      glassBreakId="nymeria"
      loading={false}
    />,
  );

  it('renders tabs for patient 360', () => {
    expect(wrapper.find(UnderlineTabs).length).toBe(1);
    expect(wrapper.find(UnderlineTab).length).toBe(2);
    expect(
      wrapper
        .find(UnderlineTab)
        .at(0)
        .props().messageId,
    ).toBe('threeSixty.summary');
    expect(
      wrapper
        .find(UnderlineTab)
        .at(0)
        .props().href,
    ).toBe(routeBase);
    expect(
      wrapper
        .find(UnderlineTab)
        .at(1)
        .props().messageId,
    ).toBe('threeSixty.history');
  });

  it('renders domain summaries', () => {
    expect(wrapper.find(DomainSummaries).length).toBe(1);
    expect(wrapper.find(DomainSummaries).props().patientId).toBe(patientId);
    expect(wrapper.find(DomainSummaries).props().routeBase).toBe(routeBase);
  });

  it('renders a spinner if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('.container').length).toBe(0);
  });
});
