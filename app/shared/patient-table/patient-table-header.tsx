import * as React from 'react';
import * as styles from './css/patient-table.css';
import { PatientTableColumnHeader } from './helper-components';

const PatientTableHeader: React.StatelessComponent<{}> = () => (
  <div className={styles.headerContainer}>
    <PatientTableColumnHeader messageId="patientTable.name" className={styles.name} />
    <PatientTableColumnHeader messageId="patientTable.status" className={styles.status} />
    <PatientTableColumnHeader messageId="patientTable.memberId" className={styles.memberId} />
    <PatientTableColumnHeader messageId="patientTable.dateOfBirth" className={styles.dateOfBirth} />
    <PatientTableColumnHeader messageId="patientTable.address" className={styles.address} />
  </div>
);

export default PatientTableHeader;
