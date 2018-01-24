import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import Spinner from '../../../shared/library/spinner/spinner';
import { CBO } from '../../../shared/util/test-data';
import { AdminCBOs } from '../builder-cbos';
import CBODetail from '../cbo-detail';
import CBOs from '../cbos';

describe('Builder CBOs Component', () => {
  const CBOId = CBO.id;

  const CBO1 = {
    id: 'northernArmy',
  };
  const CBO3 = {
    id: 'greyjoyFleet',
  };
  const CBOItems = [CBO1, CBO, CBO3] as any;
  const history = { push: jest.fn() } as any;

  const wrapper = shallow(
    <AdminCBOs
      history={history}
      match={{} as any}
      CBOId={CBOId}
      CBOItems={CBOItems}
      loading={true}
      error={null}
    />,
  );

  it('renders loading spinner if loading', () => {
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(CBOs).length).toBe(0);
  });

  it('renders container', () => {
    wrapper.setProps({ loading: false });
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders button to add CBO', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('CBOs.create');
  });

  it('renders CBOs', () => {
    expect(wrapper.find(CBOs).length).toBe(1);
    expect(wrapper.find(CBOs).props().CBOId).toBe(CBOId);
    expect(wrapper.find(CBOs).props().CBOItems).toEqual(CBOItems);
  });

  it('renders CBO detail if CBO selected', () => {
    expect(wrapper.find(CBODetail).length).toBe(1);
    expect(wrapper.find(CBODetail).props().CBO).toEqual(CBO);
    expect(wrapper.find(CBODetail).props().createMode).toBeFalsy();
  });

  it('passes null to CBO detail if no CBO selected', () => {
    wrapper.setProps({ CBOId: null });
    expect(wrapper.find(CBODetail).props().CBO).toBeNull();
  });
});
