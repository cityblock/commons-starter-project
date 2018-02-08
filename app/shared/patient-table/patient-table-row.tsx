import * as React from 'react';
import { Link } from 'react-router-dom';
import { FullPatientTableRowFragment } from '../../graphql/types';
import { formatFullName } from '../helpers/format-helpers';
import PatientAge from '../library/patient-age/patient-age';
import { formatSearchText } from '../library/search/helpers';
import * as styles from './css/patient-table.css';

interface IProps {
  patient: FullPatientTableRowFragment;
  query?: string;
}

const PatientTableRow: React.StatelessComponent<IProps> = ({ patient, query }) => {
  const { id, firstName, lastName, dateOfBirth, patientInfo, userCareTeam } = patient;
  const fullName = formatFullName(firstName, lastName);
  const formattedName = query ? formatSearchText(fullName, query) : fullName;

  return (
    <Link to={`/patients/${id}/map/active`} className={styles.result}>
      {userCareTeam && <div className={styles.userCareTeam} />}
      <h4 className={styles.name}>{formattedName}</h4>
      <p className={styles.status}>Enrolled</p>
      <p className={styles.memberId}>CBH-1234567</p>
      <PatientAge dateOfBirth={dateOfBirth} gender={patientInfo.gender} />
      <p className={styles.address}>830 Gaston Crescent, Apt 5A, Queens, NY</p>
    </Link>
  );
};

export default PatientTableRow;
