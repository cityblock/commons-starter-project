import { shallow } from 'enzyme';
import * as React from 'react';
import { AddQuickCall } from '../add-quick-call';
import LeftNavQuickAction from '../left-nav-quick-action';

describe('Patient Left Navigation Quick Action: Add Progress Note', () => {
  const placeholderFn = () => true as any;
  const patientId = 'aryaStark';

  const wrapper = shallow(
    <AddQuickCall
      patientId={patientId}
      openQuickCallPopup={placeholderFn}
      onClose={placeholderFn}
    />,
  );

  it('renders a left nav quick action to open progress note', () => {
    expect(wrapper.find(LeftNavQuickAction).props().quickAction).toBe('addQuickCall');
  });
});
