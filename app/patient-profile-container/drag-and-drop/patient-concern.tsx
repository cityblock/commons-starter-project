import * as React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientConcern from '../../shared/concerns/patient-concern';

interface IProps {
  patientConcern: FullPatientConcernFragment;
  selected: boolean;
  optionsOpen: boolean;
  onClick: () => void;
  onOptionsToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
  inactive: boolean;
  selectedTaskId: string;
}

export const DnDPatientConcern: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    onClick,
    onOptionsToggle,
    patientConcern,
    selected,
    optionsOpen,
    inactive,
    selectedTaskId,
  } = props;

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
          return (event: React.MouseEvent<HTMLDivElement>) => {
            provided.dragHandleProps!.onClick(event);
            onClick();
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
                onOptionsToggle={onOptionsToggle}
                selected={selected}
                optionsOpen={optionsOpen}
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
