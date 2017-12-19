import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import UnderlineTab from '../../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../../shared/library/underline-tabs/underline-tabs';
import { PatientThreeSixtyDomains } from '../patient-three-sixty-domains';

describe('Patient 360 Domains Component', () => {
  const patientId = 'aryaStark';
  const routeBase = '/needle';

  const wrapper = shallow(
    <PatientThreeSixtyDomains
      patientId={patientId}
      routeBase={routeBase}
      riskAreaGroups={[]}
    />,
  );

  it('renders tabs for patient 360', () => {
    expect(wrapper.find(UnderlineTabs).length).toBe(1);
    expect(wrapper.find(UnderlineTab).length).toBe(2);
    expect(wrapper.find(UnderlineTab).at(0).props().messageId).toBe('threeSixty.summary');
    expect(wrapper.find(UnderlineTab).at(0).props().href).toBe(routeBase);
    expect(wrapper.find(UnderlineTab).at(1).props().messageId).toBe('threeSixty.history');
  });

  it('renders a spinner if loading', () => {
    wrapper.setProps({ riskAreaGroupsLoading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find('.container').length).toBe(0);
  });
});
