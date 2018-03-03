import { shallow } from 'enzyme';
import * as React from 'react';
import { Radar } from 'react-chartjs-2';
import Spinner from '../../../../shared/library/spinner/spinner';
import { riskAreaGroup } from '../../../../shared/util/test-data';
import { black, dataOptions, getChartOptions, gray, mediumValue, yellow } from '../radar-options';
import ThreeSixtyRadar from '../three-sixty-radar';

describe('Patient 360 Radar Chart', () => {
  const title = 'Winter Is Coming';
  const riskAreaGroups = [
    {
      totalScore: 60,
      forceHighRisk: false,
      id: riskAreaGroup.id,
      title: riskAreaGroup.title,
      mediumRiskThreshold: riskAreaGroup.mediumRiskThreshold,
      highRiskThreshold: riskAreaGroup.highRiskThreshold,
    },
    {
      totalScore: null,
      forceHighRisk: false,
      id: 'night-king',
      title,
      mediumRiskThreshold: riskAreaGroup.mediumRiskThreshold,
      highRiskThreshold: riskAreaGroup.highRiskThreshold,
    },
  ];

  const wrapper = shallow(<ThreeSixtyRadar riskAreaGroups={riskAreaGroups} />);

  it('applies container styles', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders a radar chart', () => {
    expect(wrapper.find(Radar).length).toBe(1);
  });

  it('passes chart options to radar chart', () => {
    expect(wrapper.find(Radar).props().options).toEqual(getChartOptions([black, gray]));
  });

  it('renders correct data', () => {
    expect(wrapper.find(Radar).props().data.labels).toEqual([riskAreaGroup.title, title]);
    expect(wrapper.find(Radar).props().data.datasets[0]).toMatchObject(dataOptions);
    expect(wrapper.find(Radar).props().data.datasets[0].data).toEqual([mediumValue, NaN]);
    expect(wrapper.find(Radar).props().data.datasets[0].pointBackgroundColor).toEqual([yellow, ""]);
  });

  it('renders loading spinner if no risk area groups yet', () => {
    wrapper.setProps({ riskAreaGroups: [] });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(Radar).length).toBe(0);
  });
});
