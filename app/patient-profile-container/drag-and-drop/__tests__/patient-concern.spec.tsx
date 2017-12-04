import { shallow } from 'enzyme';
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import DnDPatientConcern from '../patient-concern';

describe('Drag and Drop Patient Concern', () => {
  const placeholderFn = () => true as any;
  const id = 'vulpix';

  const wrapper = shallow(
    <DnDPatientConcern
      patientConcern={{ id } as any}
      selected={false}
      onClick={placeholderFn}
      inactive={false}
      selectedTaskId=""
    />,
  );

  it('returns draggable component with correct props', () => {
    expect(wrapper.find(Draggable).length).toBe(1);
    expect(wrapper.find(Draggable).props().draggableId).toBe(id);
    expect(wrapper.find(Draggable).props().type).toBe('CONCERN');
    expect(wrapper.find(Draggable).props().isDragDisabled).toBeFalsy();
  });

  it('disables dragging if a task is selected', () => {
    const wrapper2 = shallow(
      <DnDPatientConcern
        patientConcern={{ id } as any}
        selected={false}
        onClick={placeholderFn}
        inactive={false}
        selectedTaskId="ninetales"
      />,
    );

    expect(wrapper2.find(Draggable).props().isDragDisabled).toBeTruthy();
  });

  it('disables dragging if concern is expanded', () => {
    const wrapper2 = shallow(
      <DnDPatientConcern
        patientConcern={{ id } as any}
        selected={true}
        onClick={placeholderFn}
        inactive={false}
        selectedTaskId=""
      />,
    );

    expect(wrapper2.find(Draggable).props().isDragDisabled).toBeTruthy();
  });
});
