import { shallow } from 'enzyme';
import * as React from 'react';
import { riskAreaGroup } from '../../../shared/util/test-data';
import RiskAreaGroupDetail from '../risk-area-group-detail';
import RiskAreaGroupEdit from '../risk-area-group-edit';

describe('Builder Risk Area Group Detail', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(<RiskAreaGroupDetail close={placeholderFn} riskAreaGroup={null} />);

  it('renders nothing if no risk area group selected', () => {
    expect(wrapper.instance()).toBeNull();
    expect(wrapper.find(RiskAreaGroupEdit).length).toBe(0);
  });

  it('renders risk area group edit if risk area group present', () => {
    wrapper.setProps({ riskAreaGroup });

    expect(wrapper.find(RiskAreaGroupEdit).length).toBe(1);
    expect(wrapper.find(RiskAreaGroupEdit).props().riskAreaGroup).toEqual(riskAreaGroup);
  });
});
