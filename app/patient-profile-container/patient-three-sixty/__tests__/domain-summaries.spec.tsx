import { shallow } from 'enzyme';
import * as React from 'react';
import { fullRiskAreaGroup } from '../../../shared/util/test-data';
import { DomainSummaries } from '../domain-summaries';
import { DomainSummary } from '../domain-summary';
import { IProps, ThreeSixtyRadar } from '../three-sixty-radar/three-sixty-radar';

describe('Patient 360 Domain Summaries', () => {
  const patientId = 'sansaStark';
  const routeBase = '/lady/of/winterfell';

  const riskAreaGroups = [fullRiskAreaGroup];

  const wrapper = shallow(
    <DomainSummaries
      patientId={patientId}
      routeBase={routeBase}
      riskAreaGroups={riskAreaGroups}
      glassBreakId="lady"
    />,
  );

  it('renders domain summaries', () => {
    expect(wrapper.find(DomainSummary).length).toBe(1);
  });

  it('renders first domain summary', () => {
    expect(
      wrapper
        .find(DomainSummary)
        .at(0)
        .props().routeBase,
    ).toBe(routeBase);
    expect(
      wrapper
        .find(DomainSummary)
        .at(0)
        .props().patientId,
    ).toBe(patientId);
  });

  it('renders three sixty radar chart', () => {
    const radar = wrapper.find<IProps>(ThreeSixtyRadar as any);
    expect(radar.length).toBe(1);
  });
});
