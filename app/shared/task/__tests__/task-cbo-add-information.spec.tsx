import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../library/button/button';
import TaskCBOAddInformation from '../task-cbo-add-information';

describe('CBO Referral Task Add Information Button', () => {
  const taskId = 'defeatCersei';

  const wrapper = shallow(<TaskCBOAddInformation taskId={taskId} />);

  it('renders button to add information', () => {
    expect(wrapper.find(Button).length).toBe(1);
    expect(wrapper.find(Button).props().messageId).toBe('task.CBOAddInfo');
    expect(wrapper.find(Button).props().color).toBe('white');
    expect(wrapper.find(Button).props().className).toBe('button');
  });
});
