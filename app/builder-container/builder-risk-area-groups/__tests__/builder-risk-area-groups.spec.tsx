import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import { AdminRiskAreaGroups } from '../builder-risk-area-groups';
import RiskAreaGroups from '../risk-area-groups';

describe('Builder Risk Area Groups Component', () => {
  const riskAreaGroupId = 'ghost';

  const wrapper = shallow(
    <AdminRiskAreaGroups match={{} as any} riskAreaGroupId={riskAreaGroupId} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders button to add risk area group', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('riskAreaGroup.create');
  });

  it('renders risk area groups', () => {
    expect(wrapper.find(RiskAreaGroups).length).toBe(1);
    expect(wrapper.find(RiskAreaGroups).props().riskAreaGroupId).toBe(riskAreaGroupId);
  });
});
