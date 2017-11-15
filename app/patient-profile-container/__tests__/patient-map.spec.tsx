import { shallow } from 'enzyme';
import * as React from 'react';
import Task from '../../shared/task/task';
import PatientCarePlan from '../patient-care-plan';
import { PatientMap } from '../patient-map';

describe('Patient Map Component', () => {
  const patientId = 'sansaStark';
  const routeBase = '/patients/sansaStark/map';

  const wrapper = shallow(<PatientMap patientId={patientId} routeBase={routeBase} />);

  it('renders patient care plan', () => {
    const carePlan = wrapper.find(PatientCarePlan);

    expect(carePlan.length).toBe(1);
    expect(carePlan.props().routeBase).toBe(routeBase);
    expect(carePlan.props().patientId).toBe(patientId);
  });

  it('makes care plan full view when no task present', () => {
    expect(wrapper.find('.full').length).toBe(1);
    expect(wrapper.find('.collapsed').length).toBe(1);
    expect(wrapper.find(Task).length).toBe(0);
  });

  describe('Expanded Task View', () => {
    const taskId = 'littlefinger';

    const wrapper2 = shallow(
      <PatientMap patientId={patientId} routeBase={routeBase} taskId={taskId} />,
    );

    it('renders associated task', () => {
      const task = wrapper2.find(Task);

      expect(task.length).toBe(1);
      expect(task.props().routeBase).toBe(routeBase);
    });

    it('renders patient care plan and task in split screen view', () => {
      expect(wrapper2.find('.split').length).toBe(2);
      expect(wrapper2.find('.full').length).toBe(0);
    });
  });
});
