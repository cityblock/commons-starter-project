import * as React from 'react';
import Icon from '../shared/library/icon/icon';
import * as styles from './css/pagination.css';
import { PatientSearchPaginationInfo } from './helpers';

interface IPatientSearchPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface IProps {
  pageInfo: IPatientSearchPageInfo | null;
  totalPages: number | null;
  currentPage: number | null;
  onPaginate: (pageBack: boolean) => void;
}

const PatientSearchPagination: React.StatelessComponent<IProps> = (props: IProps) => {
  const { pageInfo, totalPages, currentPage, onPaginate } = props;

  if (currentPage === null || pageInfo === null || !totalPages) return null;

  return (
    <div className={styles.container}>
      {pageInfo.hasPreviousPage ? (
        <Icon name="keyboardArrowLeft" onClick={() => onPaginate(true)} className={styles.icon} />
      ) : (
        <div className={styles.empty} />
      )}
      <PatientSearchPaginationInfo currentPage={currentPage} totalPages={totalPages} />
      {pageInfo.hasNextPage ? (
        <Icon name="keyboardArrowRight" onClick={() => onPaginate(false)} className={styles.icon} />
      ) : (
        <div className={styles.empty} />
      )}
    </div>
  );
};

export default PatientSearchPagination;
