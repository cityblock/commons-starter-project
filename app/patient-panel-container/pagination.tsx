import * as classNames from 'classnames';
import * as React from 'react';
import * as styles from './css/pagination.css';

interface IProps {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextClick: () => any;
  onPreviousClick: () => any;
}

export const Pagination: React.StatelessComponent<IProps> = props => {
  const prevButtonStyle = classNames(
    styles.paginationButton,
    styles.previousButton,
    { [styles.hidden]: !props.hasPreviousPage },
  );

  const nextButtonStyle = classNames(
    styles.paginationButton,
    styles.nextButton,
    { [styles.hidden]: !props.hasNextPage },
  );

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationRow}>
        <div className={prevButtonStyle} onClick={props.onPreviousClick}></div>
        <div className={nextButtonStyle} onClick={props.onNextClick}></div>
      </div>
    </div>
  );
};
