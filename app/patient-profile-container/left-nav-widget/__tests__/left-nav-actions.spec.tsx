import { shallow } from 'enzyme';
import * as React from 'react';
import LeftNavAction from '../left-nav-action';
import LeftNavActions from '../left-nav-actions';

describe('Patient Left Navigation Action Buttons', () => {
  const wrapper = shallow(<LeftNavActions onClick={jest.fn()} />);

  it('renders all action options', () => {
    expect(wrapper.find(LeftNavAction).length).toBe(4);
  });

  it('renders button to view care team', () => {
    expect(
      wrapper
        .find(LeftNavAction)
        .at(0)
        .props().action,
    ).toBe('careTeam');
  });

  it('renders button to view scratch pad', () => {
    expect(
      wrapper
        .find(LeftNavAction)
        .at(1)
        .props().action,
    ).toBe('scratchPad');
  });

  it('renders button to send message', () => {
    expect(
      wrapper
        .find(LeftNavAction)
        .at(2)
        .props().action,
    ).toBe('message');
  });

  it('renders button to access quick actions', () => {
    expect(
      wrapper
        .find(LeftNavAction)
        .at(3)
        .props().action,
    ).toBe('quickActions');
  });
});
