import { shallow } from 'enzyme';
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import DnDPatientConcern from '../drag-and-drop-patient-concern';

describe('Drag and Drop Patient Concern', () => {
  const placeholderFn = jest.fn();
  const id = 'vulpix';
  const index = 11;
  const userId = 'growlithe';

  const wrapper = shallow(
    <DnDPatientConcern
      patientConcern={{ id } as any}
      selected={false}
      index={index}
      onClick={placeholderFn}
      inactive={false}
      selectedTaskId=""
      selectedGoalId=""
      currentUserId={userId}
    />,
  );

  it('returns draggable component with correct props', () => {
    expect(wrapper.find(Draggable).length).toBe(1);
    expect(wrapper.find(Draggable).props().draggableId).toBe(id);
    expect(wrapper.find(Draggable).props().index).toBe(index);
    expect(wrapper.find(Draggable).props().isDragDisabled).toBeFalsy();
  });

  it('disables dragging if a task is selected', () => {
    const wrapper2 = shallow(
      <DnDPatientConcern
        patientConcern={{ id } as any}
        selected={false}
        index={1}
        onClick={placeholderFn}
        inactive={false}
        selectedTaskId="ninetales"
        selectedGoalId=""
        currentUserId={userId}
      />,
    );

    expect(wrapper2.find(Draggable).props().isDragDisabled).toBeTruthy();
  });

  it('disables dragging if concern is expanded', () => {
    const wrapper2 = shallow(
      <DnDPatientConcern
        patientConcern={{ id } as any}
        selected={true}
        index={1}
        onClick={placeholderFn}
        inactive={false}
        selectedTaskId=""
        selectedGoalId=""
        currentUserId={userId}
      />,
    );

    expect(wrapper2.find(Draggable).props().isDragDisabled).toBeTruthy();
  });
});
