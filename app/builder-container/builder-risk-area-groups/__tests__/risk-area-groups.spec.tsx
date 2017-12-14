import { shallow } from 'enzyme';
import * as React from 'react';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import { ROUTE_BASE } from '../builder-risk-area-groups';
import RiskAreaGroup from '../risk-area-group';
import RiskAreaGroups from '../risk-area-groups';

describe('Builder Risk Area Groups List Component', () => {
  const riskAreaGroupId = 'drogon';
  const wrapper = shallow(<RiskAreaGroups riskAreaGroupId={riskAreaGroupId} riskAreaGroups={[]} />);

  it('returns empty placeholder if no risk area groups', () => {
    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().icon).toBe('addBox');
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe('riskAreaGroup.empty');
  });

  it('renders risk area groups if present', () => {
    const riskAreaGroup1 = {
      title: 'No one knows how to ride the green dragon',
      id: 'rhaegal',
    };
    const riskAreaGroup2 = {
      title: 'This dragon be moody',
      id: 'drogon',
    };

    wrapper.setProps({ riskAreaGroups: [riskAreaGroup1, riskAreaGroup2] });

    expect(wrapper.find(RiskAreaGroup).length).toBe(2);
    expect(
      wrapper
        .find(RiskAreaGroup)
        .at(0)
        .props().riskAreaGroup,
    ).toEqual(riskAreaGroup1);
    expect(
      wrapper
        .find(RiskAreaGroup)
        .at(0)
        .props().selected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(RiskAreaGroup)
        .at(0)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find(RiskAreaGroup)
        .at(1)
        .props().riskAreaGroup,
    ).toEqual(riskAreaGroup2);
    expect(
      wrapper
        .find(RiskAreaGroup)
        .at(1)
        .props().selected,
    ).toBeTruthy();
    expect(
      wrapper
        .find(RiskAreaGroup)
        .at(1)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
  });
});
