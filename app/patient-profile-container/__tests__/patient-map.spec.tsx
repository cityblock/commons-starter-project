import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import Task from '../../shared/task/task';
import PatientCarePlanDnD, { allProps } from '../drag-and-drop/patient-care-plan';
import MapModals from '../modals/modals';
import { PatientMap } from '../patient-map';

describe('Patient Map Component', () => {
  const patientId = 'sansaStark';
  const routeBase = '/patients/sansaStark/map';
  const taskId = 'sansaStark';
  const closeTask = () => true as any;

  const wrapper = shallow(
    <PatientMap patientId={patientId} routeBase={routeBase} closeTask={closeTask} taskId="" />,
  );

  it('renders patient care plan', () => {
    expect((wrapper.find(PatientCarePlanDnD) as ShallowWrapper<allProps>).length).toBe(1);
    expect(wrapper.find(PatientCarePlanDnD).props().routeBase).toBe(routeBase);
    expect(wrapper.find(PatientCarePlanDnD).props().patientId).toBe(patientId);
    expect(wrapper.find(PatientCarePlanDnD).props().selectedTaskId).toBeFalsy();
  });

  it('makes care plan full view when no task present', () => {
    expect(wrapper.find('.full').length).toBe(1);
    expect(wrapper.find('.collapsed').length).toBe(1);
    expect(wrapper.find(Task).length).toBe(0);
  });

  describe('Expanded Task View', () => {
    const wrapper2 = shallow(
      <PatientMap
        patientId={patientId}
        routeBase={routeBase}
        taskId={taskId}
        closeTask={closeTask}
      />,
    );

    it('renders associated task', () => {
      // fails TS checks now because of wrapper component
      const task = wrapper2.find(Task) as any;

      expect(task.length).toBe(1);
      expect(task.props().routeBase).toBe(routeBase);
    });

    it('renders patient care plan and task in split screen view', () => {
      expect(wrapper2.find('.split').length).toBe(2);
      expect(wrapper2.find('.full').length).toBe(0);
    });

    it('indicates to patient care plan that task is selected', () => {
      expect(wrapper2.find(PatientCarePlanDnD).props().selectedTaskId).toBe(taskId);
    });

    it('renders patient MAP modals', () => {
      expect(wrapper.find(MapModals).length).toBe(1);
    });
  });
});
