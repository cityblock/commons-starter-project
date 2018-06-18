import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router-dom';
import DateInfo from '../../../shared/library/date-info/date-info';
import Icon from '../../../shared/library/icon/icon';
import { automatedRiskArea, fullRiskAreaGroup, riskArea } from '../../../shared/util/test-data';
import { DomainSummary } from '../domain-summary';
import DomainSummaryBullets from '../domain-summary-bullets';

describe('Patient 360 Domain Summary', () => {
  const routeBase = '/needle';
  const patientId = 'aryaStark';
  const glassBreakId = 'nymeria';

  const wrapper = shallow(
    <DomainSummary
      routeBase={routeBase}
      patientId={patientId}
      riskAreaGroup={fullRiskAreaGroup}
      glassBreakId={glassBreakId}
    />,
  );

  it('renders link to domain detail view for automated assessments', () => {
    wrapper.setProps({ riskAreaGroup: { ...fullRiskAreaGroup, riskAreas: [automatedRiskArea] } });
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${fullRiskAreaGroup.id}`);
    expect(wrapper.find(Link).props().className).toBe('domain greenBorder');
  });

  it('renders icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders date info', () => {
    expect(wrapper.find(DateInfo).length).toBe(1);
  });

  it('renders domain title', () => {
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').text()).toBe(fullRiskAreaGroup.title);
  });

  it('renders domain summary bullets', () => {
    expect(wrapper.find(DomainSummaryBullets).length).toBe(1);
    expect(wrapper.find(DomainSummaryBullets).props().automatedSummaryText).toEqual([]);
    expect(wrapper.find(DomainSummaryBullets).props().manualSummaryText).toEqual([]);
    expect(wrapper.find(DomainSummaryBullets).props().screeningToolResultSummaries).toEqual([
      {
        description: 'dire wolf in dire straits ',
        score: 4,
        title: 'result summary',
      },
    ]);
  });

  it('links directly to assessment if no automated assessments', () => {
    wrapper.setProps({ riskAreaGroup: { ...fullRiskAreaGroup, riskAreas: [riskArea] } });
    expect(wrapper.find(Link).props().to).toBe(
      `${routeBase}/${fullRiskAreaGroup.id}/assessment/${riskArea.id}`,
    );
  });
});
