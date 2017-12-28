import * as React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientConcern from '../../shared/concerns/patient-concern';

interface IProps {
  patientConcern: FullPatientConcernFragment;
  selected: boolean;
  onClick: () => void;
  inactive: boolean;
  selectedTaskId: string;
}

export const DnDPatientConcern: React.StatelessComponent<IProps> = (props: IProps) => {
  const { onClick, patientConcern, selected, inactive, selectedTaskId } = props;

  return (
    <Draggable
      draggableId={patientConcern.id}
      type="CONCERN"
      isDragDisabled={!!selectedTaskId || selected}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const onClickFull = (() => {
          // if dragHandleProps null such as when dragging disabled
          if (!provided.dragHandleProps) {
            return onClick;
          }
          // creating a new onClick function that calls our onClick
          // event as well as the provided one.
          return (event?: React.MouseEvent<HTMLDivElement>) => {
            if (event) {
              provided.dragHandleProps!.onClick(event);
              onClick();
            }
          };
        })();

        return (
          <div>
            <div
              ref={provided.innerRef}
              style={provided.draggableStyle}
              {...provided.dragHandleProps}
            >
              <PatientConcern
                patientConcern={patientConcern}
                onClick={onClickFull}
                selected={selected}
                inactive={inactive}
                selectedTaskId={selectedTaskId}
                isDragging={snapshot.isDragging}
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
