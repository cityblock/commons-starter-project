import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import UnderlineTab from '../../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../../shared/library/underline-tabs/underline-tabs';
import DomainSummaries from '../domain-summaries';
import { PatientThreeSixtyDomains } from '../patient-three-sixty-domains';
import PatientThreeSixtyHistory from '../patient-three-sixty-history';

describe('Patient 360 Domains Component', () => {
  const patientId = 'aryaStark';
  const routeBase = '/needle';

  const wrapper = shallow(
    <PatientThreeSixtyDomains
      patientId={patientId}
      routeBase={routeBase}
      riskAreaGroups={[]}
      history={false}
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

  it('renders body container', () => {
    expect(wrapper.find('.bodyFlex').length).toBe(1);
  });

  it('renders domain summaries', () => {
    expect(wrapper.find(DomainSummaries).length).toBe(1);
    expect(wrapper.find(DomainSummaries).props().patientId).toBe(patientId);
    expect(wrapper.find(DomainSummaries).props().routeBase).toBe(routeBase);
    expect(wrapper.find(DomainSummaries).props().riskAreaGroups).toEqual([]);
  });

  it('renders history tab if on history route', () => {
    wrapper.setProps({ history: true });

    expect(wrapper.find(PatientThreeSixtyHistory).length).toBe(1);
    expect(wrapper.find(PatientThreeSixtyHistory).props().patientId).toBe(patientId);
    expect(wrapper.find(DomainSummaries).length).toBe(0);
  });

  it('renders a spinner if loading', () => {
    wrapper.setProps({ riskAreaGroupsLoading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('.container').length).toBe(0);
  });
});
