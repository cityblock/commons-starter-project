import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../library/button/button';
import { TaskCBOReferralView } from '../task-cbo-referral-view';

describe('Task CBO Referral view button', () => {
  const taskId = 'trainRhaegal';
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <TaskCBOReferralView generateJWTForPDF={placeholderFn} taskId={taskId} />,
  );

  it('renders a button to view CBO referral', () => {
    const button = wrapper.find(Button);

    expect(button.length).toBe(1);
    expect(button.props().color).toBe('white');
    expect(button.props().className).toBe('button');
    expect(button.props().messageId).toBe('CBO.viewForm');
    expect(button.props().icon).toBe('pictureAsPDF');
  });
});
