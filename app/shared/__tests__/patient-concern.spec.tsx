import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcernStats from '../concerns/concern-stats/concern-stats';
import PatientConcernOptions from '../concerns/options-menu/options-menu';
import PatientConcern from '../concerns/patient-concern';
import PatientGoal from '../goals/goal';
import { patientConcern } from '../util/test-data';

describe('Patient Concern Component', () => {
  const onClick = () => true;
  const selectedTaskId = 'aryaStark';

  const wrapper = shallow(
    <PatientConcern
      patientConcern={patientConcern}
      selected={true}
      onClick={onClick}
      selectedTaskId={selectedTaskId}
      isDragging={true}
    />,
  );

  it('renders concern title', () => {
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').text()).toBe(patientConcern.concern.title);
  });

  it('renders patient concern stats', () => {
    expect(wrapper.find(PatientConcernStats).length).toBe(1);

    expect(wrapper.find(PatientConcernStats).props().goalCount).toBe(1);
    expect(wrapper.find(PatientConcernStats).props().taskCount).toBe(1);
    expect(wrapper.find(PatientConcernStats).props().createdAt).toBe(patientConcern.createdAt);
    expect(wrapper.find(PatientConcernStats).props().lastUpdated).toBe(patientConcern.updatedAt);
    expect(wrapper.find(PatientConcernStats).props().inactive).toBeFalsy();
  });

  it('renders patient goals', () => {
    expect(wrapper.find(PatientGoal).length).toBe(1);
    expect(wrapper.find(PatientGoal).props().patientGoal).toBe(patientConcern.patientGoals[0]);
    expect(wrapper.find(PatientGoal).props().goalNumber).toBe(1);
  });

  it('applies selected styles if specified', () => {
    expect(wrapper.find('.selected').length).toBe(1);
  });

  it('does not apply inactive styles if not inactive', () => {
    expect(wrapper.find('.inactive').length).toBe(0);
  });

  it('renders options menu', () => {
    expect(wrapper.find(PatientConcernOptions).length).toBe(1);
  });
});
