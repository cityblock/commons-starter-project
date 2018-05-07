import { shallow } from 'enzyme';
import * as React from 'react';
import { Radar } from 'react-chartjs-2';
import Spinner from '../../../../shared/library/spinner/spinner';
import { fullRiskAreaGroup } from '../../../../shared/util/test-data';
import { black, dataOptions, getChartOptions, green } from '../radar-options';
import { ThreeSixtyRadar } from '../three-sixty-radar';

describe('Patient 360 Radar Chart', () => {
  const riskAreaGroups = [fullRiskAreaGroup];

  const wrapper = shallow(<ThreeSixtyRadar riskAreaGroups={riskAreaGroups} />);

  it('applies container styles', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders a radar chart', () => {
    expect(wrapper.find(Radar).length).toBe(1);
  });

  it('passes chart options to radar chart', () => {
    expect(wrapper.find(Radar).props().options).toEqual(getChartOptions([black]));
  });

  it('renders correct data', () => {
    expect(wrapper.find<any>(Radar).props().data.labels).toEqual([fullRiskAreaGroup.shortTitle]);
    expect(wrapper.find<any>(Radar).props().data.datasets[0]).toMatchObject(dataOptions);
    expect(wrapper.find<any>(Radar).props().data.datasets[0].data).toEqual([1]);
    expect(wrapper.find<any>(Radar).props().data.datasets[0].pointBackgroundColor).toEqual([green]);
  });

  it('renders loading spinner if no risk area groups yet', () => {
    wrapper.setProps({ riskAreaGroups: [] });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(Radar).length).toBe(0);
  });
});
