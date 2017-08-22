import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullConcernFragment } from '../graphql/types';
import * as styles from './css/risk-area-row.css';
import * as concernStyles from './css/two-panel-admin.css';

export interface IProps {
  concern: FullConcernFragment;
  selected: boolean;
  routeBase: string;
}

export const ConcernRow: React.StatelessComponent<IProps> = props => {
  const { concern, selected, routeBase } = props;
  const concernClass = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = concern.createdAt ?
    (<FormattedRelative value={concern.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>) : null;
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
