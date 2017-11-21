import * as React from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { FullPatientConcernFragment } from '../../graphql/types';
import PatientConcern from './concern';
import * as styles from './css/index.css';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId?: string;
  optionsDropdownConcernId?: string;
  inactive?: boolean;
  onClick: (id: string) => void;
  onOptionsToggle: (id: string) => (e: React.MouseEvent<HTMLDivElement>) => void;
  selectedTaskId: string;
}

const PatientConcerns: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    selectedPatientConcernId,
    optionsDropdownConcernId,
    concerns,
    inactive,
    onClick,
    onOptionsToggle,
    selectedTaskId,
  } = props;

  if (!concerns.length) {
    return (
      <div className={styles.emptyCarePlanSuggestionsContainer}>
        <div className={styles.emptyCarePlanSuggestionsLogo} />
        <div className={styles.emptyCarePlanSuggestionsLabel}>
          There are no Next Up concerns for this patient
        </div>
        <div className={styles.emptyCarePlanSuggestionsSubtext}>
          Add concerns here that the patient and the care team do not want to focus on right now but
          would like to keep track of
        </div>
      </div>
    );
  }

  const renderedConcerns = concerns.map((concern, index) => {
    const selected = !!selectedPatientConcernId && selectedPatientConcernId === concern.id;
    const optionsOpen = optionsDropdownConcernId === concern.id;

    return (
      <PatientConcern
        key={concern.id}
        selected={selected}
        patientConcern={concern}
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        optionsOpen={optionsOpen}
        inactive={inactive}
        selectedTaskId={selectedTaskId}
      />
    );
  });

  const droppableId = inactive ? 'inactiveConcerns' : 'activeConcerns';

  return (
    <Droppable droppableId={droppableId} type='CONCERN'>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div ref={provided.innerRef}>
          {renderedConcerns}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default PatientConcerns;
