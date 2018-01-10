import * as React from 'react';
import { FullPatientForDashboardFragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import * as styles from './css/patient-list.css';
import PatientWithTasksListItem from './patient-with-tasks-list-item';

interface IProps {
  patients: FullPatientForDashboardFragment[];
}

const PatientWithTasksList: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patients } = props;

  if (!patients.length) {
    return (
      <div className={styles.empty}>
        <EmptyPlaceholder headerMessageId="dashboard.noUrgentTasks" />
      </div>
    );
  }

  const renderedPatients = patients.map(patient => (
    <PatientWithTasksListItem key={patient.id} patient={patient} />
  ));

  return <div className={styles.list}>{renderedPatients}</div>;
};

export default PatientWithTasksList;