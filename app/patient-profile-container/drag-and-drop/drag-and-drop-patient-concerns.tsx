import React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcern } from '../../graphql/types';
import PatientConcerns from '../../shared/concerns/patient-concerns';

interface IProps {
  concerns: FullPatientConcern[];
  selectedPatientConcernId: string;
  inactive: boolean;
  onClick: (id: string) => void;
  selectedTaskId: string;
  selectedGoalId: string;
  taskIdsWithNotifications?: string[];
  glassBreakId: string | null;
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
    glassBreakId,
  } = props;

  const droppableId = inactive ? 'inactiveConcerns' : 'activeConcerns';

  return (
    <Droppable droppableId={droppableId} type="CONCERN">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div ref={provided.innerRef}>
          <PatientConcerns
            concerns={concerns}
            glassBreakId={glassBreakId}
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
