import * as React from 'react';
import { FullPatientConcernFragment } from '../../graphql/types';
import DnDPatientConcern from '../../patient-profile-container/drag-and-drop/drag-and-drop-patient-concern';
import EmptyPlaceholder from '../library/empty-placeholder/empty-placeholder';
import * as styles from './css/patient-concerns.css';

interface IProps {
  concerns: FullPatientConcernFragment[];
  selectedPatientConcernId: string;
  inactive?: boolean;
  onClick: (id: string) => void;
  selectedTaskId: string;
  taskIdsWithNotifications?: string[];
}

const PatientConcerns: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    selectedPatientConcernId,
    concerns,
    inactive,
    onClick,
    selectedTaskId,
    taskIdsWithNotifications,
  } = props;

  if (inactive && !concerns.length) {
    return (
      <div className={styles.container}>
        <EmptyPlaceholder
          headerMessageId="patientMap.emptyNextUpHeader"
          detailMessageId="patientMap.emptyNextUpDetail"
        />
      </div>
    );
  }

  const renderedConcerns = concerns.map((concern, index) => {
    const selected = !!selectedPatientConcernId && selectedPatientConcernId === concern.id;

    return (
      <DnDPatientConcern
        key={concern.id}
        selected={selected}
        patientConcern={concern}
        onClick={() => onClick(concern.id)}
        inactive={inactive || false}
        selectedTaskId={selectedTaskId}
        taskIdsWithNotifications={taskIdsWithNotifications}
      />
    );
  });

  return <div className={styles.container}>{renderedConcerns}</div>;
};

export default PatientConcerns;
