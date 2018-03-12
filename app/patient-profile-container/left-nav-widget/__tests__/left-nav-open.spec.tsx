import { shallow } from 'enzyme';
import * as React from 'react';
import LeftNavHeader from '../left-nav-header';
import LeftNavOpen from '../left-nav-open';
import LeftNavQuickActions from '../left-nav-quick-actions';
import LeftNavScratchPad, { IProps } from '../left-nav-scratchpad';

describe('Patient Left Navigation Open Component', () => {
  const patientId = 'khalDrogo';
  const glassBreakId = 'silver';

  const wrapper = shallow(
    <LeftNavOpen
      patientId={patientId}
      selected={null}
      onClose={() => true as any}
      isOpen={false}
      glassBreakId={glassBreakId}
    />,
  );

  it('renders the closed left navigation', () => {
    expect(wrapper.find('.container').props().className).toBe('container collapsed');
  });

  it('does not render the left navigation components when closed', () => {
    expect(wrapper.find(LeftNavHeader).length).toBe(0);
    expect(wrapper.find(LeftNavScratchPad).length).toBe(0);
  });

  it('opens the left navigation', () => {
    wrapper.setProps({ selected: 'careTeam', isOpen: true });

    expect(wrapper.find('.container').props().className).toBe('container expanded');
  });

  it('renders the left navigation header when open', () => {
    expect(wrapper.find(LeftNavHeader).props().selected).toBe('careTeam');
  });

  it('renders container for content', () => {
    expect(wrapper.find('.content').length).toBe(1);
  });

  it('renders scratch pad if selected', () => {
    wrapper.setProps({ selected: 'scratchPad' });

    expect(wrapper.find<IProps>(LeftNavScratchPad).props().patientId).toBe(patientId);
    expect(wrapper.find<IProps>(LeftNavScratchPad).props().glassBreakId).toBe(glassBreakId);
  });

  it('renders quick actions if selected', () => {
    wrapper.setProps({ selected: 'quickActions' });

    expect(wrapper.find(LeftNavQuickActions).props().patientId).toBe(patientId);
    expect(wrapper.find(LeftNavQuickActions).props().glassBreakId).toBe(glassBreakId);
  });
});
