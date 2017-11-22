import * as React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientConcerns from '../../shared/concerns/patient-concerns';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId: string;
  optionsDropdownConcernId: string;
  inactive: boolean;
  onClick: (id: string) => void;
  onOptionsToggle: (id: string) => (e: React.MouseEvent<HTMLDivElement>) => void;
  selectedTaskId: string;
}

const DnDPatientConcerns: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    selectedPatientConcernId,
    optionsDropdownConcernId,
    concerns,
    inactive,
    onClick,
    onOptionsToggle,
    selectedTaskId,
  } = props;

  const droppableId = inactive ? 'inactiveConcerns' : 'activeConcerns';

  return (
    <Droppable droppableId={droppableId} type="CONCERN">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div ref={provided.innerRef}>
          <PatientConcerns
            concerns={concerns}
            selectedPatientConcernId={selectedPatientConcernId}
            optionsDropdownConcernId={optionsDropdownConcernId}
            onClick={onClick}
            onOptionsToggle={onOptionsToggle}
            selectedTaskId={selectedTaskId}
            inactive={inactive}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DnDPatientConcerns;
