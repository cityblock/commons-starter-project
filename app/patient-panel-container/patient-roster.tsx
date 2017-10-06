import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ShortPatientFragment } from '../graphql/types';
import * as styles from './css/patient-roster.css';
import { Pagination } from './pagination';
import PatientRosterItem from './patient-roster-item';
import { TableLoadingError } from './table-loading-error';

interface IProps {
  patients: ShortPatientFragment[];
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextClick: () => any;
  onPreviousClick: () => any;
  isLoading: boolean;
  error?: string;
  onRetryClick: () => any;
}

function renderPatient(patient: ShortPatientFragment) {
  return <PatientRosterItem key={patient.id} patient={patient} />;
}

export const PatientRoster: React.StatelessComponent<IProps> = props => {
  const { patients, hasNextPage, hasPreviousPage, onNextClick, onPreviousClick } = props;
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
        <Pagination
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onNextClick={onNextClick}
          onPreviousClick={onPreviousClick}
        />
      </div>
    </div>
  );
};
