import * as React from 'react';
import { Link } from 'react-router-dom';
import { FullPatientSearchResultFragment } from '../graphql/types';
import { formatAgeDetails, formatDateOfBirth } from '../shared/helpers/format-helpers';
import { formatFullName } from '../shared/helpers/format-helpers';
import { formatSearchText } from '../shared/library/search/helpers';
import * as styles from './css/results.css';

interface IProps {
  searchResult: FullPatientSearchResultFragment;
  query: string;
}

const PatientSearchResult: React.StatelessComponent<IProps> = ({ searchResult, query }) => {
  const { id, firstName, lastName, dateOfBirth, gender, userCareTeam } = searchResult;

  return (
    <Link to={`/patients/${id}/map/active`} className={styles.result}>
      {userCareTeam && <div className={styles.userCareTeam} />}
      <h4 className={styles.name}>
        {formatSearchText(formatFullName(firstName, lastName), query)}
      </h4>
      <p className={styles.status}>Enrolled</p>
      <p className={styles.memberId}>CBH-1234567</p>
      <p className={styles.dateOfBirth}>
        {formatDateOfBirth(dateOfBirth)}
        <span className={styles.ageDetail}>{formatAgeDetails(dateOfBirth, gender)}</span>
      </p>
      <p className={styles.address}>830 Gaston Crescent, Apt 5A, Queens, NY</p>
    </Link>
  );
};

export default PatientSearchResult;
