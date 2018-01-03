import { shallow } from 'enzyme';
import * as React from 'react';
import DomainSummaries, { LoadableThreeSixtyRadar } from '../domain-summaries';
import DomainSummary from '../domain-summary';
import { IProps } from '../three-sixty-radar/three-sixty-radar';

describe('Patient 360 Domain Summaries', () => {
  const patientId = 'sansaStark';
  const routeBase = '/lady/of/winterfell';
  const id1 = 'nymeria';
  const id2 = 'ghost';
  const id3 = 'greyWind';
  const score1 = {
    forceHighRisk: true,
    totalScore: 0,
  };
  const score2 = {
    forceHighRisk: false,
    totalScore: 9000,
  };
  const score3 = {
    forceHighRisk: false,
    totalScore: 3,
  };

  const riskAreaGroupScores = {
    [id1]: score1,
    [id2]: score2,
    [id3]: score3,
  };

  const title1 = "Robb Stark's Direwolf";
  const title2 = "Sansa Stark's Direwolf";
  const title3 = "Arya Stark's Direwolf";
  const riskThresholds = {
    mediumRiskThreshold: 4,
    highRiskThreshold: 8,
  };

  const riskAreaGroups = [
    {
      id: id1,
      title: title1,
      ...riskThresholds,
    },
    {
      id: id2,
      title: title2,
      ...riskThresholds,
    },
    {
      id: id3,
      title: title3,
      ...riskThresholds,
    },
  ] as any;

  const wrapper = shallow(
    <DomainSummaries patientId={patientId} routeBase={routeBase} riskAreaGroups={riskAreaGroups} />,
  );

  wrapper.setState(riskAreaGroupScores);

  it('renders domain summaries', () => {
    expect(wrapper.find(DomainSummary).length).toBe(3);
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
    expect(
      wrapper
        .find(DomainSummary)
        .at(0)
        .props().riskAreaGroupId,
    ).toBe(id1);
    expect(
      wrapper
        .find(DomainSummary)
        .at(0)
        .props().risk,
    ).toBe('high');
  });

  it('renders second domain summary', () => {
    expect(
      wrapper
        .find(DomainSummary)
        .at(1)
        .props().routeBase,
    ).toBe(routeBase);
    expect(
      wrapper
        .find(DomainSummary)
        .at(1)
        .props().patientId,
    ).toBe(patientId);
    expect(
      wrapper
        .find(DomainSummary)
        .at(1)
        .props().riskAreaGroupId,
    ).toBe(id2);
    expect(
      wrapper
        .find(DomainSummary)
        .at(1)
        .props().risk,
    ).toBe('high');
  });

  it('renders third domain summary', () => {
    expect(
      wrapper
        .find(DomainSummary)
        .at(2)
        .props().routeBase,
    ).toBe(routeBase);
    expect(
      wrapper
        .find(DomainSummary)
        .at(2)
        .props().patientId,
    ).toBe(patientId);
    expect(
      wrapper
        .find(DomainSummary)
        .at(2)
        .props().riskAreaGroupId,
    ).toBe(id3);
    expect(
      wrapper
        .find(DomainSummary)
        .at(2)
        .props().risk,
    ).toBe('low');
  });

  it('renders three sixty radar chart', () => {
    wrapper.setState({ ...riskAreaGroupScores });

    const radar = wrapper.find<IProps>(LoadableThreeSixtyRadar);
    expect(radar.length).toBe(1);
    expect(radar.props().riskAreaGroups).toEqual([
      {
        ...score1,
        ...riskThresholds,
        title: title1,
      },
      {
        ...score2,
        ...riskThresholds,
        title: title2,
      },
      {
        ...score3,
        ...riskThresholds,
        title: title3,
      },
    ]);
  });
});
