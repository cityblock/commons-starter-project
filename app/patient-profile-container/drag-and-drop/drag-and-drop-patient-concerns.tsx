import React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientConcerns from '../../shared/concerns/patient-concerns';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId: string;
  inactive: boolean;
  onClick: (id: string) => void;
  selectedTaskId: string;
  selectedGoalId: string;
  taskIdsWithNotifications?: string[];
}

const DnDPatientConcerns: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    selectedPatientConcernId,
    concerns,
    inactive,
    onClick,
    selectedTaskId,
    selectedGoalId,
    taskIdsWithNotifications,
  } = props;

  const droppableId = inactive ? 'inactiveConcerns' : 'activeConcerns';

  return (
    <Droppable droppableId={droppableId} type="CONCERN">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div ref={provided.innerRef}>
          <PatientConcerns
            concerns={concerns}
            selectedPatientConcernId={selectedPatientConcernId}
            onClick={onClick}
            selectedTaskId={selectedTaskId}
            selectedGoalId={selectedGoalId}
            inactive={inactive}
            taskIdsWithNotifications={taskIdsWithNotifications}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DnDPatientConcerns;
