import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { task } from '../../../shared/util/test-data';
import PatientTask from '../patient-task';
import PatientTaskList from '../patient-task-list';

describe('Dashboard Patient Task List Component', () => {
  const messageId = 'valarMorghulis';
  const wrapper = shallow(
    <PatientTaskList messageId={messageId} tasks={[task]} withNotifications={false} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders formatted message for header', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });

  it('renders a patient task item', () => {
    expect(wrapper.find(PatientTask).length).toBe(1);
    expect(wrapper.find(PatientTask).props().task).toEqual(task);
    expect(wrapper.find(PatientTask).props().withNotifications).toBeFalsy();
  });
});
