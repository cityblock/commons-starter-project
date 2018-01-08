import * as React from 'react';
import Icon from '../icon/icon';
import * as styles from './css/pagination.css';
import PaginationInfo from './pagination-info';

interface ISearchPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface IProps {
  pageInfo: ISearchPageInfo;
  total: number; // total number of results
  pageNumber: number; // do NOT add 1
  pageSize: number;
  onPaginate: (pageBack: boolean) => void;
}

const Pagination: React.StatelessComponent<IProps> = (props: IProps) => {
  const { pageInfo, total, pageNumber, pageSize, onPaginate } = props;

  return (
    <div className={styles.container}>
      {pageInfo.hasPreviousPage ? (
        <Icon name="keyboardArrowLeft" onClick={() => onPaginate(true)} className={styles.icon} />
      ) : (
        <div className={styles.empty} />
      )}
      <PaginationInfo currentPage={pageNumber + 1} totalPages={Math.ceil(total / pageSize)} />
      {pageInfo.hasNextPage ? (
        <Icon name="keyboardArrowRight" onClick={() => onPaginate(false)} className={styles.icon} />
      ) : (
        <div className={styles.empty} />
      )}
    </div>
  );
};

export default Pagination;
