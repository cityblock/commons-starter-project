import classNames from 'classnames';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullConcern } from '../graphql/types';
import concernStyles from '../shared/css/two-panel.css';
import styles from './css/risk-area-row.css';

interface IProps {
  concern: FullConcern;
  selected: boolean;
  routeBase: string;
}

export const ConcernRow: React.StatelessComponent<IProps> = props => {
  const { concern, selected, routeBase } = props;
  const concernClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = concern.createdAt ? (
    <FormattedRelative value={concern.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;
  return (
    <Link className={concernClass} to={`${routeBase}/${concern.id}`}>
      <div className={styles.title}>{concern.title}</div>
      <div className={styles.meta}>
        <div className={classNames(concernStyles.dateSection, concernStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};
