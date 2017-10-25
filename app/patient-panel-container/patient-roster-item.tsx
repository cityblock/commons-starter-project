import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { ShortPatientFragment } from '../graphql/types';
import * as styles from './css/patient-roster.css';

interface IProps {
  patient: ShortPatientFragment;
}

type Props = IProps & InjectedIntlProps;

const PatientRosterItem: React.StatelessComponent<IProps> = (props: Props) => {
  const { patient, intl } = props;

  // TODO: return fallbacks to normal
  const patientAge = patient.dateOfBirth ? intl.formatRelative(patient.dateOfBirth) : '';
  const patientJoined = patient.createdAt ? intl.formatRelative(patient.createdAt) : 'Unknown';

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

export default injectIntl<IProps>(PatientRosterItem);
