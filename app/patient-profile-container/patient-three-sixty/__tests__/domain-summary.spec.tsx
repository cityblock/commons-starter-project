import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import DateInfo from '../../../shared/library/date-info/date-info';
import Icon from '../../../shared/library/icon/icon';
import { riskAreaGroup } from '../../../shared/util/test-data';
import { DomainSummary } from '../domain-summary';
import DomainSummaryBullets from '../domain-summary-bullets';

describe('Patient 360 Domain Summary', () => {
  const routeBase = '/needle';
  const patientId = 'aryaStark';
  const glassBreakId = 'nymeria';
  const risk = 'high';
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <DomainSummary
      routeBase={routeBase}
      patientId={patientId}
      riskAreaGroup={riskAreaGroup}
      riskAreaGroupId={riskAreaGroup.id}
      risk={risk}
      updateRiskAreaGroupScore={placeholderFn}
      glassBreakId={glassBreakId}
      loading={false}
      error={null}
    />,
  );

  it('renders link to domain detail view', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${riskAreaGroup.id}`);
    expect(wrapper.find(Link).props().className).toBe('domain redBorder');
  });

  it('renders icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('does not render date info if no last updated', () => {
    expect(wrapper.find(DateInfo).length).toBe(0);
  });

  it('renders domain title', () => {
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').text()).toBe(riskAreaGroup.title);
  });

  it('renders domain summary bullets', () => {
    expect(wrapper.find(DomainSummaryBullets).length).toBe(1);
    expect(wrapper.find(DomainSummaryBullets).props().automatedSummaryText).toEqual([]);
    expect(wrapper.find(DomainSummaryBullets).props().manualSummaryText).toEqual([]);
    expect(wrapper.find(DomainSummaryBullets).props().screeningToolResultSummaries).toEqual([]);
    expect(wrapper.find(DomainSummaryBullets).props().isRiskCalculated).toBeTruthy();
  });

  it('renders date info if last updated', () => {
    const lastUpdated = 'notToday';
    wrapper.setState({ lastUpdated });

    expect(wrapper.find(DateInfo).length).toBe(1);
    expect(wrapper.find(DateInfo).props().label).toBe('updated');
    expect(wrapper.find(DateInfo).props().date).toBe(lastUpdated);
  });

  it('links directly to assessment if no automated assessments', () => {
    const id = 'lady';
    const riskAreaGroup2 = cloneDeep(riskAreaGroup);
    riskAreaGroup2.riskAreas = [
      {
        id,
        questions: [],
        screeningTools: [],
      },
    ] as any;
    wrapper.setProps({ riskAreaGroup: riskAreaGroup2 });
    expect(wrapper.find(Link).props().to).toBe(
      `${routeBase}/${riskAreaGroup2.id}/assessment/${id}`,
    );
  });
});
