import { shallow } from 'enzyme';
import * as React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { adminTasksConcernTitle } from '../../../../server/lib/consts';
import PatientCarePlan from '../../patient-care-plan';
import { DnDPatientCarePlan as Component } from '../patient-care-plan';

describe('Drag and Drop Patient Care Plan Wrapper Component', () => {
  const routeBase = '/charmander';
  const patientId = 'bulbasaur';
  const selectedTaskId = '';
  const patientConcernBulkEdit = () => true as any;

  const activeConcern1 = {
    id: 'activeConcern1',
    concern: { title: 'Active Concern 1 Title' },
    startedAt: 11,
  };
  const activeConcern2 = {
    id: 'activeConcern2',
    concern: { title: 'Active Concern 2 Title' },
    startedAt: 11,
  };
  const activeConcern3 = {
    id: 'activeConcern3',
    concern: { title: adminTasksConcernTitle },
    startedAt: 11,
  };
  const inactiveConcern1 = {
    id: 'inactiveConcern1',
    concern: { title: 'Inactive Concern 1 Title' },
    startedAt: null,
  };
  const inactiveConcern2 = {
    id: 'inactiveConcern2',
    concern: { title: 'Inactive Concern 2 Title' },
    startedAt: null,
  };

  const allConcerns = [
    activeConcern1,
    inactiveConcern1,
    activeConcern2,
    inactiveConcern2,
    activeConcern3,
  ];

  const carePlan = {
    concerns: allConcerns,
  } as any;

  const wrapper = shallow(
    <Component
      routeBase={routeBase}
      patientId={patientId}
      selectedTaskId={selectedTaskId}
      carePlan={carePlan}
      patientConcernBulkEdit={patientConcernBulkEdit}
    />,
  );

  it('does not style as dragging by default', () => {
    expect(wrapper.find('div').props().className).toBeFalsy();
  });

  it('renders drag drop context', () => {
    expect(wrapper.find(DragDropContext).length).toBe(1);
  });

  it('renders wrapped patient care plan', () => {
    expect(wrapper.find(PatientCarePlan).length).toBe(1);
    expect(wrapper.find(PatientCarePlan).props().loading).toBeFalsy();
    expect(wrapper.find(PatientCarePlan).props().routeBase).toBe(routeBase);
    expect(wrapper.find(PatientCarePlan).props().patientId).toBe(patientId);
    expect(wrapper.find(PatientCarePlan).props().selectedTaskId).toBe(selectedTaskId);
    expect(wrapper.find(PatientCarePlan).props().activeConcerns).toEqual([]);
    expect(wrapper.find(PatientCarePlan).props().inactiveConcerns).toEqual([]);
  });

  it('updates active and inactive concerns when received', () => {
    wrapper.setProps({ carePlan });

    expect(wrapper.find(PatientCarePlan).props().activeConcerns).toEqual([
      activeConcern1,
      activeConcern2,
      activeConcern3,
    ]);
    expect(wrapper.find(PatientCarePlan).props().inactiveConcerns).toEqual([
      inactiveConcern1,
      inactiveConcern2,
    ]);
  });

  it('styles component with dragging styles when dragging', () => {
    wrapper.setState({ isDragging: true });

    expect(wrapper.find('div').props().className).toBe('draggable');
  });

  const instance = wrapper.instance() as Component;

  it('does nothing if dragging outside of valid area', () => {
    instance.onDragEnd({ destination: null } as any);

    expect(wrapper.state('activeConcerns')).toEqual([
      activeConcern1,
      activeConcern2,
      activeConcern3,
    ]);
    expect(wrapper.state('inactiveConcerns')).toEqual([inactiveConcern1, inactiveConcern2]);
  });

  it('updates active concerns after re-ordering within list', () => {
    const result = {
      source: {
        droppableId: 'activeConcerns',
        index: 0,
      },
      destination: {
        droppableId: 'activeConcerns',
        index: 1,
      },
    } as any;

    instance.onDragEnd(result);

    expect(wrapper.state('activeConcerns')).toEqual([
      activeConcern2,
      activeConcern1,
      activeConcern3,
    ]);
    expect(wrapper.state('inactiveConcerns')).toEqual([inactiveConcern1, inactiveConcern2]);
  });

  it('updates inactive concerns after re-ordering within list', () => {
    const result = {
      source: {
        droppableId: 'inactiveConcerns',
        index: 0,
      },
      destination: {
        droppableId: 'inactiveConcerns',
        index: 1,
      },
    } as any;

    instance.onDragEnd(result);

    expect(wrapper.state('activeConcerns')).toEqual([
      activeConcern2,
      activeConcern1,
      activeConcern3,
    ]);
    expect(wrapper.state('inactiveConcerns')).toEqual([inactiveConcern2, inactiveConcern1]);
  });

  it('moves a concern from active to inactive', () => {
    const result = {
      source: {
        droppableId: 'activeConcerns',
        index: 0,
      },
      destination: {
        droppableId: 'inactiveConcerns',
        index: 1,
      },
      draggableId: 'activeConcern2',
    } as any;

    instance.onDragEnd(result);

    expect(wrapper.state('activeConcerns')).toEqual([activeConcern1, activeConcern3]);
    expect(wrapper.state('inactiveConcerns')).toEqual([
      inactiveConcern2,
      activeConcern2,
      inactiveConcern1,
    ]);
  });

  it('moves a concern from inactive to active', () => {
    const result = {
      source: {
        droppableId: 'inactiveConcerns',
        index: 2,
      },
      destination: {
        droppableId: 'activeConcerns',
        index: 0,
      },
      draggableId: 'inactiveConcern1',
    } as any;

    instance.onDragEnd(result);

    expect(wrapper.state('activeConcerns')).toEqual([
      inactiveConcern1,
      activeConcern1,
      activeConcern3,
    ]);
    expect(wrapper.state('inactiveConcerns')).toEqual([inactiveConcern2, activeConcern2]);
  });

  it('does not move the admin tasks concern from active to inactive', () => {
    // activeConcern3 is the admin tasks concern
    const result = {
      source: {
        droppableId: 'activeConcerns',
        index: 2,
      },
      destination: {
        droppableId: 'inactiveConcerns',
        index: 0,
      },
      draggableId: 'activeConcern3',
    } as any;

    instance.onDragEnd(result);

    expect(wrapper.state('activeConcerns')).toEqual([
      inactiveConcern1,
      activeConcern1,
      activeConcern3,
    ]);
    expect(wrapper.state('inactiveConcerns')).toEqual([inactiveConcern2, activeConcern2]);
  });
});
