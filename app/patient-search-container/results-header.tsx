import * as React from 'react';
import * as styles from './css/results.css';
import { PatientSearchResultsColumnHeader } from './helpers';

const PatientSearchResultsHeader: React.StatelessComponent<{}> = () => (
  <div className={styles.headerContainer}>
    <PatientSearchResultsColumnHeader messageId="patientSearch.name" className={styles.name} />
    <PatientSearchResultsColumnHeader messageId="patientSearch.status" className={styles.status} />
    <PatientSearchResultsColumnHeader
      messageId="patientSearch.memberId"
      className={styles.memberId}
    />
    <PatientSearchResultsColumnHeader
      messageId="patientSearch.dateOfBirth"
      className={styles.dateOfBirth}
    />
    <PatientSearchResultsColumnHeader
      messageId="patientSearch.address"
      className={styles.address}
    />
  </div>
);

export default PatientSearchResultsHeader;
