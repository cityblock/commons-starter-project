import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import Spinner from '../../../shared/library/spinner/spinner';
import { riskAreaGroup } from '../../../shared/util/test-data';
import { AdminRiskAreaGroups } from '../builder-risk-area-groups';
import RiskAreaGroupDetail from '../risk-area-group-detail';
import RiskAreaGroups from '../risk-area-groups';

describe('Builder Risk Area Groups Component', () => {
  const riskAreaGroupId = 'ghost';
  const placeholderFn = () => true as any;

  const riskAreaGroup1 = {
    id: 'nymeria',
  };
  const riskAreaGroup3 = {
    id: 'lady',
  };
  const riskAreaGroups = [riskAreaGroup1, riskAreaGroup, riskAreaGroup3] as any;

  const wrapper = shallow(
    <AdminRiskAreaGroups
      match={{} as any}
      riskAreaGroupId={riskAreaGroupId}
      riskAreaGroups={riskAreaGroups}
      redirectToRiskAreaGroups={placeholderFn}
      loading={true}
      error={null}
    />,
  );

  it('renders loading spinner if loading', () => {
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(RiskAreaGroups).length).toBe(0);
  });

  it('renders container', () => {
    wrapper.setProps({ loading: false });
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders button to add risk area group', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('riskAreaGroup.create');
  });

  it('renders risk area groups', () => {
    expect(wrapper.find(RiskAreaGroups).length).toBe(1);
    expect(wrapper.find(RiskAreaGroups).props().riskAreaGroupId).toBe(riskAreaGroupId);
    expect(wrapper.find(RiskAreaGroups).props().riskAreaGroups).toEqual(riskAreaGroups);
  });

  it('renders risk area group detail if risk area group selected', () => {
    expect(wrapper.find(RiskAreaGroupDetail).length).toBe(1);
    expect(wrapper.find(RiskAreaGroupDetail).props().riskAreaGroup).toBe(riskAreaGroup);
  });

  it('passes null to risk area group detail if no risk area group selected', () => {
    wrapper.setProps({ riskAreaGroupId: null });
    expect(wrapper.find(RiskAreaGroupDetail).props().riskAreaGroup).toBeNull();
  });
});
