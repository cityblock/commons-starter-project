import * as React from 'react';
import { PatientRosterItem } from '../components/patient-roster-item';
import { TableLoadingError } from '../components/table-loading-error';
import * as styles from '../css/components/patient-roster.css';
import { ShortPatientFragment } from '../graphql/types';

export interface IProps {
  patients: ShortPatientFragment[];
  isLoading: boolean;
  error?: string;
  onRetryClick: () => any;
}

function renderPatient(patient: ShortPatientFragment) {
  return <PatientRosterItem key={patient.id} patient={patient} />;
}

export const PatientRoster: React.StatelessComponent<IProps> = props => {
  const { patients } = props;
  let tableBody: any;

  if (props.error || props.isLoading) {
    tableBody = <TableLoadingError
                  error={props.error}
                  isLoading={props.isLoading}
                  onRetryClick={props.onRetryClick}
                />;
  } else {
    tableBody = patients.map(renderPatient);
  }

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <div className={styles.tableRow}>
          <div className={styles.tableColumn}>First name</div>
          <div className={styles.tableColumn}>Last name</div>
          <div className={styles.tableColumn}>Age</div>
          <div className={styles.tableColumn}>Location</div>
          <div className={styles.tableColumn}>Patient joined</div>
          <div className={styles.tableColumn}>Last engagement</div>
        </div>
      </div>
      <div className={styles.tableBody}>
        {tableBody}
      </div>
    </div>
  );
};
