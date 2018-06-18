import classNames from 'classnames';
import React from 'react';
import Icon from '../icon/icon';
import styles from './css/pagination.css';
import PaginationInfo from './pagination-info';

interface ISearchPageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface IProps {
  pageInfo: ISearchPageInfo;
  totalCount: number; // total number of results
  pageNumber: number; // do NOT add 1
  pageSize: number;
  onPaginate: (pageBack: boolean) => void;
  className?: string; // optional styles
}

const Pagination: React.StatelessComponent<IProps> = (props: IProps) => {
  const { pageInfo, totalCount, pageNumber, pageSize, onPaginate, className } = props;

  return (
    <div className={classNames(styles.container, className)}>
      {pageInfo.hasPreviousPage ? (
        <Icon name="keyboardArrowLeft" onClick={() => onPaginate(true)} className={styles.icon} />
      ) : (
        <div className={styles.empty} />
      )}
      <PaginationInfo currentPage={pageNumber + 1} totalPages={Math.ceil(totalCount / pageSize)} />
      {pageInfo.hasNextPage ? (
        <Icon name="keyboardArrowRight" onClick={() => onPaginate(false)} className={styles.icon} />
      ) : (
        <div className={styles.empty} />
      )}
    </div>
  );
};

export default Pagination;
