import { shallow } from 'enzyme';
import React from 'react';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import { CBO as CBOItem, CBO2 as CBOItem2 } from '../../../shared/util/test-data';
import { ROUTE_BASE } from '../builder-cbos';
import CBO from '../cbo';
import CBOs from '../cbos';

describe('Builder CBOs List Component', () => {
  const CBOId = CBOItem.id;
  const wrapper = shallow(<CBOs CBOId={CBOId} CBOItems={[]} />);

  it('returns empty placeholder if no CBOs', () => {
    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().icon).toBe('addBox');
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe('CBOs.empty');
  });

  it('renders CBOs if present', () => {
    wrapper.setProps({ CBOItems: [CBOItem, CBOItem2] });

    expect(wrapper.find(CBO).length).toBe(2);
    expect(
      wrapper
        .find(CBO)
        .at(0)
        .props().CBOItem,
    ).toEqual(CBOItem);
    expect(
      wrapper
        .find(CBO)
        .at(0)
        .props().selected,
    ).toBeTruthy();
    expect(
      wrapper
        .find(CBO)
        .at(0)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find(CBO)
        .at(1)
        .props().CBOItem,
    ).toEqual(CBOItem2);
    expect(
      wrapper
        .find(CBO)
        .at(1)
        .props().selected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(CBO)
        .at(1)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
  });
});
