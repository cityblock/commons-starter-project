import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcern } from '../../graphql/types';
import PatientConcern from '../../shared/concerns/patient-concern';

interface IProps {
  patientConcern: FullPatientConcern;
  selected: boolean;
  index: number;
  onClick: () => void;
  inactive: boolean;
  glassBreakId: string | null;
  selectedTaskId: string;
  selectedGoalId: string;
  taskIdsWithNotifications?: string[];
  currentUserId: string;
}

export const DnDPatientConcern: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    onClick,
    patientConcern,
    selected,
    inactive,
    glassBreakId,
    selectedTaskId,
    selectedGoalId,
    taskIdsWithNotifications,
    currentUserId,
    index,
  } = props;

  return (
    <Draggable
      draggableId={patientConcern.id}
      index={index}
      isDragDisabled={!!selectedTaskId || selected}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const onClickFull = (() => {
          // if dragHandleProps null such as when dragging disabled
          if (!provided.dragHandleProps) {
            return onClick;
          }
          // creating a new onClick function that calls our onClick event
          return (event?: React.MouseEvent<HTMLDivElement>) => {
            if (event) {
              onClick();
            }
          };
        })();

        return (
          <div>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps as any}
              {...provided.dragHandleProps}
            >
              <PatientConcern
                patientConcern={patientConcern}
                onClick={onClickFull}
                selected={selected}
                inactive={inactive}
                glassBreakId={glassBreakId}
                selectedTaskId={selectedTaskId}
                selectedGoalId={selectedGoalId}
                isDragging={snapshot.isDragging}
                taskIdsWithNotifications={taskIdsWithNotifications}
                currentUserId={currentUserId}
              />
            </div>
            {provided.placeholder}
          </div>
        );
      }}
    </Draggable>
  );
};

export default DnDPatientConcern;
