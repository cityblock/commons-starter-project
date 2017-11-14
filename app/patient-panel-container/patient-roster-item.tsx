import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { ShortPatientFragment } from '../graphql/types';
import * as styles from './css/patient-roster.css';

interface IProps {
  patient: ShortPatientFragment;
}

const PatientRosterItem: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient } = props;

  const patientAge = patient.dateOfBirth ? (
    <FormattedRelative value={patient.dateOfBirth}>
      {(date: string) => <div className={styles.tableColumn}>{date}</div>}
    </FormattedRelative>
  ) : (
    'unknown'
  );

  const patientJoined = patient.createdAt ? (
    <FormattedRelative value={patient.createdAt}>
      {(date: string) => <div className={styles.tableColumn}>{date}</div>}
    </FormattedRelative>
  ) : (
    'unknown'
  );
  return (
    <Link className={styles.tableRow} to={`/patients/${patient.id}`}>
      <div className={styles.tableColumn}>{patient.firstName}</div>
      <div className={styles.tableColumn}>{patient.lastName}</div>
      <div className={styles.tableColumn}>{patientAge}</div>
      <div className={styles.tableColumn}>{patient.zip}</div>
      <div className={styles.tableColumn}>{patientJoined}</div>
      <div className={styles.tableColumn} />
    </Link>
  );
};

export default PatientRosterItem;
