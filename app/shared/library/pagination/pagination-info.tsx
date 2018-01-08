import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/pagination-info.css';

interface IProps {
  currentPage: number;
  totalPages: number;
}

const PaginationInfo: React.StatelessComponent<IProps> = (props: IProps) => {
  const { currentPage, totalPages } = props;

  return (
    <div className={styles.paginationInfo}>
      <h3 className={styles.currentPage}>{currentPage}</h3>
      <FormattedMessage id="patientSearch.of">
        {(message: string) => <h3>{message}</h3>}
      </FormattedMessage>
      <h3>{totalPages}</h3>
    </div>
  );
};

export default PaginationInfo;
