import * as moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { DATETIME_FORMAT } from '../config';
import * as styles from '../css/components/patient-roster.css';

import { ShortPatientFragment } from '../graphql/types';

interface IProps {
  patient: ShortPatientFragment;
}

export const PatientRosterItem: React.StatelessComponent<IProps> = props => {
  const { patient } = props;

  const patientAge = patient.dateOfBirth ?
    moment(patient.dateOfBirth, DATETIME_FORMAT).fromNow(true) :
    'Unknown';
  const patientJoined = patient.createdAt ?
    moment(patient.createdAt, DATETIME_FORMAT).fromNow(true) :
    'Unknown';

  return (
    <Link className={styles.tableRow} to={`/patients/${patient.id}`}>
      <div className={styles.tableColumn}>{patient.firstName}</div>
      <div className={styles.tableColumn}>{patient.lastName}</div>
      <div className={styles.tableColumn}>{patientAge}</div>
      <div className={styles.tableColumn}>{patient.zip}</div>
      <div className={styles.tableColumn}>{patientJoined}</div>
      <div className={styles.tableColumn}>No clue</div>
    </Link>
  );
};
