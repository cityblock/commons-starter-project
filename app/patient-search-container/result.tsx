import * as React from 'react';
import { Link } from 'react-router-dom';
import { FullPatientSearchResultFragment } from '../graphql/types';
import { formatFullName } from '../shared/helpers/format-helpers';
import PatientAge from '../shared/library/patient-age/patient-age';
import { formatSearchText } from '../shared/library/search/helpers';
import * as styles from './css/results.css';

interface IProps {
  searchResult: FullPatientSearchResultFragment;
  query: string;
}

const PatientSearchResult: React.StatelessComponent<IProps> = ({ searchResult, query }) => {
  const { id, firstName, lastName, dateOfBirth, patientInfo, userCareTeam } = searchResult;

  return (
    <Link to={`/patients/${id}/map/active`} className={styles.result}>
      {userCareTeam && <div className={styles.userCareTeam} />}
      <h4 className={styles.name}>
        {formatSearchText(formatFullName(firstName, lastName), query)}
      </h4>
      <p className={styles.status}>Enrolled</p>
      <p className={styles.memberId}>CBH-1234567</p>
      <PatientAge dateOfBirth={dateOfBirth} gender={patientInfo.gender} />
      <p className={styles.address}>830 Gaston Crescent, Apt 5A, Queens, NY</p>
    </Link>
  );
};

export default PatientSearchResult;
