import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
    tableBody = (
      <TableLoadingError
        error={props.error}
        isLoading={props.isLoading}
        onRetryClick={props.onRetryClick}
      />);
  } else {
    tableBody = patients.map(renderPatient);
  }

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <div className={styles.tableRow}>
          <FormattedMessage id='patientPanel.firstName'>
            {(message: string) => <div className={styles.tableColumn}>{message}</div>}
          </FormattedMessage>
          <FormattedMessage id='patientPanel.lastName'>
            {(message: string) => <div className={styles.tableColumn}>{message}</div>}
          </FormattedMessage>
          <FormattedMessage id='patientPanel.age'>
            {(message: string) => <div className={styles.tableColumn}>{message}</div>}
          </FormattedMessage>
          <FormattedMessage id='patientPanel.location'>
            {(message: string) => <div className={styles.tableColumn}>{message}</div>}
          </FormattedMessage>
          <FormattedMessage id='patientPanel.joinedAt'>
            {(message: string) => <div className={styles.tableColumn}>{message}</div>}
          </FormattedMessage>
          <FormattedMessage id='patientPanel.engagedAt'>
            {(message: string) => <div className={styles.tableColumn}>{message}</div>}
          </FormattedMessage>
        </div>
      </div>
      <div className={styles.tableBody}>
        {tableBody}
      </div>
    </div>
  );
};
