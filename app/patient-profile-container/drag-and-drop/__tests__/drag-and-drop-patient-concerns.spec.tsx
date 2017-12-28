import { shallow } from 'enzyme';
import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DnDPatientConcerns from '../drag-and-drop-patient-concerns';

describe('Drag and Drop Patient Concerns Component', () => {
  const placeholderFn = () => true as any;

  it('renders droppable wrapper for inactive concerns', () => {
    const wrapper = shallow(
      <DnDPatientConcerns
        concerns={[]}
        selectedPatientConcernId=""
        inactive={true}
        onClick={placeholderFn}
        selectedTaskId=""
      />,
    );

    expect(wrapper.find(Droppable).length).toBe(1);
    expect(wrapper.find(Droppable).props().type).toBe('CONCERN');
    expect(wrapper.find(Droppable).props().droppableId).toBe('inactiveConcerns');
  });

  it('renders droppable wrapper for inactive concerns', () => {
    const wrapper = shallow(
      <DnDPatientConcerns
        concerns={[]}
        selectedPatientConcernId=""
        inactive={false}
        onClick={placeholderFn}
        selectedTaskId=""
      />,
    );

    expect(wrapper.find(Droppable).length).toBe(1);
    expect(wrapper.find(Droppable).props().type).toBe('CONCERN');
    expect(wrapper.find(Droppable).props().droppableId).toBe('activeConcerns');
  });
});
