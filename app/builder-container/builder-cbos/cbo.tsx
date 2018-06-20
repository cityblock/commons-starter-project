import classNames from 'classnames';
import React from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { FullCBO } from '../../graphql/types';
import sharedStyles from '../../shared/css/two-panel.css';
import styles from '../css/risk-area-row.css';

interface IProps {
  CBOItem: FullCBO;
  routeBase: string;
  selected: boolean;
}

const CBO: React.StatelessComponent<IProps> = (props: IProps) => {
  const { CBOItem, routeBase, selected } = props;
  const containerStyles = classNames(styles.container, {
    [styles.selected]: selected,
  });
  const formattedCreatedAt = CBOItem.createdAt ? (
    <FormattedRelative value={CBOItem.createdAt}>
      {(date: string) => <span className={styles.dateValue}>{date}</span>}
    </FormattedRelative>
  ) : null;

  return (
    <Link className={containerStyles} to={`${routeBase}/${CBOItem.id}`}>
      <div className={styles.title}>{CBOItem.name}</div>
      <div className={styles.meta}>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>Category:</span>
          <span className={styles.dateValue}>{CBOItem.category.title}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.orderSection)}>
          <span className={styles.dateLabel}>Address:</span>
          <span className={styles.dateValue}>{CBOItem.address}</span>
        </div>
        <div className={classNames(sharedStyles.dateSection, sharedStyles.createdAtSection)}>
          <span className={styles.dateLabel}>Created:</span>
          {formattedCreatedAt}
        </div>
      </div>
    </Link>
  );
};

export default CBO;
