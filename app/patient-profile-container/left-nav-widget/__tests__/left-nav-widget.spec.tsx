import { shallow } from 'enzyme';
import * as React from 'react';
import LeftNavActions from '../left-nav-actions';
import LeftNavOpen from '../left-nav-open';
import { LeftNavWidget } from '../left-nav-widget';

describe('Patient Left Navigation Widget', () => {
  const patientId = 'sansaStark';
  const glassBreakId = 'lady';

  const wrapper = shallow(
    <LeftNavWidget
      patientId={patientId}
      glassBreakId={glassBreakId}
      updateSelected={jest.fn()}
      selected={null}
    />,
  );

  it('renders left navigation component', () => {
    expect(wrapper.find(LeftNavOpen).props().patientId).toBe(patientId);
    expect(wrapper.find(LeftNavOpen).props().selected).toBeFalsy();
    expect(wrapper.find(LeftNavOpen).props().isOpen).toBeFalsy();
  });

  it('opens left navigation', () => {
    wrapper.setProps({ selected: 'careTeam' });
    wrapper.setState({ isOpen: true });

    expect(wrapper.find(LeftNavOpen).props().selected).toBe('careTeam');
    expect(wrapper.find(LeftNavOpen).props().isOpen).toBeTruthy();
    expect(wrapper.find(LeftNavOpen).props().patientId).toBe(patientId);
    expect(wrapper.find(LeftNavOpen).props().glassBreakId).toBe(glassBreakId);
  });

  it('renders left navigation action buttons', () => {
    expect(wrapper.find(LeftNavActions).length).toBe(1);
  });
});
