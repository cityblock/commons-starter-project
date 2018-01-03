import { shallow } from 'enzyme';
import * as React from 'react';
import DomainSummaries from '../domain-summaries';
import DomainSummary from '../domain-summary';

describe('Patient 360 Domain Summaries', () => {
  const patientId = 'sansaStark';
  const routeBase = '/lady/of/winterfell';
  const id1 = 'nymeria';
  const id2 = 'ghost';
  const id3 = 'greyWind';

  const riskAreaGroupScores = {
    [id1]: {
      forceHighRisk: true,
      totalScore: 0,
    },
    [id2]: {
      forceHighRisk: false,
      totalScore: 9000,
    },
    [id3]: {
      forceHighRisk: false,
      totalScore: 3,
    },
  };

  const riskAreaGroups = [
    {
      id: id1,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    {
      id: id2,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
    },
    {
      id: id3,
      mediumRiskThreshold: 4,
      highRiskThreshold: 8,
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
});
