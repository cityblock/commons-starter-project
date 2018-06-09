import { shallow } from 'enzyme';
import * as React from 'react';
import { AdministerScreeningTool } from '../administer-screening-tool';
import LeftNavQuickAction from '../left-nav-quick-action';

describe('Patient Left Navigation Quick Action: Administer Screening Tool', () => {
  const placeholderFn = jest.fn();
  const patientId = 'aryaStark';

  const wrapper = shallow(
    <AdministerScreeningTool
      patientId={patientId}
      openScreeningToolsPopup={placeholderFn}
      onClose={placeholderFn}
    />,
  );

  it('renders a left nav quick action to administer screening tool', () => {
    expect(wrapper.find(LeftNavQuickAction).props().quickAction).toBe('administerTool');
  });
});
