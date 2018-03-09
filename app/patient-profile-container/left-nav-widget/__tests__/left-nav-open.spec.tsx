import { shallow } from 'enzyme';
import * as React from 'react';
import LeftNavHeader from '../left-nav-header';
import LeftNavOpen from '../left-nav-open';

describe('Patient Left Navigation Open Component', () => {
  const patientId = 'khalDrogo';

  const wrapper = shallow(
    <LeftNavOpen patientId={patientId} selected={null} onClose={() => true as any} isOpen={false} />,
  );

  it('renders the closed left navigation', () => {
    expect(wrapper.find('div').props().className).toBe('container collapsed');
  });

  it('does not render the left navigation header when closed', () => {
    expect(wrapper.find(LeftNavHeader).length).toBe(0);
  });

  it('opens the left navigation', () => {
    wrapper.setProps({ selected: 'careTeam', isOpen: true });

    expect(wrapper.find('div').props().className).toBe('container expanded');
  });

  it('renders the left navigation header when open', () => {
    expect(wrapper.find(LeftNavHeader).props().selected).toBe('careTeam');
  });
});
