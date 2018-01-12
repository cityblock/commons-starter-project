import * as React from 'react';
import { formatAgeDetails, formatDateOfBirth } from '../../helpers/format-helpers';
import * as styles from './css/patient-age.css';

interface IProps {
  dateOfBirth: string | null;
  gender: string | null;
}

const PatientSearchResult: React.StatelessComponent<IProps> = (props: IProps) => {
  const { dateOfBirth, gender } = props;

  return (
    <p className={styles.dateOfBirth}>
      {formatDateOfBirth(dateOfBirth)}
      <span className={styles.ageDetail}>{formatAgeDetails(dateOfBirth, gender)}</span>
    </p>
  );
};

export default PatientSearchResult;
